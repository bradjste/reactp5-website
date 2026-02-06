import React, { useRef, useEffect, useState } from 'react'
import p5 from 'p5'

export default function CellAuto() {
    const containerRef = useRef(null)
    const p5InstanceRef = useRef(null)
    const [state, setState] = useState({
        fil: [],
        rules: [0, 0, 0, 0, 0, 0, 0, 0],
        hues: [0, 30, 60, 90, 120, 150, 180, 210],
        sats: [40, 30, 40, 30, 20, 20, 40, 20],
        boxNum: 30,
    })
    const randHueRef = useRef(Math.floor(Math.random() * 360))
    const phaseRef = useRef(0)
    const mouseIsPressedRef = useRef(false)
    const lastRulesRef = useRef([])

    const randomizeFil = (boxNum) => {
        const filArr = []
        for (let i = 0; i < boxNum; i++) {
            filArr[i] = Math.floor(Math.random() * 2)
        }
        return filArr
    }

    const initFil = (boxNum) => {
        const firstFil = []
        for (let i = 0; i < boxNum; i++) {
            firstFil[i] = Math.floor(Math.random() * 2)
        }
        return firstFil
    }

    const changePattern = (prevState) => {
        const ruleArr = []
        const hueArr = []
        const satArr = []
        for (let i = 0; i < 8; i++) {
            ruleArr[i] = Math.floor(Math.random() * 2)
            hueArr[i] = Math.floor(Math.random() * 360)
            satArr[i] = Math.floor(Math.random() * 60)
        }
        return {
            ...prevState,
            fil: randomizeFil(prevState.boxNum),
            rules: ruleArr,
            hues: hueArr,
            sats: satArr,
        }
    }

    const calcNil = (fil, boxNum, rules) => {
        const newFil = [...fil]
        const nil = []
        nil[0] = rules[4 * fil[boxNum - 1] + 2 * fil[0] + fil[1]]
        nil[boxNum - 1] = rules[4 * fil[boxNum - 2] + fil[boxNum - 1] + fil[0]]
        for (let i = 1; i < fil.length - 1; i++) {
            nil[i] = rules[4 * fil[i - 1] + 2 * fil[i] + fil[i + 1]]
        }
        return nil
    }

    useEffect(() => {
        setState(prev => changePattern(prev))
    }, [])

    useEffect(() => {
        const sketch = (p) => {
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth * 0.835, p.windowHeight * 0.2)
                canvas.parent(containerRef.current)
                p.colorMode(p.HSB, 360, 100, 100, 100)
                p.noStroke()
                p.background(0)
                p.frameRate(24)
            }

            p.draw = () => {
                if (JSON.stringify(lastRulesRef.current) !== JSON.stringify(state.rules)) {
                    setState(prev => ({
                        ...prev,
                        fil: initFil(prev.boxNum),
                    }))
                    lastRulesRef.current = [...state.rules]
                }

                let currRow = [...state.fil]
                const nextRow = []
                const boxNum = state.boxNum
                let ux = Math.floor(p.width / boxNum) + 1 + Math.max(50 * p.mouseX / p.width, 0)
                let uy = Math.floor(p.height / boxNum) + 1
                const rowNum = Math.floor(p.height / uy)

                p.background(0, 0, 0, 10)

                for (let j = 0; j < rowNum; j++) {
                    for (let i = 0; i < boxNum; i++) {
                        let currRuleSelect = 0
                        if (i === 0) {
                            currRuleSelect = 4 * currRow[boxNum - 1] + 2 * currRow[0] + currRow[1]
                        } else if (i === boxNum - 1) {
                            currRuleSelect = 4 * currRow[i - 1] + 2 * currRow[i] + currRow[0]
                        } else {
                            currRuleSelect = 4 * currRow[i - 1] + 2 * currRow[i] + currRow[i + 1]
                        }

                        const currHue = Math.floor(state.hues[currRuleSelect])
                        if (!currRow[i]) {
                            p.fill(
                                (100 * (i / (p.width / ux)) +
                                    (100 * (j / (p.height / uy)) + currHue + randHueRef.current + 100 * Math.sin(phaseRef.current))) %
                                360,
                                ((0.0018 * p.dist(p.mouseX, p.mouseY, ux * i, uy * j)) * 100) + (j * 1.0) / p.height * 180,
                                100
                            )
                        } else if (mouseIsPressedRef.current) {
                            p.fill((currHue + randHueRef.current) % 360, 100, 100)
                        } else {
                            p.fill((currHue + randHueRef.current) % 360, 100, 0)
                        }

                        p.rect(ux * (i - 0.5), uy * j, ux, uy + 1)
                        nextRow[i] = state.rules[currRuleSelect]
                    }
                    currRow = [...nextRow]
                }

                phaseRef.current += 0.00511111 + (mouseIsPressedRef.current ? 0.09 : 0)
                if (phaseRef.current > Math.TWO_PI) {
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
    }, [state])

    return (
        <div>
            <button
                onClick={() => setState(prev => changePattern(prev))}
                style={{ margin: '10px', padding: '10px' }}
            >
                Change Pattern
            </button>
            <div ref={containerRef} id="p5Id" className="cell-autom" />
        </div>
    )
}
