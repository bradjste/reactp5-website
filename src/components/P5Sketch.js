import React, {Component} from 'react'
import Sketch from 'react-p5'

let phase = 0;
class P5Sketch extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fil: []
    }
    this.initFil = this.initFil.bind(this)
    this.calcNil = this.calcNil.bind(this)
  }

  componentDidMount() {
    document.getElementById('p5Id').classList.add('enter-off')
    this.fadeInById('p5Id')
  }

  fadeInById(id) {
    document.getElementById(id).classList.remove('enter-off')
    document.getElementById(id).classList.add('fade-in')
  }

  // setup = (p5,canvasParentRef) => {
  //   let canvas = p5.createCanvas(p5.windowWidth,p5.windowHeight)
  //   canvas.parent(canvasParentRef);
  //   p5.colorMode(p5.HSB,360,100,100)
  //   p5.background(360)
  //   this.initFil()
  //   p5.frameRate(20)
  //   p5.noStroke()
  //   p5.background(0)
  // }

  setup = (p5,canvasParentRef) => {
    let canvas = p5.createCanvas(p5.windowWidth,p5.windowHeight)
    canvas.parent(canvasParentRef);
    p5.colorMode(p5.HSB,360,100,100,100)
    p5.noStroke();
  }

  draw = p5 => {    
    p5.background(0,0,0,10)
    // if (mouseIsPressed) {
    //   p5.background(360)
    // } else {
    //   p5.background(0)
    // }
    let sqSize = p5.windowWidth*0.3333
    p5.fill(360*(phase/p5.TWO_PI),10,100)
    p5.rect(0,0,sqSize,p5.windowHeight)
    p5.fill((360*(phase/p5.TWO_PI)+30)%360,10,100)
    p5.rect(p5.windowWidth*0.3333,0,sqSize,p5.windowHeight)
    p5.fill((360*(phase/p5.TWO_PI)+90)%360,10,100)
    p5.rect(p5.windowWidth*0.3333*2,0,sqSize,p5.windowHeight)
    phase += 0.01;
    if (phase > p5.TWO_PI) {
      phase = 0;
    }
    p5.fill(0)
  }

  // draw = p5 => {
  //   let currRuleSelect = 0
  //   let phaseAdd = 0;
  //   let circRatio = 0.1;
  //   const boxNum = this.props.boxNum
  //   let currHue = 0;
  //   if (JSON.stringify(lastRules) !== JSON.stringify(this.props.rules)) {
  //     this.initFil()
  //     lastRules = [...this.props.rules]
  //   }
  //   let currRow = [...this.state.fil];
  //   let nextRow = []
  //   let ux = Math.floor(p5.windowWidth / boxNum)+1
  //   let uy = ux
  //   if (p5.windowHeight >= p5.windowWidth) {
  //     uy = Math.floor(p5.windowHeight / boxNum)+1
  //     ux = uy*(.7);
  //     circRatio = 0.3
  //   }
  //   const rowNum = Math.floor(p5.windowHeight / uy)
  //   for (let j = 0; j < rowNum; j++) {    
  //     for (let i = 0; i < boxNum; i++) {
  //       if (i===0) {
  //         currRuleSelect = 4*currRow[boxNum-1]+2*currRow[0]+currRow[1]
  //       } else if (i === boxNum-1) {
  //         currRuleSelect = 4*currRow[i-1]+2*currRow[i]+currRow[0]
  //       } else {
  //         currRuleSelect = 4*currRow[i-1]+2*currRow[i]+currRow[i+1]
  //       }
  //       currHue = Math.floor(this.props.hues[currRuleSelect])
  //       if (!currRow[i]) {
  //         p5.fill((100*(i/(p5.windowWidth/ux))+(100*(j/(p5.windowHeight/uy))+currHue+randHue+100*Math.sin(phase)))%360,
  //                 (((0.008*p5.dist(p5.mouseX/1.1,p5.mouseY/1.1,ux*i,uy*j)))*(100))+(((j*1.0)/p5.windowHeight)*180),
  //                  100)
  //       } else {
  //         p5.fill((currHue+randHue)%360,100,0)
  //       }
       
        
        
  //       if (mouseIsPressed) {
  //         phaseAdd = 0.09;
  //       }

  //       if (this.props.circBool) {
  //         if (p5.dist(p5.mouseX/1.1,p5.mouseY/1.1,ux*i,uy*j) < p5.windowWidth*circRatio) {
  //           p5.rect(ux*(i-0.5),uy*(j+0.8),ux+5,uy+5)

  //         }  
  //       } else {
  //         p5.rect(ux*(i-0.5),uy*(j+0.8),ux+5,uy+5)
  //       }
  //       nextRow[i] = this.props.rules[currRuleSelect]
  //     }
  //     currRow = [...nextRow]
  //   }
  //   this.calcNil()   
  //   phase+= p5.TWO_PI*0.00511111 + phaseAdd;
  //   if (phase > p5.TWO_PI) {
  //     phase = 0;
  //   }
  // }

  initFil = () => {
    this.setState(
      () => {
        let firstFil = []
        for (let i = 0; i < this.props.boxNum; i++) {
          // firstFil[i] = 0
          firstFil[i] = Math.floor(Math.random()*2)
        }
        // firstFil[Math.floor(firstFil.length/2)] = 1
        return(
          {
            fil: firstFil
          }
        )
      }
    )
  }


  onWindowResize = (p5) => {
    p5.resizeCanvas(p5.windowWidth,p5.windowHeight)
  }

  calcNil = () => {
    this.setState( prevState => {
      const boxNum = this.props.boxNum
      const fil = [...prevState.fil]
      let nil = []
      const rules = this.props.rules      
      nil[0] = rules[4*fil[boxNum-1]+2*fil[0]+fil[1]]
      nil[boxNum-1] = rules[(4*fil[boxNum-2]+fil[boxNum-1]+fil[0])]
      for (let i = 1; i < fil.length-1; i++) {
        nil[i] = rules[(4*fil[i-1]+2*fil[i]+fil[i+1])]
      }
      
      return(
        {
          fil: nil
        }
      )
    })
  }

  render() {
    return (
      <div id='p5Id'>
          <Sketch setup={this.setup} draw={this.draw} windowResized={this.onWindowResize} />
      </div>
    )
  }

}

export default P5Sketch