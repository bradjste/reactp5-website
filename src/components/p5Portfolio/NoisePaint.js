import React, {Component} from 'react'
import Sketch from 'react-p5'
import openSimplexNoise from '../../OpenSimplexNoise'

let phase = Math.PI;
let mouseIsPressed = false;
let noiseScale = 40
let openSimplex
let i = 0.0
class NoisePaint extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scale: 9
    }
  }

  componentDidMount() {
    document.getElementById('p5Id').classList.add('enter-off')
    this.fadeInById('p5Id')
  }

  fadeInById(id) {
    document.getElementById(id).classList.remove('enter-off')
    document.getElementById(id).classList.add('fade-in')
  }

  setup = (p5,canvasParentRef) => {
    let canvas = p5.createCanvas(p5.windowWidth*.835,p5.windowHeight*0.2)
    canvas.parent(canvasParentRef);
    p5.colorMode(p5.HSB,360,100,100,100)
    p5.background(0);
    p5.noStroke()
    openSimplex = openSimplexNoise(Math.random(i))
  }


  draw = p5 => {
    noiseScale = 20+50*p5.mouseX/p5.width
    p5.background(0,0,0,8)
        if (mouseIsPressed) {
          openSimplex = openSimplexNoise(i)

        }
        let x, y;
        // let circRatio = 0.1;
        for (y = 0; y < p5.height; y+=this.state.scale) {
            for (x = 0; x < p5.width; x+=this.state.scale) {
                const value = (openSimplex.noise3D(x/noiseScale-(i*10), y/noiseScale-i*3,i*5)+0.75) * 360
                // p5.stroke(value > 240 ? 255: 0,255*p5.mouseY/p5.height,(255*p5.mouseX/p5.width)%255)
                p5.fill((((Math.sin(phase)*360)+50)+(value > 240 ? 180: 0)+(160*(x*y*0.005)/p5.width)+60)%360,value > 240 ? 100: 70,30+(value > 240 ? 100:70*p5.mouseX/p5.width))
                // p5.stroke((((Math.sin(phase)*360)+50*p5.mouseX/p5.width)+(value > 240 ? 180: 0)+(160*x/p5.width))%360,value > 240 ? 100: 30,100)
                if (60+Math.sin(2*(Math.PI/2+phase/4)*value/360)*400 > 200) {
                  p5.rect(x, y,this.state.scale,this.state.scale)                                     
                } 
            }
        }
    i+= 0.009;
    phase+=0.005;
    if (phase >= Math.TWO_PI) {
      phase = 0;
    }
  }

  mousePressed = () => { 
    mouseIsPressed = true;
  }

  mouseReleased = () => { 
    mouseIsPressed = false;
  }

  onWindowResize = (p5) => {
    p5.resizeCanvas(p5.windowWidth,p5.windowHeight)
  }

  clicked = (p5) => {

  }

  render() {
    return (
      <div id='p5Id' className='cell-autom' onClick={this.clicked}>
          <Sketch setup={this.setup} draw={this.draw} windowResized={this.onWindowResize} mousePressed={this.mousePressed} mouseReleased={this.mouseReleased}/>
      </div>
    )
  }

}

export default NoisePaint