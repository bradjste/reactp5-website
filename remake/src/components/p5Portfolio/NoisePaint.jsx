import React, { useRef, useEffect, useState } from 'react'
import p5 from 'p5'
import openSimplexNoise from '../../OpenSimplexNoise'

export default function NoisePaint() {
    const containerRef = useRef(null)
    const p5InstanceRef = useRef(null)
    const phaseRef = useRef(Math.PI)
    const mouseIsPressedRef = useRef(false)
    const noiseScaleRef = useRef(40)
    const openSimplexRef = useRef(null)
    const iRef = useRef(0.0)
    const [scale] = useState(9)

    useEffect(() => {
        const sketch = (p) => {
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth * 0.835, p.windowHeight * 0.2)
                canvas.parent(containerRef.current)
                p.colorMode(p.HSB, 360, 100, 100, 100)
                p.background(0)
                p.noStroke()
                openSimplexRef.current = openSimplexNoise(Math.random() * iRef.current)
            }

            p.draw = () => {
                noiseScaleRef.current = 20 + (50 * p.mouseX) / p.width
                p.background(0, 0, 0, 8)

                if (mouseIsPressedRef.current) {
                    openSimplexRef.current = openSimplexNoise(iRef.current)
                }

                for (let y = 0; y < p.height; y += scale) {
                    for (let x = 0; x < p.width; x += scale) {
                        const value =
                            (openSimplexRef.current.noise3D(
                                x / noiseScaleRef.current - iRef.current * 10,
                                y / noiseScaleRef.current - iRef.current * 3,
                                iRef.current * 5
                            ) +
                                0.75) *
                            360
                        p.fill(
                            (((Math.sin(phaseRef.current) * 360) + 50) +
                                (value > 240 ? 180 : 0) +
                                ((160 * (x * y * 0.005)) / p.width) +
                                60) %
                            360,
                            value > 240 ? 100 : 70,
                            30 + (value > 240 ? 100 : 70 * p.mouseX / p.width)
                        )

                        if (60 + Math.sin(2 * ((Math.PI / 2 + phaseRef.current / 4) * value / 360)) * 400 > 200) {
                            p.rect(x, y, scale, scale)
                        }
                    }
                }

                iRef.current += 0.009
                phaseRef.current += 0.005
                if (phaseRef.current >= Math.TWO_PI) {
                    phaseRef.current = 0
                }
            }

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth * 0.835, p.windowHeight * 0.2)
            }

            p.mousePressed = () => {
                mouseIsPressedRef.current = true
            }

            p.mouseReleased = () => {
                mouseIsPressedRef.current = false
            }
        }

        p5InstanceRef.current = new p5(sketch)

        return () => {
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove()
            }
        }
    }, [scale])

    return <div ref={containerRef} id="p5Id" className="cell-autom" />
}
