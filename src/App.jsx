import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import P5Sketch from './components/P5Sketch'
import Navbar from './components/Navbar'
import Splash from './components/pageComps/Splash'
import About from './components/pageComps/About'
import Portfolio from './components/pageComps/Portfolio'
import Contact from './components/pageComps/Contact'

export default function App() {
    const [isSplash, setIsSplash] = useState(true)
    const [hasEntered, setHasEntered] = useState(false)
    const [activePage, setActivePage] = useState('')

    const isSplashYes = () => {
        setIsSplash(true)
    }

    const isSplashNo = () => {
        setIsSplash(false)
    }

    const enterChange = () => {
        setHasEntered(true)
    }

    const changeActivePage = (page) => {
        setActivePage(page)
    }

    return (
        <Router>
            <div id="App">
                <div id="LiveBackDrop" className="LiveBackDrop">
                    <P5Sketch />
                </div>

                {!isSplash && activePage.length > 0 && (
                    <Navbar isSplashYes={isSplashYes} hasEntered={hasEntered} />
                )}

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Splash
                                hasEntered={hasEntered}
                                isSplashNo={isSplashNo}
                                enterChange={enterChange}
                                activePage={activePage}
                            />
                        }
                    />
                    <Route
                        path="/about"
                        element={
                            <About
                                isSplashNo={isSplashNo}
                                changeActivePage={changeActivePage}
                                hasEntered={hasEntered}
                                enterChange={enterChange}
                            />
                        }
                    />
                    <Route
                        path="/portfolio"
                        element={
                            <Portfolio
                                isSplashNo={isSplashNo}
                                changeActivePage={changeActivePage}
                                hasEntered={hasEntered}
                                enterChange={enterChange}
                            />
                        }
                    />
                    <Route
                        path="/contact"
                        element={
                            <Contact
                                isSplashNo={isSplashNo}
                                changeActivePage={changeActivePage}
                                hasEntered={hasEntered}
                                enterChange={enterChange}
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    )
}

