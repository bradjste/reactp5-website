import React, { useRef, useEffect, useState } from 'react'
import p5 from 'p5'
import openSimplexNoise from '../OpenSimplexNoise'
import { Ripple } from './p5Sketch/Ripple'
import { generateWaves } from './p5Sketch/waveGenerator'
import { renderWaves } from './p5Sketch/waveRenderer'
import { DEFAULT_PARAMS, ANIMATION_CONFIG } from './p5Sketch/config'
import DebugPanel from './p5Sketch/DebugPanel'

export default function P5Sketch() {
    const containerRef = useRef(null)
    const p5InstanceRef = useRef(null)
    const [showDebug, setShowDebug] = useState(false)
    const [params, setParams] = useState(DEFAULT_PARAMS)
    const paramsRef = useRef(params)

    useEffect(() => {
        paramsRef.current = params
    }, [params])

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'd' || e.key === 'D') {
                setShowDebug(prev => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    useEffect(() => {
        const MAX_CANVAS_WIDTH = 1920
        const MAX_CANVAS_HEIGHT = 1080

        function canvasDims() {
            const scaleW = Math.min(1, MAX_CANVAS_WIDTH / window.innerWidth)
            const scaleH = Math.min(1, MAX_CANVAS_HEIGHT / window.innerHeight)
            const scale = Math.min(scaleW, scaleH)
            return {
                w: Math.round(window.innerWidth * scale),
                h: Math.round(window.innerHeight * scale)
            }
        }

        const sketch = (p) => {
            let state = initializeState()

            p.setup = () => {
                const { w, h } = canvasDims()
                p.pixelDensity(1)
                p.createCanvas(w, h)
                p.canvas.style.width = '100vw'
                p.canvas.style.height = '100vh'
                p.colorMode(p.HSB, 360, 100, 100, 100)
                regenerateWaves()
            }

            p.draw = () => {
                if (state.needsRegeneration) {
                    regenerateWaves()
                    state.needsRegeneration = false
                    state.fadeProgress = 0
                }

                const time = p.millis() / 1000

                renderWaves(
                    p,
                    state.waveConfigs,
                    state.noiseGenerators,
                    state.layerCount,
                    state.resolution,
                    time,
                    state.ripples,
                    state.fadeProgress,
                    ANIMATION_CONFIG.fadeDuration,
                    ANIMATION_CONFIG.colorFadeStart,
                    paramsRef.current.waveDensity,
                    paramsRef.current.waveOffsetX,
                    paramsRef.current.amplitude
                )

                state.ripples.forEach(ripple => ripple.update())
                state.ripples = state.ripples.filter(ripple => !ripple.isDead())

                if (state.fadeProgress < ANIMATION_CONFIG.fadeDuration) {
                    state.fadeProgress++
                }

                renderMouseBlob(p, state, time)
            }

            p.mousePressed = () => {
                if (state.fadeProgress < ANIMATION_CONFIG.fadeDuration) return

                const perpAngle = Math.PI / 4 + Math.PI / 2
                const waveOffsetX = paramsRef.current.waveOffsetX
                // Adjust mouse perpendicular distance to account for wave offset
                const mousePerpDist = (p.mouseX - waveOffsetX) * Math.cos(perpAngle) + p.mouseY * Math.sin(perpAngle)

                state.ripples.push(new Ripple(
                    mousePerpDist,
                    { h: 0, s: 0, b: 0 },
                    { h: 0, s: 0, b: 100 }
                ))
            }

            p.windowResized = () => {
                const { w, h } = canvasDims()
                p.resizeCanvas(w, h)
                p.canvas.style.width = '100vw'
                p.canvas.style.height = '100vh'
            }

            p.regenerate = () => {
                state.needsRegeneration = true
            }

            function initializeState() {
                return {
                    layerCount: paramsRef.current.layerCount,
                    resolution: paramsRef.current.resolution,
                    waveDensity: paramsRef.current.waveDensity,
                    waveOffsetX: paramsRef.current.waveOffsetX,
                    noiseGenerators: [],
                    waveConfigs: [],
                    ripples: [],
                    blobNoise: openSimplexNoise(99999),
                    prevMouseX: 0,
                    prevMouseY: 0,
                    mouseVelocity: 0,
                    fadeProgress: 0,
                    needsRegeneration: false
                }
            }

            function regenerateWaves() {
                state.layerCount = paramsRef.current.layerCount
                state.resolution = paramsRef.current.resolution
                state.waveDensity = paramsRef.current.waveDensity
                state.waveOffsetX = paramsRef.current.waveOffsetX

                const { noiseGenerators, waveConfigs } = generateWaves(p, paramsRef.current)
                state.noiseGenerators = noiseGenerators
                state.waveConfigs = waveConfigs
            }

            function renderMouseBlob(p, state, time) {
                const blobColors = []
                const perpAngle = Math.PI / 4 + Math.PI / 2
                const perpExtent = (p.width + p.height) / Math.sqrt(2)

                for (let layer = 0; layer < state.layerCount; layer++) {
                    const config = state.waveConfigs[layer]
                    const layerNorm = layer / (state.layerCount - 1)
                    const densityScale = p.map(paramsRef.current.waveDensity, 1, 10, 1.5, 0.3)
                    const layerOffset = p.map(layerNorm, 0, 1, -perpExtent * 0.7 * densityScale, perpExtent * 0.9 * densityScale)

                    const waveOffsetX = paramsRef.current.waveOffsetX
                    // Adjust mouse perpendicular distance to account for wave offset
                    const mousePerpDist = (p.mouseX - waveOffsetX) * Math.cos(perpAngle) + p.mouseY * Math.sin(perpAngle)
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
                    const dx = p.mouseX - state.prevMouseX
                    const dy = p.mouseY - state.prevMouseY
                    const currentVelocity = Math.sqrt(dx * dx + dy * dy)
                    state.mouseVelocity = p.lerp(state.mouseVelocity, currentVelocity, 0.3)
                    state.prevMouseX = p.mouseX
                    state.prevMouseY = p.mouseY

                    const numPoints = 30
                    const velocityScale = p.map(state.mouseVelocity, 0, 50, 1, 3, true)
                    const baseRadius = 20 * velocityScale
                    const noiseAmp = p.map(state.mouseVelocity, 0, 15, 0, 25, true)
                    const velocityNorm = p.map(state.mouseVelocity, 0, 30, 0, 1, true)
                    const blobBrightness = p.lerp(0, 100, velocityNorm)

                    p.fill(0, 0, blobBrightness, 100)
                    p.noStroke()
                    p.beginShape()

                    for (let i = 0; i < numPoints + 3; i++) {
                        const angle = (i / numPoints) * p.TWO_PI
                        const noiseVal = state.blobNoise.noise2D(
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
        }

        p5InstanceRef.current = new p5(sketch, containerRef.current)
        return () => {
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove()
                p5InstanceRef.current = null
            }
        }
    }, [])

    const handleParamChange = (key, value) => {
        setParams(prev => ({ ...prev, [key]: value }))
    }

    const handleRegenerate = () => {
        if (p5InstanceRef.current && p5InstanceRef.current.regenerate) {
            p5InstanceRef.current.regenerate()
        }
    }

    return (
        <>
            <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'none' }} />
            {showDebug && (
                <DebugPanel
                    params={params}
                    onParamChange={handleParamChange}
                    onRegenerate={handleRegenerate}
                />
            )}
        </>
    )
}
