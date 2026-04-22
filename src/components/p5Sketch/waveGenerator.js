import openSimplexNoise from '../../OpenSimplexNoise'
import { COLOR_PALETTES, WAVE_CONFIG } from './config'
import { generateTreeData } from './treeRenderer'

export function generateWaves(p, params) {
    const { layerCount, waveDensity } = params
    const noiseGenerators = []
    const waveConfigs = []
    
    // Generate base hue
    const baseHue = generateBaseHue(params.colorPalette)
    const complementaryHues = generateComplementaryHues(baseHue, params.colorPalette)
    
    // Generate wave layers
    for (let i = 0; i < layerCount; i++) {
        const seed = p.random(10000)
        noiseGenerators.push({
            base: openSimplexNoise(seed),
            grain: openSimplexNoise(seed * 1.618)
        })
        
        const waveConfig = generateWaveConfig(p, complementaryHues, waveDensity)
        const trees = generateTreeData(p, params.minTreeHeight, params.maxTreeHeight, 
                                      params.minTreeCount, params.maxTreeCount)
        
        // Add noise generators to trees
        trees.forEach(tree => {
            tree.branchNoise = openSimplexNoise(p.random(10000))
        })
        
        waveConfig.trees = trees
        waveConfigs.push(waveConfig)
    }
    
    return { noiseGenerators, waveConfigs }
}

function generateBaseHue(palette) {
    const generator = COLOR_PALETTES[palette] || COLOR_PALETTES.random
    return generator()
}

function generateComplementaryHues(baseHue, palette) {
    if (palette === 'monochrome') {
        return [baseHue, baseHue, baseHue, baseHue]
    }
    return [
        baseHue,
        (baseHue + 90) % 360,
        (baseHue + 180) % 360,
        (baseHue + 270) % 360
    ]
}

function generateWaveConfig(p, complementaryHues, waveDensity) {
    const grainFreq = p.random(...WAVE_CONFIG.grainFreqRange)
    const speed = p.random(...WAVE_CONFIG.speedRange)
    
    // Keep wavelength consistent for wave shapes
    const wavelength = p.random(...WAVE_CONFIG.wavelengthRange)
    
    // Pick hue based on 60-20-10-10 rule
    const rand = p.random()
    let derivedHue
    if (rand < 0.6) derivedHue = complementaryHues[0]
    else if (rand < 0.8) derivedHue = complementaryHues[1]
    else if (rand < 0.9) derivedHue = complementaryHues[2]
    else derivedHue = complementaryHues[3]
    
    // Generate saturation and brightness
    let sat, brt
    if (p.random() < 0.5) {
        sat = p.random(10, 50)
        brt = p.random(65, 100)
    } else {
        sat = p.random(60, 100)
        brt = p.random(40, 100)
    }
    
    const smoothness = p.random() < 0.3 ? p.random(0.8, 1.0) : p.random(0, 0.5)
    const hasStroke = p.random() < 0.25
    
    return {
        wavelength,
        baseAmp: p.random(...WAVE_CONFIG.baseAmpRange),
        grainAmp: p.map(grainFreq, 0.015, 0.08, 1, 12),
        speed: speed * 2,
        parallaxScale: p.map(speed, 0.05, 0.35, 0.6, 1.4),
        smoothness,
        hasStroke,
        strokeWeight: hasStroke ? p.random(1, 3) : 0,
        strokeAlpha: hasStroke ? p.random(40, 80) : 0,
        hue: derivedHue,
        sat,
        brt,
        opacity: 100,
        phaseOffset: p.random(0, p.TWO_PI),
        trees: []
    }
}
