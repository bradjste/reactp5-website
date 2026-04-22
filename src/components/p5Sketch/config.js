// Sketch configuration and constants
export const DEFAULT_PARAMS = {
    layerCount: 45,
    resolution: 3, // Fixed render resolution for smoothness
    waveDensity: 5, // Controls wavelength (1-10, higher = more waves per screen)
    waveOffsetX: 0, // Horizontal offset for all waves (-2000 to 2000)
    amplitude: 1.0, // Wave amplitude multiplier (0.1 to 2.0)
    minTreeCount: 4,
    maxTreeCount: 9,
    minTreeHeight: 80,
    maxTreeHeight: 160,
    colorPalette: 'random' // 'random', 'warm', 'cool', 'monochrome'
}

export const ANIMATION_CONFIG = {
    fadeDuration: 240, // frames (4 seconds at 60fps)
    colorFadeStart: 60 // frames when colors start fading in (1 second)
}

export const WAVE_CONFIG = {
    wavelengthRange: [150, 500],
    baseAmpRange: [10, 45],
    speedRange: [0.2, 3.5],
    grainFreqRange: [0.015, 0.08],
    perpendicularExtent: { min: -0.7, max: 0.9 }
}

export const COLOR_PALETTES = {
    warm: () => {
        const random = Math.random()
        return random < 0.5 ? Math.random() * 60 : 330 + Math.random() * 30
    },
    cool: () => 180 + Math.random() * 90,
    monochrome: (baseHue) => baseHue,
    random: () => {
        let hue
        do {
            hue = Math.random() * 360
        } while (hue >= 80 && hue <= 160) // Avoid green
        return hue
    }
}
