import React, { Component } from 'react';
import Sketch from 'react-p5'
let phase = 0.0;
let xOff = Math.cos(phase)*80;
let yOff = Math.sin(phase)*90;


class Contact extends Component {

  constructor(props) {
    super(props)
    this.props.isSplashNo()
    this.props.changeActivePage("contact")
  }


  componentDidMount() {
    if (!this.props.hasEntered) {
      document.getElementById('contactPage').classList.add('enter-off')
      setTimeout(this.fadeInDelay,200)
      setTimeout(this.props.enterChange,300);
    }   
    
  }

  fadeInDelay() {
    document.getElementById('contactPage').classList.remove('enter-off')
    document.getElementById('contactPage').classList.add('fade-in')
  }

  setup = (p5,canvasParentRef) => {
    let canvas = p5.createCanvas(p5.windowWidth,p5.windowHeight)
    canvas.parent(canvasParentRef);
    p5.colorMode(p5.HSB,360,100,100,100)
    p5.noStroke();
    
  }

  draw = p5 => {
    p5.clear();
    xOff = Math.cos(phase)*60;
    yOff = Math.sin(phase)*60;
    p5.textSize(50)
    p5.fill((((phase)/p5.TWO_PI)*360)%360,20,100);
    p5.rect(p5.mouseX+xOff*1.3-300, p5.mouseY+yOff*-0.5-100,600,200)
    p5.fill(((phase)/p5.TWO_PI)*360,50,30);
    p5.text('Thanks for stopping by!',p5.mouseX-xOff-300, p5.mouseY+yOff)
    
    phase+= 0.008;
    if (phase >= p5.TWO_PI) {
      phase = 0;
    }
  }

  render() {
    return (

        <div>
          <div id="contactPage" className="contact">
            <h1 className="subtopic">Reach me here:</h1>
            <br/>
            <h2 className="subtopic">
              Email:
              <br className='brShow'/>
              <a href="mailto:bradjste@gmail.com?subject=Hi Brad!"  className='conLink' rel='noreferrer noopener'> bradjste@gmail.com    </a>
            </h2>
            <h2 className="subtopic">
              Instagram:
              <br className='brShow'/>
              <a href="https://instagram.com/_u/bradjste" target = "_blank" className='conLink'  rel='noreferrer noopener'> @bradjste    </a>
            </h2>
            <h2 className="subtopic">
              LinkedIn:  
              <br className='brShow'/>
              <a href="https://linkedin.com/in/bradjste" target="_blank" className='conLink' rel='noreferrer noopener'> linkedin.com/in/bradjste    </a>
            </h2>
            <h2 className="subtopic">
              Github:  
              <br className='brShow'/>
              <a href="https://github.com/bradjste" target="_blank" className='conLink' rel='noreferrer noopener'> github.com/bradjste    </a>
            </h2>
          </div>
          <div className='contactSketch'>
            <Sketch setup={this.setup} draw={this.draw} windowResized={this.onWindowResize} mousePressed={this.mousePressed} mouseReleased={this.mouseReleased}/>
          </div>
        </div>
        
        
    )
  }
}

export default Contact