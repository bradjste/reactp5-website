import React, { useRef, useEffect } from 'react'
import p5 from 'p5'

export default function P5Sketch() {
    const containerRef = useRef(null)
    const p5InstanceRef = useRef(null)

    useEffect(() => {
        function sketch(p) {
            let phase = 0
            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight)
                p.colorMode(p.HSB, 360, 100, 100, 100)
                p.noStroke()
            }
            p.draw = () => {
                p.background(0, 0, 0, 10)
                const sq = p.windowWidth / 3
                p.fill((360 * (phase / p.TWO_PI)) % 360, 50, 100)
                p.rect(0, 0, sq, p.windowHeight)
                p.fill((360 * (phase / p.TWO_PI) + 40) % 360, 50, 100)
                p.rect(sq, 0, sq, p.windowHeight)
                p.fill((360 * (phase / p.TWO_PI) + 80) % 360, 50, 100)
                p.rect(2 * sq, 0, sq, p.windowHeight)
                phase += 0.01
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

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
}
