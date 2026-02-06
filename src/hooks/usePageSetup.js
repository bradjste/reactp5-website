import { useEffect } from 'react'

/**
 * Custom hook for setting up page initialization and animations
 * Handles splash screen dismissal, page activation, and fade-in animations
 * @param {string} elementId - The ID of the page element (e.g., 'aboutPage')
 * @param {string} pageName - The name to pass to changeActivePage (e.g., 'about')
 * @param {Function} isSplashNo - Function to dismiss splash screen
 * @param {Function} changeActivePage - Function to set active page
 * @param {boolean} hasEntered - Whether user has entered site
 * @param {Function} enterChange - Function to mark user as entered
 */
export function usePageSetup(elementId, pageName, isSplashNo, changeActivePage, hasEntered, enterChange) {
    // Initialize page and dismiss splash on mount
    useEffect(() => {
        isSplashNo()
        changeActivePage(pageName)
    }, [isSplashNo, changeActivePage, pageName])

    // Handle enter animation
    useEffect(() => {
        if (!hasEntered) {
            const pageElement = document.getElementById(elementId)
            if (pageElement) {
                pageElement.classList.add('enter-off')
            }
            setTimeout(() => {
                if (pageElement) {
                    pageElement.classList.remove('enter-off')
                    pageElement.classList.add('fade-in')
                }
            }, 200)
            setTimeout(enterChange, 300)
        }
    }, [hasEntered, enterChange, elementId])
}
