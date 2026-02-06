import React, { useRef, useEffect } from 'react'
import p5 from 'p5'
import openSimplexNoise from '../OpenSimplexNoise'

export default function P5Sketch() {
    const containerRef = useRef(null)
    const p5InstanceRef = useRef(null)

    useEffect(() => {
        function sketch(p) {
            let phase = 0
            const layerCount = 60
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
            const strokeFadeEnd = 140 // frames when stroke finishes fading in (2.33 seconds)

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
                    const speed = p.random(0.05, 0.35)
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
                        baseFreq: p.random(0.0002, 0.008),
                        grainFreq: grainFreq,
                        baseAmp: p.random(80, 180),
                        grainAmp: p.map(grainFreq, 0.015, 0.08, 15, 60),
                        speed: speed,
                        direction: direction,
                        parallaxScale: p.map(speed, 0.05, 0.35, 0.6, 1.4),
                        smoothness: smoothness,
                        hasStroke: hasStroke,
                        strokeWeight: hasStroke ? p.random(1, 3) : 0,
                        strokeAlpha: hasStroke ? p.random(40, 80) : 0,
                        hue: derivedHue,
                        sat: sat,
                        brt: brt,
                        opacity: 100
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
                            phase * config.speed * config.direction * 0.5
                        )
                        
                        // Sample grainy noise
                        const grainNoise = noise.grain.noise2D(
                            (distance + phase * config.speed * config.direction * 150) * config.grainFreq,
                            phase * config.speed * config.direction
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
                    let blendedHue = config.hue
                    let blendedSat = config.sat
                    let blendedBrt = config.brt
                    let blendedOpacity = config.opacity
                    
                    // Fade in from white on initial load
                    // Stage 1 (0-80): White waves, black stroke fades in
                    // Stage 2 (80-240): Black stroke visible, colors fade in
                    let colorFadeAmount, strokeFadeAmount
                    
                    if (fadeProgress <= strokeFadeEnd) {
                        // Stage 1: Colors stay white, stroke fades in
                        strokeFadeAmount = fadeProgress / strokeFadeEnd
                        colorFadeAmount = 0
                    } else {
                        // Stage 2: Stroke fully visible, colors fade in
                        strokeFadeAmount = 1
                        colorFadeAmount = (fadeProgress - strokeFadeEnd) / (fadeDuration - strokeFadeEnd)
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
                    
                    // Handle stroke - fade in black stroke, then fade out as colors appear
                    if (fadeProgress < fadeDuration) {
                        // Black stroke fades in during stage 1, then fades out during stage 2
                        let strokeAlpha
                        if (fadeProgress <= strokeFadeEnd) {
                            // Stage 1: Fade in
                            strokeAlpha = strokeFadeAmount * 100
                        } else {
                            // Stage 2: Fade out as colors fade in
                            strokeAlpha = (1 - colorFadeAmount) * 100
                        }
                        p.stroke(0, 0, 0, strokeAlpha)
                        p.strokeWeight(1.5)
                    } else if (colorInfluence > 0.1) {
                        // Mouse proximity stroke (after fade-in complete) - inverted color
                        const invertedHue = (blendedHue + 180) % 360
                        const invertedBrt = 100 - blendedBrt
                        p.stroke(invertedHue, blendedSat, invertedBrt, colorInfluence * 100)
                        p.strokeWeight(p.lerp(1, 2.5, colorInfluence))
                    } else {
                        p.noStroke()
                    }
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
