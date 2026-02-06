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

        if (!hasEntered) {
            // First visit: wait for animation, show title card then enter button
            setTimeout(() => fadeInElement('splashCard'), 4000)
            setTimeout(() => fadeInElement('enterLink'), 4800)
            setTimeout(enterChange, 300)
        } else {
            // Returning from internal page: hide title card, show enter button immediately
            const titleCard = document.getElementById('splashCard')
            if (titleCard) {
                titleCard.classList.add('enter-off')
                titleCard.classList.remove('fade-in')
            }
            fadeInElement('enterLink')
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
                <Link 
                    id="enterLink" 
                    className={!hasEntered ? "enter-off" : ""}
                    to={pageLink} 
                    onClick={handleEnterClick}
                >
                    <button className="enter">ENTER</button>
                </Link>
            </div>

            <div id="splashCard" className="splashCard enter-off">
                <img src={splashCard} alt="splash card" />
            </div>
        </div>
    )
}
