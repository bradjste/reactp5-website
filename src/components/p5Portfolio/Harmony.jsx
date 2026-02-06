import React, { useRef, useEffect } from 'react'
import p5 from 'p5'

export default function Harmony() {
    const containerRef = useRef(null)
    const p5InstanceRef = useRef(null)
    const phaseRef = useRef(0)
    const rowRef = useRef(10)
    const columnRef = useRef(10)

    useEffect(() => {
        const sketch = (p) => {
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth * 0.835, p.windowHeight * 0.2)
                canvas.parent(containerRef.current)
                p.colorMode(p.HSB, 360, 100, 100, 100)
                p.frameRate(30)
                p.noStroke()
            }

            p.draw = () => {
                p.background(0)
                const vw = p.width
                const vh = p.height
                const row = rowRef.current
                const column = columnRef.current

                for (let i = 0; i < row; i++) {
                    p.fill((360 * i) / column, 100, 100)

                    for (let j = 0; j < column; j++) {
                        p.ellipse(
                            ((i + 0.5) * vw) / column + 10 * Math.sin(phaseRef.current + j * i),
                            ((j + 0.5) * vh) / column,
                            10,
                            10
                        )
                    }
                }

                phaseRef.current += 0.15 + (1 * p.mouseX) / p.width
                if (phaseRef.current >= Math.PI * 2) {
                    phaseRef.current = 0
                }
            }

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth * 0.835, p.windowHeight * 0.2)
            }
        }

        p5InstanceRef.current = new p5(sketch)

        return () => {
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove()
            }
        }
    }, [])

    return <div ref={containerRef} className="p5-sketch-root" />
}
