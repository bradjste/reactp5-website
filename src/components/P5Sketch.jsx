import React, { useRef, useEffect } from 'react'
import p5 from 'p5'
import openSimplexNoise from '../OpenSimplexNoise'

export default function P5Sketch() {
    const containerRef = useRef(null)
    const p5InstanceRef = useRef(null)

    useEffect(() => {
        function sketch(p) {
            let phase = 0
            const layerCount = 30
            const resolution = 3
            let noiseGenerators = []
            let waveConfigs = []
            let trails = []
            let blobNoise = openSimplexNoise(99999)
            let prevMouseX = 0
            let prevMouseY = 0
            let mouseVelocity = 0

            class Trail {
                constructor(x, y, colors) {
                    this.x = x
                    this.y = y
                    this.colors = colors
                    this.particles = []
                    const numParticles = 30
                    for (let i = 0; i < numParticles; i++) {
                        this.particles.push({
                            angle: p.random(p.TWO_PI),
                            speed: p.random(2, 8),
                            size: p.random(5, 20),
                            life: 1.0,
                            offset: p.random(p.TWO_PI),
                            colorIndex: Math.floor(p.random(colors.length))
                        })
                    }
                }

                update() {
                    this.particles.forEach(particle => {
                        particle.life -= 0.015
                        const wobble = Math.sin(phase * 5 + particle.offset) * 3
                        particle.angle += 0.05
                    })
                    this.particles = this.particles.filter(p => p.life > 0)
                }

                draw() {
                    this.particles.forEach(particle => {
                        const dist = (1 - particle.life) * 100
                        const wobble = Math.sin(phase * 5 + particle.offset) * 20
                        const px = this.x + Math.cos(particle.angle) * (dist + wobble)
                        const py = this.y + Math.sin(particle.angle) * (dist + wobble)
                        const color = this.colors[particle.colorIndex]
                        const size = particle.size * particle.life
                        p.fill(color.h, color.s, color.b, particle.life * 80)
                        p.noStroke()
                        p.ellipse(px, py, size, size)
                    })
                }

                isDead() {
                    return this.particles.length === 0
                }
            }

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight)
                p.colorMode(p.HSB, 360, 100, 100, 100)

                // Pick a random base hue for the entire palette
                const baseHue = p.random(360)

                // Initialize noise generators and wave configs
                for (let i = 0; i < layerCount; i++) {
                    const seed = p.random(10000)
                    noiseGenerators.push({
                        base: openSimplexNoise(seed),
                        grain: openSimplexNoise(seed * 1.618)
                    })

                    const grainFreq = p.random(0.015, 0.08)
                    // Derive hue from base using wider palette variations
                    const hueVariation = p.random(0, 360)
                    const derivedHue = (baseHue + hueVariation) % 360
                    const smoothness = p.random() < 0.3 ? p.random(0.8, 1.0) : p.random(0, 0.5)
                    const speed = p.random(0.05, 0.35)
                    const hasStroke = p.random() < 0.25
                    
                    waveConfigs.push({
                        baseFreq: p.random(0.0008, 0.008),
                        grainFreq: grainFreq,
                        baseAmp: p.random(80, 180),
                        grainAmp: p.map(grainFreq, 0.015, 0.08, 15, 60),
                        speed: speed,
                        parallaxScale: p.map(speed, 0.05, 0.35, 0.6, 1.4),
                        smoothness: smoothness,
                        hasStroke: hasStroke,
                        strokeWeight: hasStroke ? p.random(1, 3) : 0,
                        strokeAlpha: hasStroke ? p.random(40, 80) : 0,
                        hue: derivedHue,
                        sat: p.random(40, 100),
                        brt: p.random(20, 100),
                        opacity: p.random(30, 100)
                    })
                }
            }

            p.draw = () => {
                p.background(0, 0, 5, 100)

                for (let layer = 0; layer < layerCount; layer++) {
                    const config = waveConfigs[layer]
                    const noise = noiseGenerators[layer]
                    // Distribute layers diagonally (45 degrees)
                    const layerNorm = layer / (layerCount - 1)
                    // Calculate perpendicular span needed to cover screen
                    const perpExtent = (p.windowWidth + p.windowHeight) / Math.sqrt(2)
                    const layerOffset = p.map(layerNorm, 0, 1, -perpExtent * 0.7, perpExtent * 0.9)

                    // Compute displacement buffer along diagonal line
                    let buffer = []
                    const diagonalLength = Math.sqrt(p.windowWidth * p.windowWidth + p.windowHeight * p.windowHeight)
                    const numPoints = Math.ceil(diagonalLength / resolution)
                    for (let i = 0; i <= numPoints; i++) {
                        const t = i / numPoints
                        const distance = t * diagonalLength * 1.5 - diagonalLength * 0.25
                        
                        // Base position along 45-degree line
                        const baseX = distance * Math.cos(Math.PI / 4) + layerOffset * Math.cos(Math.PI / 4 + Math.PI / 2)
                        const baseY = distance * Math.sin(Math.PI / 4) + layerOffset * Math.sin(Math.PI / 4 + Math.PI / 2)
                        
                        // Sample base noise
                        const baseNoise = noise.base.noise2D(
                            distance * config.baseFreq,
                            phase * config.speed * 0.5
                        )
                        
                        // Sample grainy noise
                        const grainNoise = noise.grain.noise2D(
                            (distance + phase * config.speed * 150) * config.grainFreq,
                            phase * config.speed
                        )

                        // Calculate displacement perpendicular to diagonal
                        const baseDisp = baseNoise * config.baseAmp * config.parallaxScale
                        const grainDisp = grainNoise * config.grainAmp * (1 - config.smoothness) * config.parallaxScale
                        let displacement = baseDisp + grainDisp
                        
                        // Mouse interaction: push waves away from cursor
                        const mouseInfluenceRadius = 200
                        const distToMouse = p.dist(baseX, baseY, p.mouseX, p.mouseY)
                        if (distToMouse < mouseInfluenceRadius) {
                            const influence = 1 - (distToMouse / mouseInfluenceRadius)
                            const pushStrength = influence * influence * 150
                            const angle = p.atan2(baseY - p.mouseY, baseX - p.mouseX)
                            displacement += p.sin(angle) * pushStrength
                        }
                        
                        // Apply displacement perpendicular to 45-degree line
                        const perpAngle = Math.PI / 4 + Math.PI / 2
                        const x = baseX + Math.cos(perpAngle) * displacement
                        const y = baseY + Math.sin(perpAngle) * displacement
                        buffer.push({ x, y })
                    }

                    // Calculate mouse influence on color based on distance to diagonal line
                    const mouseDistanceInfluenceRadius = 150
                    let minDistToLine = Infinity
                    buffer.forEach(pt => {
                        const d = p.dist(pt.x, pt.y, p.mouseX, p.mouseY)
                        if (d < minDistToLine) minDistToLine = d
                    })
                    const colorInfluence = minDistToLine < mouseDistanceInfluenceRadius 
                        ? 1 - (minDistToLine / mouseDistanceInfluenceRadius) 
                        : 0
                    
                    // Blend towards white (desaturate and brighten) when mouse is near wave
                    const blendedHue = config.hue
                    const blendedSat = p.lerp(config.sat, 0, colorInfluence * 0.9)
                    const blendedBrt = p.lerp(config.brt, 100, colorInfluence * 0.8)
                    
                    // Show stroke only when mouse is close to wave
                    if (colorInfluence > 0.1) {
                        if (colorInfluence > 0.3) {
                            // Black stroke when very close (wave turns white)
                            p.stroke(0, 0, 0, colorInfluence * 100)
                            p.strokeWeight(p.lerp(1, 2.5, colorInfluence))
                        } else {
                            // Subtle stroke when moderately close
                            p.stroke(blendedHue, blendedSat * 0.8, blendedBrt - 20, colorInfluence * 80)
                            p.strokeWeight(1.5)
                        }
                    } else {
                        p.noStroke()
                    }
                    p.fill(blendedHue, blendedSat, blendedBrt, config.opacity)
                    p.beginShape()
                    
                    // Trace wave along diagonal
                    buffer.forEach(pt => p.vertex(pt.x, pt.y))
                    
                    // Close shape by extending perpendicular
                    if (buffer.length > 0) {
                        const lastPt = buffer[buffer.length - 1]
                        const perpAngle = Math.PI / 4 + Math.PI / 2
                        p.vertex(lastPt.x + Math.cos(perpAngle) * 3000, lastPt.y + Math.sin(perpAngle) * 3000)
                        
                        const firstPt = buffer[0]
                        p.vertex(firstPt.x + Math.cos(perpAngle) * 3000, firstPt.y + Math.sin(perpAngle) * 3000)
                    }
                    
                    p.endShape(p.CLOSE)
                }

                // Update and draw trails
                trails.forEach(trail => trail.update())
                trails = trails.filter(trail => !trail.isDead())
                trails.forEach(trail => trail.draw())

                // Draw blob at mouse position with mixed nearby colors
                const blobColors = []
                for (let layer = 0; layer < layerCount; layer++) {
                    const config = waveConfigs[layer]
                    const layerNorm = layer / (layerCount - 1)
                    const perpExtent = (p.windowWidth + p.windowHeight) / Math.sqrt(2)
                    const layerOffset = p.map(layerNorm, 0, 1, -perpExtent * 0.7, perpExtent * 0.9)
                    
                    // Calculate distance from mouse to diagonal line
                    // Project mouse onto perpendicular axis
                    const perpAngle = Math.PI / 4 + Math.PI / 2
                    const mousePerpDist = p.mouseX * Math.cos(perpAngle) + p.mouseY * Math.sin(perpAngle)
                    const dist = Math.abs(mousePerpDist - layerOffset)
                    
                    if (dist < 200) {
                        blobColors.push({
                            h: config.hue,
                            s: config.sat,
                            b: config.brt,
                            weight: 1 - (dist / 200)
                        })
                    }
                }

                if (blobColors.length > 0) {
                    // Calculate mouse velocity
                    const dx = p.mouseX - prevMouseX
                    const dy = p.mouseY - prevMouseY
                    const currentVelocity = Math.sqrt(dx * dx + dy * dy)
                    mouseVelocity = p.lerp(mouseVelocity, currentVelocity, 0.3)
                    prevMouseX = p.mouseX
                    prevMouseY = p.mouseY

                    // Draw organic blob shape - smaller base size
                    const numPoints = 30
                    const velocityScale = p.map(mouseVelocity, 0, 50, 1, 3, true)
                    const baseRadius = 20 * velocityScale
                    // Noise amplitude scales with velocity - more lopsided
                    const noiseAmp = p.map(mouseVelocity, 0, 15, 0, 25, true)
                    
                    // Color transitions from black (slow) to white (fast)
                    const velocityNorm = p.map(mouseVelocity, 0, 30, 0, 1, true)
                    const blobBrightness = p.lerp(0, 100, velocityNorm)
                    
                    p.fill(0, 0, blobBrightness, 100)
                    p.noStroke()
                    p.beginShape()
                    for (let i = 0; i < numPoints; i++) {
                        const angle = (i / numPoints) * p.TWO_PI
                        const noiseVal = blobNoise.noise2D(
                            Math.cos(angle) * 3 + phase * 2,
                            Math.sin(angle) * 3 + phase * 2
                        )
                        const radius = baseRadius + noiseVal * noiseAmp
                        const x = p.mouseX + Math.cos(angle) * radius
                        const y = p.mouseY + Math.sin(angle) * radius
                        p.curveVertex(x, y)
                    }
                    // Close smoothly
                    for (let i = 0; i < 3; i++) {
                        const angle = (i / numPoints) * p.TWO_PI
                        const noiseVal = blobNoise.noise2D(
                            Math.cos(angle) * 3 + phase * 2,
                            Math.sin(angle) * 3 + phase * 2
                        )
                        const radius = baseRadius + noiseVal * noiseAmp
                        const x = p.mouseX + Math.cos(angle) * radius
                        const y = p.mouseY + Math.sin(angle) * radius
                        p.curveVertex(x, y)
                    }
                    p.endShape(p.CLOSE)
                }

                phase += 0.01
            }

            p.mousePressed = () => {
                // Collect colors from nearby waves
                const nearbyColors = []
                for (let layer = 0; layer < layerCount; layer++) {
                    const config = waveConfigs[layer]
                    const layerNorm = layer / (layerCount - 1)
                    const perpExtent = (p.windowWidth + p.windowHeight) / Math.sqrt(2)
                    const layerOffset = p.map(layerNorm, 0, 1, -perpExtent * 0.7, perpExtent * 0.9)
                    
                    // Calculate distance from mouse to diagonal line
                    const perpAngle = Math.PI / 4 + Math.PI / 2
                    const mousePerpDist = p.mouseX * Math.cos(perpAngle) + p.mouseY * Math.sin(perpAngle)
                    const dist = Math.abs(mousePerpDist - layerOffset)
                    
                    if (dist < 300) {
                        nearbyColors.push({
                            h: config.hue,
                            s: config.sat,
                            b: config.brt
                        })
                    }
                }
                if (nearbyColors.length > 0) {
                    trails.push(new Trail(p.mouseX, p.mouseY, nearbyColors))
                }
            }

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight)
            }
        }

        p5InstanceRef.current = new p5(sketch, containerRef.current)
        return () => {
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove()
                p5InstanceRef.current = null
            }
        }
    }, [])

    return <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'none' }} />
}
