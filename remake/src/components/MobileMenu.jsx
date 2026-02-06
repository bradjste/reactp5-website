import React, { useState, useEffect } from 'react'
import menuInactive from '../img/menuInactive.png'
import menuActive from '../img/menuActive.png'
import DDItem from './DDItem'

export default function MobileMenu({ activePage }) {
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const activeIcon = document.getElementById('activeIcon')
        if (activeIcon) {
            activeIcon.style.display = 'none'
        }
    }, [])

    const handleOpenMenu = () => {
        setMenuOpen(prev => !prev)
        const activeIcon = document.getElementById('activeIcon')
        if (activeIcon) {
            if (!menuOpen) {
                activeIcon.style.display = 'inline-flex'
            } else {
                activeIcon.style.display = 'none'
            }
        }
    }

    return (
        <div id="mobMenuId" className="mobMenu">
            <div id="menuIcon" className="mobMenuIcon">
                <img
                    src={menuInactive}
                    alt="menu icon"
                    onClick={handleOpenMenu}
                />
                <img
                    id="activeIcon"
                    src={menuActive}
                    alt="menu icon active"
                    onClick={handleOpenMenu}
                />
                {!menuOpen && <p className="displayPageMob">{activePage}</p>}
            </div>

            {menuOpen && (
                <div id="dropdownMobile" className="dropdownMobile">
                    <DDItem openMenu={handleOpenMenu} item="about" />
                    <DDItem openMenu={handleOpenMenu} item="portfolio" />
                    <DDItem openMenu={handleOpenMenu} item="contact" />
                </div>
            )}
        </div>
    )
}
