// Tree rendering logic
export function drawTree(p, x, y, size, hue, branches, animPhase, branchNoise) {
    p.push()
    p.translate(x, y)

    // Draw trunk
    p.stroke(hue, 60, 40, 90)
    p.strokeWeight(14)
    p.strokeCap(p.SQUARE)
    p.line(0, p.height * 2, 0, -size)

    // Trunk texture
    p.strokeWeight(4)
    p.stroke(hue, 70, 30, 40)
    p.line(-3, p.height * 2, -3, -size * 0.3)
    p.line(3, p.height * 2, 3, -size * 0.4)

    // Draw branches
    branches.forEach((branch, branchIdx) => {
        const branchSwayX = branchNoise.noise2D(branchIdx * 0.5, animPhase * 1.5) * 0.35 - 0.15
        const branchSwayY = branchNoise.noise2D(branchIdx * 0.5 + 100, animPhase * 1.5) * 0.2

        const branchX = Math.sin(branch.angle + branchSwayX) * size * branch.length
        const branchY = -Math.cos(branch.angle + branchSwayY) * size * branch.length - size * 0.5

        p.stroke(hue, 50, 50, 80)
        p.strokeWeight(6)
        p.strokeCap(p.ROUND)
        p.line(0, -size * 0.5, branchX, branchY)

        // Sub-branches
        branch.subBranches.forEach(subBranch => {
            const subLen = branch.length * 0.5
            const subX = branchX + Math.sin(subBranch.angle) * size * subLen
            const subY = branchY - Math.cos(subBranch.angle) * size * subLen

            p.stroke(hue, 40, 60, 60)
            p.strokeWeight(3)
            p.line(branchX, branchY, subX, subY)

            // Sub-branch leaves
            subBranch.leaves.forEach(leaf => {
                const swayAmount = p.sin(animPhase * leaf.swaySpeed + leaf.swayPhase) * 0.2
                const leafAngle = leaf.baseAngle + swayAmount

                p.fill(leaf.hue, 70, 70, 80)
                p.noStroke()

                p.push()
                p.translate(subX, subY)
                p.rotate(leafAngle)

                p.beginShape()
                for (let a = 0; a < p.TWO_PI; a += 0.3) {
                    const r = leaf.size * (1 + 0.3 * Math.cos(a * 2))
                    p.vertex(r * Math.cos(a), r * Math.sin(a) * 0.7)
                }
                p.endShape(p.CLOSE)
                p.pop()
            })
        })

        // Main branch leaves
        branch.leaves.forEach(leaf => {
            const swayAmount = p.sin(animPhase * leaf.swaySpeed + leaf.swayPhase) * 0.2
            const leafAngle = leaf.baseAngle + swayAmount

            p.fill(leaf.hue, 65, 75, 85)
            p.noStroke()

            p.push()
            p.translate(branchX, branchY)
            p.rotate(leafAngle)

            p.beginShape()
            p.vertex(0, -leaf.size)
            p.bezierVertex(leaf.size * 0.5, -leaf.size * 0.3, leaf.size * 0.5, leaf.size * 0.3, 0, leaf.size)
            p.bezierVertex(-leaf.size * 0.5, leaf.size * 0.3, -leaf.size * 0.5, -leaf.size * 0.3, 0, -leaf.size)
            p.endShape(p.CLOSE)
            p.pop()
        })
    })

    p.pop()
}

export function generateTreeData(p, minHeight, maxHeight, minCount, maxCount) {
    const trees = []
    const diagonalLength = Math.sqrt(p.width * p.width + p.height * p.height)
    const treeCount = Math.floor(p.random(minCount, maxCount))

    for (let t = 0; t < treeCount; t++) {
        const treeHue = p.random(360)
        const branches = generateBranches(p, treeHue)

        trees.push({
            diagonalPos: p.random(-diagonalLength * 0.5, diagonalLength * 2),
            size: p.random(minHeight, maxHeight),
            hue: treeHue,
            branches,
            branchNoise: null // Will be set with openSimplexNoise
        })
    }

    return trees
}

function generateBranches(p, treeHue) {
    const branches = [
        { angle: p.random(-1, -0.3), length: p.random(0.4, 0.7), subs: Math.floor(p.random(0, 3)) },
        { angle: p.random(0.3, 1), length: p.random(0.4, 0.7), subs: Math.floor(p.random(0, 3)) },
        { angle: p.random(-0.5, 0.5), length: p.random(0.5, 0.8), subs: Math.floor(p.random(1, 4)) }
    ]

    branches.forEach(branch => {
        branch.leaves = generateLeaves(p, treeHue, 5, 18, 30)
        branch.subBranches = []

        for (let i = 0; i < branch.subs; i++) {
            branch.subBranches.push({
                angle: branch.angle + p.random(-0.5, 0.5),
                leaves: generateLeaves(p, treeHue, 3, 14, 24)
            })
        }
    })

    return branches
}

function generateLeaves(p, baseHue, count, minSize, maxSize) {
    const leaves = []
    for (let l = 0; l < count; l++) {
        leaves.push({
            size: p.random(minSize, maxSize),
            baseAngle: p.random(p.TWO_PI),
            hue: (baseHue + p.random(-30, 30)) % 360,
            swaySpeed: p.random(6.0, 8.0),
            swayPhase: p.random(p.TWO_PI)
        })
    }
    return leaves
}
