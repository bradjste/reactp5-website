import React, { Component } from 'react';
// import Sketch from 'react-p5';

let phase = 0;

class ProjectItem extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            infoState: "description"
        }
    }

    setup = (p5,canvasParentRef) => {
        let canvas = p5.createCanvas(p5.windowWidth*0.2,p5.windowWidth*0.2)
        p5.frameRate(30)
        canvas.parent(canvasParentRef);
        p5.colorMode(p5.HSB,360,100,100,100)
        p5.noStroke();
    }
    
    
    draw = p5 => {
        p5.background(0,0,0,20)
        const w = p5.width;
        const h = p5.height;
        p5.fill(220,90,50,100)
        // p5.ellipse(p5.mouseX,p5.mouseY,20,20)
        p5.ellipse(w*0.5+w*0.05*Math.cos(phase),h*0.5+w*0.05*Math.sin(phase),w*.06,w*.06)
        phase += 0.065
        if (phase >= 6.28) {
            phase = 0;
        }
    }

    onWindowResize = (p5) => {
        p5.resizeCanvas(p5.width,p5.height)
    }
    
    render() {
        return(
            <div>
                <p className='projTitle'>{this.props.title}</p>
                <div className='portProjItem'>
                    <img src = {this.props.img} alt="Related to the given project" onClick={() => window.open(this.props.link,'_blank')}/>
                </div>
              {/* <Sketch setup={this.setup} draw={this.draw} windowResized={this.onWindowResize} /> */}
            </div>
        )
    }
}

export default ProjectItem