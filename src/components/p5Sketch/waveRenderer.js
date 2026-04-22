import { drawTree } from './treeRenderer'
import { WAVE_CONFIG } from './config'

export function renderWaves(p, waveConfigs, noiseGenerators, layerCount, resolution, time, ripples, fadeProgress, fadeDuration, colorFadeStart, waveDensity, waveOffsetX, amplitude) {
    for (let layer = 0; layer < layerCount; layer++) {
        const config = waveConfigs[layer]
        const noise = noiseGenerators[layer]

        const layerNorm = layer / (layerCount - 1)
        const perpExtent = (p.width + p.height) / Math.sqrt(2)

        // Adjust perpendicular extent based on density (higher density = zoom in = less extent)
        const densityScale = p.map(waveDensity, 1, 10, 1.5, 0.3)
        const layerOffset = p.map(layerNorm, 0, 1,
            perpExtent * WAVE_CONFIG.perpendicularExtent.min * densityScale,
            perpExtent * WAVE_CONFIG.perpendicularExtent.max * densityScale)

        // Generate wave buffer
        const buffer = generateWaveBuffer(p, config, noise, layerOffset, resolution, time, waveOffsetX, amplitude)

        // Calculate colors
        const colors = calculateWaveColors(p, config, buffer, time, ripples, layerOffset,
            fadeProgress, colorFadeStart, fadeDuration)

        // Render wave shape
        renderWaveShape(p, buffer, colors, colors.colorFadeAmount)

        // Render trees
        renderTreesForLayer(p, config, layerOffset, time, waveOffsetX)
    }
}

function generateWaveBuffer(p, config, noise, layerOffset, resolution, time, waveOffsetX, amplitude) {
    const buffer = []
    const diagonalLength = Math.sqrt(p.width * p.width + p.height * p.height)
    const numPoints = Math.ceil(diagonalLength / resolution)

    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints
        const distance = t * diagonalLength * 1.8 - diagonalLength * 0.5

        const baseX = distance * Math.cos(Math.PI / 4) + layerOffset * Math.cos(Math.PI / 4 + Math.PI / 2)
        const baseY = distance * Math.sin(Math.PI / 4) + layerOffset * Math.sin(Math.PI / 4 + Math.PI / 2)

        const displacement = calculateDisplacement(p, config, noise, distance, layerOffset, time, baseX, baseY, waveOffsetX, amplitude)

        const perpAngle = Math.PI / 4 + Math.PI / 2
        const x = baseX + Math.cos(perpAngle) * displacement + waveOffsetX
        const y = baseY + Math.sin(perpAngle) * displacement

        buffer.push({ x, y })
    }

    return buffer
}

function calculateDisplacement(p, config, noise, distance, layerOffset, time, baseX, baseY, waveOffsetX, amplitude) {
    const scrollOffset = time * config.speed * 20
    const wavePhase = (distance + scrollOffset + config.phaseOffset) * (p.TWO_PI / config.wavelength)

    const noiseBase = noise.base.noise2D(
        distance * 0.003 + time * config.speed * 0.05,
        layerOffset * 0.001 + time * config.speed * 0.03
    )

    const lowFreqNoise = noise.base.noise2D(
        distance * 0.0008 + time * config.speed * 0.02,
        layerOffset * 0.0003 + time * config.speed * 0.015
    )

    const wave1 = p.sin(wavePhase + noiseBase * 2) * (0.7 + noiseBase * 0.2)
    const wave2 = p.sin(wavePhase * 2.3 + time * 0.3 + noiseBase) * 0.25
    const wave3 = p.sin(wavePhase * 1.7 + time * 0.5) * 0.2
    const wave4 = p.sin(wavePhase * 0.3 + time * 0.2) * 0.35
    const wave5 = p.sin(wavePhase * 3.8 + time * 0.7) * 0.08
    const wave6 = p.sin(wavePhase * 5.5 + time * 1.1 + noiseBase * 1.5) * 0.05

    const grainNoise = noise.grain.noise2D(
        distance * 0.015 + time * config.speed * 0.1,
        time * config.speed * 0.2
    )

    const combinedWave = (wave1 + wave2 + wave3 + wave4 + wave5 + wave6 + noiseBase * 0.3 + lowFreqNoise * 0.5) / 2.8
    const textureDetail = grainNoise * (1 - config.smoothness) * 0.5

    let displacement = (combinedWave * config.baseAmp + textureDetail * config.grainAmp) * config.parallaxScale * amplitude

    // Mouse interaction - account for wave offset when calculating distance to mouse
    const mouseInfluenceRadius = 200
    const adjustedBaseX = baseX + waveOffsetX
    const distToMouse = p.dist(adjustedBaseX, baseY, p.mouseX, p.mouseY)
    if (distToMouse < mouseInfluenceRadius) {
        const influence = 1 - (distToMouse / mouseInfluenceRadius)
        const pushStrength = influence * influence * 150
        const angle = p.atan2(baseY - p.mouseY, adjustedBaseX - p.mouseX)
        displacement += p.sin(angle) * pushStrength
    }

    return displacement
}

