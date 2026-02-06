import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import splashCard from '../img/bsSplashCard2.png'

export default function Splash({ hasEntered, isSplashNo, enterChange, activePage }) {
    const navigate = useNavigate()

    useEffect(() => {
        const fadeInById = (id) => {
            const el = document.getElementById(id)
            if (el) {
                el.classList.add('fade-in')
            }
        }

        fadeInById('splashCard')

        if (!hasEntered) {
            const enterLink = document.getElementById('enterLink')
            if (enterLink) {
                enterLink.classList.add('enter-off')
            }
            setTimeout(fadeInById, 1100, 'enterLink')
            setTimeout(enterChange, 300)
        }
    }, [hasEntered, enterChange])

    const pageLink = activePage === '' ? '/' : `/about`

    return (
        <div id="UI" className="UI">
            <div className="enterPar">
                <Link id="enterLink" to={pageLink} onClick={isSplashNo}>
                    <button className="enter">ENTER</button>
                </Link>
            </div>

            <div id="splashCardDiv" className="splashCard">
                <img src={splashCard} alt="splash card" />
            </div>
        </div>
    )
}
