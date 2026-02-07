import React, { useState } from 'react'
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

    // Page routes configuration
    const pageRoutes = [
        { path: '/about', component: About, label: 'about' },
        { path: '/portfolio', component: Portfolio, label: 'portfolio' },
        { path: '/contact', component: Contact, label: 'contact' },
    ]

    // Shared props for page components
    const pageProps = {
        isSplashNo: () => setIsSplash(false),
        changeActivePage: setActivePage,
        hasEntered,
        enterChange: () => setHasEntered(true),
    }

    return (
        <Router>
            <div id="App">
                <div id="LiveBackDrop" className={`LiveBackDrop ${!isSplash ? 'blurred' : ''}`}>
                    <P5Sketch />
                </div>

                {!isSplash && activePage.length > 0 && (
                    <Navbar isSplashYes={() => setIsSplash(true)} hasEntered={hasEntered} />
                )}

                <Routes>
                    <Route
                        path="/"
                        element={
                            <Splash
                                hasEntered={hasEntered}
                                isSplashNo={() => setIsSplash(false)}
                                enterChange={() => setHasEntered(true)}
                                activePage={activePage}
                            />
                        }
                    />
                    {pageRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.component {...pageProps} />}
                        />
                    ))}
                </Routes>
            </div>
        </Router>
    )
}

