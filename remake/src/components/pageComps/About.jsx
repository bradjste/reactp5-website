import React, { useEffect, useState } from 'react'
import gif0 from '../../img/gif0.gif'
import gif1 from '../../img/gif1.gif'

const gifList = [gif0, gif1]

export default function About({ isSplashNo, changeActivePage, hasEntered, enterChange }) {
    const [gifNum, setGifNum] = useState(0)

    useEffect(() => {
        isSplashNo()
        changeActivePage('about')
    }, [isSplashNo, changeActivePage])

    useEffect(() => {
        const interval = setInterval(() => {
            setGifNum((prev) => (prev === gifList.length - 1 ? 0 : prev + 1))
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!hasEntered) {
            const aboutPage = document.getElementById('aboutPage')
            if (aboutPage) {
                aboutPage.classList.add('enter-off')
            }
            setTimeout(() => {
                if (aboutPage) {
                    aboutPage.classList.remove('enter-off')
                    aboutPage.classList.add('fade-in')
                }
            }, 200)
            setTimeout(enterChange, 300)
        }
    }, [hasEntered, enterChange])

    return (
        <div id="aboutPage">
            <div className="about">
                <div className="aboutText">
                    <h1 className="subtopic">Hello, world!</h1>
                    <h2 className="subtopic3">
                        I am a <strong>creative technologist</strong>; an experience
                        designer and generative artist armed with the power of computation
                        and electronics.
                    </h2>
                    <h2 className="subtopic3">
                        I received my Bachelor of Arts from UC San Diego in{' '}
                        <a
                            rel="noreferrer noopener"
                            className="conLink"
                            href="https://music-cms.ucsd.edu/ugrad/icam-major.html"
                            target="_blank"
                        >
                            Interdisciplinary Computing & the Arts Major - Music Technology
                            (ICAM)
                        </a>{' '}
                        in 2017. Here I learned to synthesize principles of music, computer
                        science, fine art, electrical engineering, and interface design to
                        create new tools of expression and experience for humans in the
                        digital age.
                        <br />
                        <br />
                        I am currently employed as a full-stack software engineer, honing
                        my craft as an effective and resourceful programmatic
                        problem-solver.
                        <br />
                        <br />
                        I code in languages such as Java, JavaScript, SQL, and Python to
                        achieve sustainable and scalable solutions to complex technical
                        problems.
                        <br />
                        <br />
                        I created this website using primarily the{' '}
                        <a
                            rel="noreferrer noopener"
                            className="conLink"
                            href="https://reactjs.org"
                            target="_blank"
                        >
                            React.js
                        </a>{' '}
                        and{' '}
                        <a
                            rel="noreferrer noopener"
                            className="conLink"
                            href="https://p5js.org"
                            target="_blank"
                        >
                            p5.js
                        </a>{' '}
                        libraries.
                    </h2>
                </div>
            </div>
            <div className="aboutGif">
                <img src={gifList[gifNum]} alt="loop of generated art" />
            </div>
        </div>
    )
}
