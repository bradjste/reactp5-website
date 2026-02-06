import React, { useRef, useEffect } from 'react'
import p5 from 'p5'
import { usePageSetup } from '../../hooks/usePageSetup'

let phase = 0.0
let xOff = Math.cos(phase) * 80
let yOff = Math.sin(phase) * 90
let cursorFlag = true

export default function Contact({ isSplashNo, changeActivePage, hasEntered, enterChange }) {
    const p5InstanceRef = useRef(null)
    const containerRef = useRef(null)
    const siRef = useRef(null)

    usePageSetup('contactPage', 'contact', isSplashNo, changeActivePage, hasEntered, enterChange)

    useEffect(() => {
        const cursorChange = () => {
            const sketch = document.getElementById('contactSketch')
            if (sketch) {
                if (cursorFlag) {
                    sketch.classList.add('closedPalm')
                    sketch.classList.remove('openPalm')
                } else {
                    sketch.classList.add('openPalm')
                    sketch.classList.remove('closedPalm')
                }
            }
            cursorFlag = !cursorFlag
        }

        const sketch = (p) => {
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight)
                canvas.parent(containerRef.current)
                p.colorMode(p.HSB, 360, 100, 100, 100)
                p.noStroke()
            }

            p.draw = () => {
                p.clear()
                xOff = Math.cos(phase) * 60
                yOff = Math.sin(phase) * 60
                p.textSize(50)
                p.fill(((phase / p.TWO_PI) * 360) % 360, 20, 100)
                p.rect(p.mouseX + xOff * 1.3 - 300, p.mouseY + yOff * -0.5 - 100, 600, 200)
                p.fill(((phase / p.TWO_PI) * 360) % 360, 50, 30)
                p.text('Thanks for stopping by!', p.mouseX - xOff - 300, p.mouseY + yOff)

                phase += 0.008
                if (phase >= p.TWO_PI) {
                    phase = 0
                }
            }

            p.windowResized = () => {
                p.resizeCanvas(p.width, p.height)
            }
        }

        p5InstanceRef.current = new p5(sketch)
        siRef.current = setInterval(cursorChange, 700)

        return () => {
            if (p5InstanceRef.current) {
                p5InstanceRef.current.remove()
            }
            if (siRef.current) {
                clearInterval(siRef.current)
            }
        }
    }, [])

    return (
        <div>
            <div id="contactPage" className="contact">
                <h1 className="subtopic">Reach me here:</h1>
                <br />
                <h2 className="subtopic">
                    Email:
                    <br className="brShow" />
                    <a href="mailto:bradjste@gmail.com?subject=Hi Brad!" className="conLink" rel="noreferrer noopener">
                        {' '}
                        bradjste@gmail.com{' '}
                    </a>
                </h2>
                <h2 className="subtopic">
                    Instagram:
                    <br className="brShow" />
                    <a href="https://instagram.com/_u/bradjste" target="_blank" className="conLink" rel="noreferrer noopener">
                        {' '}
                        @bradjste{' '}
                    </a>
                </h2>
                <h2 className="subtopic">
                    LinkedIn:
                    <br className="brShow" />
                    <a href="https://linkedin.com/in/bradjste" target="_blank" className="conLink" rel="noreferrer noopener">
                        {' '}
                        linkedin.com/in/bradjste{' '}
                    </a>
                </h2>
                <h2 className="subtopic">
                    Github:
                    <br className="brShow" />
                    <a href="https://github.com/bradjste" target="_blank" className="conLink" rel="noreferrer noopener">
                        {' '}
                        github.com/bradjste{' '}
                    </a>
                </h2>
                <h2 className="subtopic">
                    itch.io:
                    <br className="brShow" />
                    <a href="https://bradjste.itch.io/" target="_blank" className="conLink" rel="noreferrer noopener">
                        {' '}
                        bradjste.itch.io{' '}
                    </a>
                </h2>
            </div>
            <div className="contactSketch" id="contactSketch">
                <div ref={containerRef} />
            </div>
        </div>
    )
}
