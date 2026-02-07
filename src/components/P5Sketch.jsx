import React, { useRef, useEffect } from 'react'
import p5 from 'p5'
import openSimplexNoise from '../OpenSimplexNoise'

export default function P5Sketch() {
    const containerRef = useRef(null)
    const p5InstanceRef = useRef(null)

    useEffect(() => {
        function sketch(p) {
            const layerCount = 30
            const resolution = 3
            let noiseGenerators = []
            let waveConfigs = []
            let ripples = []
            let blobNoise = openSimplexNoise(99999)
            let prevMouseX = 0
            let prevMouseY = 0
            let mouseVelocity = 0
            let fadeProgress = 0
            const fadeDuration = 240 // frames (4 seconds at 60fps)
            const colorFadeStart = 60 // frames when colors start fading in (1 second)

            class Ripple {
                constructor(clickOffset, topColor, bottomColor) {
                    this.clickOffset = clickOffset // perpendicular offset where click happened
                    this.topColor = topColor // Color for waves above click point
                    this.bottomColor = bottomColor // Color for waves below click point
                    this.radius = 0
                    this.maxRadius = 5000
                    this.speed = 15
                }

                update() {
                    this.radius += this.speed
                }

                getInfluenceAndColor(layerOffset) {
                    // Calculate distance from click point along perpendicular axis
                    const dist = Math.abs(layerOffset - this.clickOffset)
                    const edgeDist = Math.abs(dist - this.radius)
                    
                    // Ripple has a wider width - affects more waves at once
                    const rippleWidth = 500
                    if (edgeDist < rippleWidth) {
                        // Stronger influence at center, steeper falloff for front-heavy pulse
                        const normalizedDist = edgeDist / rippleWidth
                        const influence = Math.pow(1 - normalizedDist, 3) // Cubic falloff for stronger front edge
                        // Determine direction: top (toward larger offset) or bottom
                        const color = layerOffset > this.clickOffset ? this.topColor : this.bottomColor
                        return { influence, color }
                    }
                    return { influence: 0, color: null }
                }

                isDead() {
                    return this.radius > this.maxRadius
                }
            }

            // Function to draw a tree at a specific position
            function drawTree(x, y, size, hue, branches, animPhase, branchNoise) {
                p.push()
                p.translate(x, y)
                
                // Draw trunk - extend it far below the screen with thick, textured stroke
                p.stroke(hue, 60, 40, 90)
                p.strokeWeight(14)
                p.strokeCap(p.SQUARE)
                p.line(0, p.windowHeight * 2, 0, -size) // Extend trunk way down
                
                // Add texture lines to trunk
                p.strokeWeight(4)
                p.stroke(hue, 70, 30, 40)
                p.line(-3, p.windowHeight * 2, -3, -size * 0.3)
                p.line(3, p.windowHeight * 2, 3, -size * 0.4)
                
                // Draw branches
                branches.forEach((branch, branchIdx) => {
                    // Add violent branch sway with leftward bias using simplex noise
                    const branchSwayX = branchNoise.noise2D(branchIdx * 0.5, animPhase * 1.5) * 0.35 - 0.15
                    const branchSwayY = branchNoise.noise2D(branchIdx * 0.5 + 100, animPhase * 1.5) * 0.2
                    
                    const branchX = Math.sin(branch.angle + branchSwayX) * size * branch.length
                    const branchY = -Math.cos(branch.angle + branchSwayY) * size * branch.length - size * 0.5
                    
                    p.stroke(hue, 50, 50, 80)
                    p.strokeWeight(6)
                    p.strokeCap(p.ROUND)
                    p.line(0, -size * 0.5, branchX, branchY)
                    
                    // Sub-branches
                    branch.subBranches.forEach(subBranch => {
                        const subLen = branch.length * 0.5
                        const subX = branchX + Math.sin(subBranch.angle) * size * subLen
                        const subY = branchY - Math.cos(subBranch.angle) * size * subLen
                        
                        p.stroke(hue, 40, 60, 60)
                        p.strokeWeight(3)
                        p.line(branchX, branchY, subX, subY)
                        
                        // Add leaves at sub-branch ends with slow gentle swaying
                        subBranch.leaves.forEach(leaf => {
                            // Gentle swaying animation with stored properties
                            const swayAmount = p.sin(animPhase * leaf.swaySpeed + leaf.swayPhase) * 0.2
                            const leafAngle = leaf.baseAngle + swayAmount
                            
                            p.fill(leaf.hue, 70, 70, 80)
                            p.noStroke()
                            
                            // Different leaf shapes
                            p.push()
                            p.translate(subX, subY)
                            p.rotate(leafAngle)
                            
                            // Teardrop/oval shaped leaves
                            p.beginShape()
                            for (let a = 0; a < p.TWO_PI; a += 0.3) {
                                const r = leaf.size * (1 + 0.3 * Math.cos(a * 2))
                                p.vertex(r * Math.cos(a), r * Math.sin(a) * 0.7)
                            }
                            p.endShape(p.CLOSE)
                            p.pop()
                        })
                    })
                    
                    // Add leaves at main branch ends too with slow swaying
                    branch.leaves.forEach(leaf => {
                        // Gentle swaying animation with stored properties
                        const swayAmount = p.sin(animPhase * leaf.swaySpeed + leaf.swayPhase) * 0.2
                        const leafAngle = leaf.baseAngle + swayAmount
                        
                        p.fill(leaf.hue, 65, 75, 85)
                        p.noStroke()
                        
                        p.push()
                        p.translate(branchX, branchY)
                        p.rotate(leafAngle)
                        
                        // Rounded diamond shapes
                        p.beginShape()
                        p.vertex(0, -leaf.size)
                        p.bezierVertex(leaf.size * 0.5, -leaf.size * 0.3, leaf.size * 0.5, leaf.size * 0.3, 0, leaf.size)
                        p.bezierVertex(-leaf.size * 0.5, leaf.size * 0.3, -leaf.size * 0.5, -leaf.size * 0.3, 0, -leaf.size)
                        p.endShape(p.CLOSE)
                        p.pop()
                    })
                })
                
                p.pop()
            }

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight)
                p.colorMode(p.HSB, 360, 100, 100, 100)

                // Pick a random base hue for the entire palette (avoid green: 80-160)
                let baseHue
                do {
                    baseHue = p.random(360)
                } while (baseHue >= 80 && baseHue <= 160)
                
                // Define 4 complementary hues (tetrad color scheme)
                const complementaryHues = [
                    baseHue,
                    (baseHue + 90) % 360,
                    (baseHue + 180) % 360,
                    (baseHue + 270) % 360
                ]

                // Initialize noise generators and wave configs
                for (let i = 0; i < layerCount; i++) {
                    const seed = p.random(10000)
                    noiseGenerators.push({
                        base: openSimplexNoise(seed),
                        grain: openSimplexNoise(seed * 1.618)
                    })

                    const grainFreq = p.random(0.015, 0.08)
                    // Pick hue based on 60-20-10-10 rule (random distribution)
                    const rand = p.random()
                    let derivedHue
                    if (rand < 0.6) {
                        derivedHue = complementaryHues[0] // 60% primary
                    } else if (rand < 0.8) {
                        derivedHue = complementaryHues[1] // 20% secondary
                    } else if (rand < 0.9) {
                        derivedHue = complementaryHues[2] // 10% tertiary
                    } else {
                        derivedHue = complementaryHues[3] // 10% quaternary
                    }
                    const smoothness = p.random() < 0.3 ? p.random(0.8, 1.0) : p.random(0, 0.5)
                    const speed = p.random(0.2, 3.5)
                    const hasStroke = p.random() < 0.25
                    const direction = p.random() < 0.5 ? 1 : -1
                    
                    // Generate sat and brt so they're not both low
                    // Either low sat (pastel) OR low brightness (dark), but not both (muddy)
                    let sat, brt
                    if (p.random() < 0.5) {
                        // Low saturation (pastel) - keep brightness high
                        sat = p.random(10, 50)
                        brt = p.random(65, 100)
                    } else {
                        // High saturation - can have any brightness
                        sat = p.random(60, 100)
                        brt = p.random(40, 100)
                    }
                    
                    waveConfigs.push({
                        wavelength: p.random(150, 500), // Longer wavelength for less density
                        baseAmp: p.random(10, 45),
                        grainAmp: p.map(grainFreq, 0.015, 0.08, 1, 12),
                        speed: speed * 2, // Horizontal scroll speed
                        parallaxScale: p.map(speed, 0.05, 0.35, 0.6, 1.4),
                        smoothness: smoothness,
                        hasStroke: hasStroke,
                        strokeWeight: hasStroke ? p.random(1, 3) : 0,
                        strokeAlpha: hasStroke ? p.random(40, 80) : 0,
                        hue: derivedHue,
                        sat: sat,
                        brt: brt,
                        opacity: 100,
                        phaseOffset: p.random(0, p.TWO_PI), // Random starting phase for variation
                        trees: [] // Trees for this wave layer
                    })
                    
                    // Add 2-4 trees to each wave
                    const treeCount = Math.floor(p.random(4, 9))
                    for (let t = 0; t < treeCount; t++) {
                        const diagonalLength = Math.sqrt(p.windowWidth * p.windowWidth + p.windowHeight * p.windowHeight)
                        const treeHue = p.random(360)
                        const branches = [
                            { angle: p.random(-1, -0.3), length: p.random(0.4, 0.7), subs: Math.floor(p.random(0, 3)) },
                            { angle: p.random(0.3, 1), length: p.random(0.4, 0.7), subs: Math.floor(p.random(0, 3)) },
                            { angle: p.random(-0.5, 0.5), length: p.random(0.5, 0.8), subs: Math.floor(p.random(1, 4)) }
                        ]
                        
                        // Generate persistent leaf properties for each branch
                        branches.forEach((branch, branchIdx) => {
                            // Main branch leaves
                            branch.leaves = []
                            for (let l = 0; l < 5; l++) {
                                branch.leaves.push({
                                    size: p.random(18, 30),
                                    baseAngle: p.random(p.TWO_PI),
                                    hue: (treeHue + p.random(-30, 30)) % 360,
                                    swaySpeed: p.random(6.0, 8.0), // Very fast wind effect
                                    swayPhase: p.random(p.TWO_PI) // Random phase for natural variety
                                })
                            }
                            
                            // Generate persistent sub-branches with their angles and leaves
                            branch.subBranches = []
                            for (let i = 0; i < branch.subs; i++) {
                                const subAngle = branch.angle + p.random(-0.5, 0.5)
                                const subLeaves = []
                                for (let l = 0; l < 3; l++) {
                                    subLeaves.push({
                                        size: p.random(14, 24),
                                        baseAngle: p.random(p.TWO_PI),
                                        hue: (treeHue + p.random(-30, 30)) % 360,
                                        swaySpeed: p.random(6.0, 8.0), // Very fast wind effect
                                        swayPhase: p.random(p.TWO_PI) // Random phase for natural variety
                                    })
                                }
                                branch.subBranches.push({
                                    angle: subAngle,
                                    leaves: subLeaves
                                })
                            }
                        })
                        
                        waveConfigs[i].trees.push({
                            diagonalPos: p.random(-diagonalLength * 0.5, diagonalLength * 2),
                            size: p.random(60, 130),
                            hue: treeHue,
                            branches: branches,
                            branchNoise: openSimplexNoise(p.random(10000)) // Unique noise for branch sway
                        })
                    }
                }
            }

            p.draw = () => {
                p.background(0, 0, 5, 100)

                // Use time-based animation to be framerate-independent
                const time = p.millis() / 1000 // Time in seconds

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
                        
                        // Blend sinusoidal and noise-based displacement for organic motion
                        const scrollOffset = time * config.speed * 20
                        const wavePhase = (distance + scrollOffset + config.phaseOffset) * (p.TWO_PI / config.wavelength)
                        
                        // Simplex noise for organic base motion
                        const noiseBase = noise.base.noise2D(
                            distance * 0.003 + time * config.speed * 0.05,
                            layerOffset * 0.001 + time * config.speed * 0.03
                        )
                        
                        // Low frequency simplex noise for large-scale undulations
                        const lowFreqNoise = noise.base.noise2D(
                            distance * 0.0008 + time * config.speed * 0.02,
                            layerOffset * 0.0003 + time * config.speed * 0.015
                        )
                        
                        // Add sinusoidal harmonics modulated by noise
                        const wave1 = p.sin(wavePhase + noiseBase * 2) * (0.7 + noiseBase * 0.2)
                        const wave2 = p.sin(wavePhase * 2.3 + time * 0.3 + noiseBase) * 0.25
                        const wave3 = p.sin(wavePhase * 1.7 + time * 0.5) * 0.2
                        const wave4 = p.sin(wavePhase * 0.3 + time * 0.2) * 0.35  // Very low frequency
                        const wave5 = p.sin(wavePhase * 3.8 + time * 0.7) * 0.08    // Higher frequency - reduced amp
                        const wave6 = p.sin(wavePhase * 5.5 + time * 1.1 + noiseBase * 1.5) * 0.05  // Very high frequency - reduced amp - reduced amp
                        
                        // Fine grain noise for texture
                        const grainNoise = noise.grain.noise2D(
                            distance * 0.015 + time * config.speed * 0.1,
                            time * config.speed * 0.2
                        )
                        
                        // Combine noise and waves with additional frequencies and low freq noise
                        const combinedWave = (wave1 + wave2 + wave3 + wave4 + wave5 + wave6 + noiseBase * 0.3 + lowFreqNoise * 0.5) / 2.8
                        const textureDetail = grainNoise * (1 - config.smoothness) * 0.5
                        
                        // Calculate displacement perpendicular to diagonal
                        const baseDisp = combinedWave * config.baseAmp * config.parallaxScale
                        const grainDisp = textureDetail * config.grainAmp * config.parallaxScale
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
                        const x = baseX + Math.cos(perpAngle) * displacement + 200  // Translate to the right
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
                    
                    // Slowly mutate colors over time based on wave speed
                    const colorMutationRate = config.speed * 0.5 // Faster waves mutate faster
                    const hueShift = (time * colorMutationRate) % 360
                    
                    // Blend towards white (desaturate and brighten) when mouse is near wave
                    let blendedHue = (config.hue + hueShift) % 360
                    let blendedSat = config.sat
                    let blendedBrt = config.brt
                    let blendedOpacity = config.opacity
                    
                    // Fade in from white on initial load
                    // Black stroke visible from start, colors fade in after 2 seconds
                    let colorFadeAmount
                    
                    if (fadeProgress <= colorFadeStart) {
                        // First 2 seconds: Colors stay white, black stroke visible
                        colorFadeAmount = 0
                    } else {
                        // After 2 seconds: Colors fade in over remaining time
                        colorFadeAmount = (fadeProgress - colorFadeStart) / (fadeDuration - colorFadeStart)
                    }
                    
                    blendedSat = p.lerp(0, blendedSat, colorFadeAmount)
                    blendedBrt = p.lerp(100, blendedBrt, colorFadeAmount)
                    
                    // Apply mouse proximity - increase opacity instead of whitening
                    blendedOpacity = p.lerp(blendedOpacity, 100, colorInfluence * 0.9)
                    
                    // Apply ripple color by blending towards it
                    ripples.forEach(ripple => {
                        const { influence, color } = ripple.getInfluenceAndColor(layerOffset)
                        if (influence > 0 && color) {
                            // Blend towards ripple color and make fully opaque
                            blendedHue = p.lerp(blendedHue, color.h, influence)
                            blendedSat = p.lerp(blendedSat, color.s, influence)
                            blendedBrt = p.lerp(blendedBrt, color.b, influence)
                            blendedOpacity = p.lerp(blendedOpacity, 100, influence)
                        }
                    })
                    
                    // Handle stroke - always show black stroke
                    p.stroke(0, 0, 0, 60)
                    p.strokeWeight(1.5)
                    p.fill(blendedHue, blendedSat, blendedBrt, blendedOpacity)
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
                    
                    // Draw trees for this wave layer
                    config.trees.forEach(tree => {
                        // Calculate position along diagonal (trees don't move)
                        const treeX = tree.diagonalPos * Math.cos(Math.PI / 4) + layerOffset * Math.cos(Math.PI / 4 + Math.PI / 2)
                        const treeY = tree.diagonalPos * Math.sin(Math.PI / 4) + layerOffset * Math.sin(Math.PI / 4 + Math.PI / 2)
                        
                        // Draw the tree
                        drawTree(treeX, treeY, tree.size, tree.hue, tree.branches, time, tree.branchNoise)
                    })
                }

                // Update and remove dead ripples
                ripples.forEach(ripple => ripple.update())
                ripples = ripples.filter(ripple => !ripple.isDead())

                // Increment fade progress
                if (fadeProgress < fadeDuration) {
                    fadeProgress++
                }

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
                            Math.cos(angle) * 3 + time * 2,
                            Math.sin(angle) * 3 + time * 2
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
                            Math.cos(angle) * 3 + time * 2,
                            Math.sin(angle) * 3 + time * 2
                        )
                        const radius = baseRadius + noiseVal * noiseAmp
                        const x = p.mouseX + Math.cos(angle) * radius
                        const y = p.mouseY + Math.sin(angle) * radius
                        p.curveVertex(x, y)
                    }
                    p.endShape(p.CLOSE)
                }
            }

            p.mousePressed = () => {
                // Disable clicks until fade-in animation completes
                if (fadeProgress < fadeDuration) {
                    return
                }
                
                // Find the wave layer closest to click and get its color
                const perpAngle = Math.PI / 4 + Math.PI / 2
                const mousePerpDist = p.mouseX * Math.cos(perpAngle) + p.mouseY * Math.sin(perpAngle)
                
                let closestLayer = 0
                let minDist = Infinity
                const perpExtent = (p.windowWidth + p.windowHeight) / Math.sqrt(2)
                
                for (let layer = 0; layer < layerCount; layer++) {
                    const layerNorm = layer / (layerCount - 1)
                    const layerOffset = p.map(layerNorm, 0, 1, -perpExtent * 0.7, perpExtent * 0.9)
                    const dist = Math.abs(mousePerpDist - layerOffset)
                    
                    if (dist < minDist) {
                        minDist = dist
                        closestLayer = layer
                    }
                }
                
                // Create ripple with black pulse toward top, white toward bottom
                ripples.push(new Ripple(mousePerpDist, 
                    { h: 0, s: 0, b: 0 },   // Top (black)
                    { h: 0, s: 0, b: 100 }  // Bottom (white)
                ))
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
