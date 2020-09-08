import React, {Component} from 'react'
import Sketch from 'react-p5'

let phase = 0;
class Harmony extends Component {

    constructor(props) {
        super(props)
        this.state = {
          row:10,
          column:10
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
        p5.frameRate(30)
        canvas.parent('p5IdD');
        p5.colorMode(p5.HSB,360,100,100,100)
        p5.noStroke();
      }
    
    
      draw = p5 => {
        p5.background(0);
        const vw = p5.width;
        const vh = p5.height;

        for (let i = 0; i < this.state.row; i++){
            // p5.fill(100)
            // p5.rect((i+0.5)*vw/(this.state.row)-p5.width*0.0005,0,p5.width*0.001,p5.height)
            p5.fill((360*i/this.state.column),100,100)  

            for (let j = 0; j < this.state.column;j++) {
                p5.ellipse((i+0.5)*vw/this.state.column+10*Math.sin(phase+j*i),(j+0.5)*vh/(this.state.column), 10 , 10)
            }
        }
        phase += 0.15 + 1*p5.mouseX/p5.width;
        if (phase >= Math.TWO_PI) {
            phase = 0;
        }
      }
    
      onWindowResize = (p5) => {
        p5.resizeCanvas(p5.width,p5.height)
      }
    
      render() {
        return (
          <div id='p5IdD' className='cell-autom'>
              <Sketch setup={this.setup} draw={this.draw} windowResized={this.onWindowResize} />
          </div>
        )
      }
    
}

export default Harmony