function calculateWaveColors(p, config, buffer, time, ripples, layerOffset, fadeProgress, colorFadeStart, fadeDuration) {
    // Mouse influence
    const mouseDistanceInfluenceRadius = 150
    let minDistToLine = Infinity
    buffer.forEach(pt => {
        const d = p.dist(pt.x, pt.y, p.mouseX, p.mouseY)
        if (d < minDistToLine) minDistToLine = d
    })
    const colorInfluence = minDistToLine < mouseDistanceInfluenceRadius
        ? 1 - (minDistToLine / mouseDistanceInfluenceRadius)
        : 0

    // Color mutation
    const colorMutationRate = config.speed * 0.5
    const hueShift = (time * colorMutationRate) % 360

    let blendedHue = (config.hue + hueShift) % 360
    let blendedSat = config.sat
    let blendedBrt = config.brt
    let blendedOpacity = config.opacity

    // Fade in
    let colorFadeAmount = fadeProgress <= colorFadeStart
        ? 0
        : (fadeProgress - colorFadeStart) / (fadeDuration - colorFadeStart)

    blendedSat = p.lerp(0, blendedSat, colorFadeAmount)
    blendedBrt = p.lerp(100, blendedBrt, colorFadeAmount)
    blendedOpacity = p.lerp(blendedOpacity, 100, colorInfluence * 0.9)

    // Apply ripples
    ripples.forEach(ripple => {
        const { influence, color } = ripple.getInfluenceAndColor(layerOffset)
        if (influence > 0 && color) {
            blendedHue = p.lerp(blendedHue, color.h, influence)
            blendedSat = p.lerp(blendedSat, color.s, influence)
            blendedBrt = p.lerp(blendedBrt, color.b, influence)
            blendedOpacity = p.lerp(blendedOpacity, 100, influence)
        }
    })

    return { hue: blendedHue, sat: blendedSat, brt: blendedBrt, opacity: blendedOpacity, colorFadeAmount }
}

function renderWaveShape(p, buffer, colors, colorFadeAmount) {
    // Fade out stroke as colors fade in
    const strokeAlpha = p.lerp(60, 0, colorFadeAmount)
    p.stroke(0, 0, 0, strokeAlpha)
    p.strokeWeight(1.5)
    p.fill(colors.hue, colors.sat, colors.brt, colors.opacity)
    p.beginShape()

    buffer.forEach(pt => p.vertex(pt.x, pt.y))

    if (buffer.length > 0) {
        const perpAngle = Math.PI / 4 + Math.PI / 2
        const lastPt = buffer[buffer.length - 1]
        p.vertex(lastPt.x + Math.cos(perpAngle) * 3000, lastPt.y + Math.sin(perpAngle) * 3000)

        const firstPt = buffer[0]
        p.vertex(firstPt.x + Math.cos(perpAngle) * 3000, firstPt.y + Math.sin(perpAngle) * 3000)
    }

    p.endShape(p.CLOSE)
}

function renderTreesForLayer(p, config, layerOffset, time, waveOffsetX) {
    config.trees.forEach(tree => {
        const baseX = tree.diagonalPos * Math.cos(Math.PI / 4) + layerOffset * Math.cos(Math.PI / 4 + Math.PI / 2)
        const baseY = tree.diagonalPos * Math.sin(Math.PI / 4) + layerOffset * Math.sin(Math.PI / 4 + Math.PI / 2)

        const maxDisplacement = (config.baseAmp + config.grainAmp) * config.parallaxScale

        const perpAngle = Math.PI / 4 + Math.PI / 2
        const treeX = baseX + Math.cos(perpAngle) * maxDisplacement + waveOffsetX
        const treeY = baseY + Math.sin(perpAngle) * maxDisplacement - tree.size * 0.5

        // Only draw tree if its top is within screen bounds
        const treeTop = treeY - tree.size
        if (treeTop > 0 && treeX > -tree.size && treeX < p.width + tree.size) {
            drawTree(p, treeX, treeY, tree.size, tree.hue, tree.branches, time, tree.branchNoise)
        }
    })
}
