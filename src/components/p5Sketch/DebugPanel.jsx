import React from 'react'

export default function DebugPanel({ params, onParamChange, onRegenerate }) {
    return (
        <div style={styles.container}>
            <h3 style={styles.header}>
                Debug Controls <span style={styles.subtitle}>(Press 'D' to close)</span>
            </h3>

            <ParamSlider
                label="Wave Layers"
                value={params.layerCount}
                min={10}
                max={100}
                onChange={(val) => onParamChange('layerCount', val)}
            />

            <ParamSlider
                label="Wave Density (waves per screen)"
                value={params.waveDensity}
                min={1}
                max={10}
                onChange={(val) => onParamChange('waveDensity', val)}
            />

            <ParamSlider
                label="Wave Horizontal Offset"
                value={params.waveOffsetX}
                min={-2000}
                max={2000}
                onChange={(val) => onParamChange('waveOffsetX', val)}
            />

            <ParamSlider
                label="Wave Amplitude"
                value={params.amplitude}
                min={0.1}
                max={2.0}
                step={0.1}
                onChange={(val) => onParamChange('amplitude', val)}
            />

            <ParamSlider
                label="Min Trees per Wave"
                value={params.minTreeCount}
                min={0}
                max={15}
                onChange={(val) => onParamChange('minTreeCount', val)}
            />

            <ParamSlider
                label="Max Trees per Wave"
                value={params.maxTreeCount}
                min={0}
                max={20}
                onChange={(val) => onParamChange('maxTreeCount', val)}
            />

            <ParamSlider
                label="Min Tree Height"
                value={params.minTreeHeight}
                min={40}
                max={200}
                onChange={(val) => onParamChange('minTreeHeight', val)}
            />

            <ParamSlider
                label="Max Tree Height"
                value={params.maxTreeHeight}
                min={40}
                max={300}
                onChange={(val) => onParamChange('maxTreeHeight', val)}
            />

            <div style={styles.controlGroup}>
                <label style={styles.label}>Color Palette</label>
                <select
                    value={params.colorPalette}
                    onChange={(e) => onParamChange('colorPalette', e.target.value)}
                    style={styles.select}
                >
                    <option value="random">Random (No Green)</option>
                    <option value="warm">Warm (Red/Orange/Yellow)</option>
                    <option value="cool">Cool (Blue/Purple)</option>
                    <option value="monochrome">Monochrome</option>
                </select>
            </div>

            <button onClick={onRegenerate} style={styles.button}>
                Regenerate Sketch
            </button>
        </div>
    )
}

function ParamSlider({ label, value, min, max, step, onChange }) {
    return (
        <div style={styles.controlGroup}>
            <label style={styles.label}>{label}: {value}</label>
            <input
                type="range"
                min={min}
                max={max}
                step={step || 1}
                value={value}
                onChange={(e) => onChange(step ? parseFloat(e.target.value) : parseInt(e.target.value))}
                style={styles.slider}
            />
        </div>
    )
}

const styles = {
    container: {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 10000,
        minWidth: '250px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    header: {
        margin: '0 0 15px 0',
        fontSize: '14px',
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: '10px',
        opacity: 0.6
    },
    controlGroup: {
        marginBottom: '12px'
    },
    label: {
        display: 'block',
        marginBottom: '4px',
        fontSize: '11px',
        opacity: 0.8
    },
    slider: {
        width: '100%'
    },
    select: {
        width: '100%',
        padding: '4px',
        background: 'rgba(255, 255, 255, 0.1)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '11px'
    },
    button: {
        width: '100%',
        padding: '8px',
        background: 'rgba(255, 255, 255, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '4px',
        color: 'white',
        cursor: 'pointer',
        fontFamily: 'monospace',
        fontSize: '11px',
        marginTop: '8px'
    }
}
