import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import NavItem from './NavItem'
import MobileMenu from './MobileMenu'
import splashCard from '../img/bjsLogo2.png'

export default function Navbar({ isSplashYes, hasEntered }) {
    const location = useLocation()
    const activePage = location.pathname.slice(1) || ''

    useEffect(() => {
        if (!hasEntered) {
            const navId = document.getElementById('navId')
            if (navId) {
                navId.classList.add('fade-in')
            }
        }
    }, [hasEntered])

    useEffect(() => {
        const elements = document.querySelectorAll('nav ul li')
        elements.forEach(el => el.classList.remove('active'))
        if (activePage) {
            const activeEl = document.getElementById(activePage)
            if (activeEl) {
                activeEl.classList.add('active')
            }
        }
    }, [activePage])

    return (
        <nav id="navId" className="nav">
            <div className="splashCardCorner">
                <Link to="/" onClick={isSplashYes}>
                    <img src={splashCard} alt="title card of site" />
                </Link>
            </div>

            <ul>
                <NavItem item="about" tolink="/about" />
                <NavItem item="portfolio" tolink="/portfolio" />
                <NavItem item="contact" tolink="/contact" />
            </ul>

            <MobileMenu activePage={activePage} />
        </nav>
    )
}
