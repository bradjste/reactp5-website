import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import splashCard from '../../img/bsSplashCard2.png'

export default function Splash({ hasEntered, isSplashNo, enterChange, activePage }) {
    useEffect(() => {
        const fadeInElement = (id) => {
            const el = document.getElementById(id)
            if (el) {
                el.classList.remove('enter-off')
                el.classList.add('fade-in')
            }
        }

        fadeInElement('splashCard')

        if (!hasEntered) {
            setTimeout(() => fadeInElement('enterLink'), 1100)
            setTimeout(enterChange, 300)
        }
    }, [hasEntered, enterChange])

    const handleEnterClick = (e) => {
        if (isSplashNo) {
            isSplashNo()
        }
    }

    const pageLink = activePage === '' ? '/about' : `/about`

    return (
        <div id="UI" className="UI">
            <div className="enterPar">
                <Link id="enterLink" to={pageLink} onClick={handleEnterClick}>
                    <button className="enter">ENTER</button>
                </Link>
            </div>

            <div id="splashCardDiv" className="splashCard">
                <img src={splashCard} alt="splash card" />
            </div>
        </div>
    )
}
