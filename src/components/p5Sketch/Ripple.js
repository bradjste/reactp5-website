// Ripple effect class
export class Ripple {
    constructor(clickOffset, topColor, bottomColor) {
        this.clickOffset = clickOffset
        this.topColor = topColor
        this.bottomColor = bottomColor
        this.radius = 0
        this.maxRadius = 5000
        this.speed = 15
    }

    update() {
        this.radius += this.speed
    }

    getInfluenceAndColor(layerOffset) {
        const dist = Math.abs(layerOffset - this.clickOffset)
        const edgeDist = Math.abs(dist - this.radius)
        
        const rippleWidth = 500
        if (edgeDist < rippleWidth) {
            const normalizedDist = edgeDist / rippleWidth
            const influence = Math.pow(1 - normalizedDist, 3)
            const color = layerOffset > this.clickOffset ? this.topColor : this.bottomColor
            return { influence, color }
        }
        return { influence: 0, color: null }
    }

    isDead() {
        return this.radius > this.maxRadius
    }
}
