import React, {Component} from 'react'
import Sketch from 'react-p5'

let randHue = Math.floor(Math.random()*360)
// let stretch = Math.random()*2-1
let phase = 0;
let circBool = false;
class P5Sketch extends Component {

  
  constructor(props) {
    super(props)
    this.state = {
      rules: this.props.rules,
      hues: this.props.hues,
      sats: this.props.sats,
      fil: [],
      boxNum: 100
    }
    this.initFil = this.initFil.bind(this)
    this.initRules = this.initRules.bind(this)
    this.calcNil = this.calcNil.bind(this)
  }

  setup = (p5,canvasParentRef) => {
    let canvas = p5.createCanvas(p5.windowWidth,p5.windowHeight)
    canvas.parent(canvasParentRef);
    p5.colorMode(p5.HSB,360,100,100)
    p5.background(360)
    this.initFil()
    p5.frameRate(20)
    p5.noStroke()
    this.initRules()
    this.initHues()
    p5.background(0)
  }

  draw = p5 => {
    this.setRules()
    let currRuleSelect = 0
    const boxNum = this.state.boxNum
    let currHue = 0;
    let currRow = [...this.state.fil]
    let nextRow = []
    const ux = p5.windowWidth / boxNum
    const uy = Math.floor(ux)
    const rowNum = p5.windowHeight / uy
    for (let j = 0; j < rowNum; j++) {    
      for (let i = 0; i < boxNum; i++) {
        if (i===0) {
          currRuleSelect = 4*currRow[boxNum-1]+2*currRow[0]+currRow[1]
        } else if (i === boxNum-1) {
          currRuleSelect = 4*currRow[i-1]+2*currRow[i]+currRow[0]
        } else {
          currRuleSelect = 4*currRow[i-1]+2*currRow[i]+currRow[i+1]
        }
        currHue = Math.floor(this.state.hues[currRuleSelect])
        if (!currRow[i]) {
          p5.fill((100*(i/(p5.windowWidth/ux))+(100*(j/(p5.windowHeight/uy))+currHue+randHue+100*Math.sin(phase)))%360,this.state.sats[currRuleSelect]-40*(j/(p5.windowHeight/uy)),100)
        } else {
          p5.fill((currHue+randHue)%360,100,0)
        }
        
        if (circBool ? p5.dist(p5.mouseX/1.1,p5.mouseY/1.1,ux*i,uy*j) < p5.windowWidth*0.15 : true) {
          // if (p5.dist(p5.windowWidth*0.5,p5.windowHeight*0.5,ux*i,uy*j) < p5.windowHeight*(p5.mouseY/p5.windowHeight)) {
          p5.rect(ux*(i-0.5),uy*(j+0.8),ux+2,uy+2)

        }
          nextRow[i] = this.state.rules[currRuleSelect]
        
        
      }
      
      currRow = [...nextRow]
    }
    this.calcNil()
    // p5.fill(360*(phase/6.24),100,100)
    // p5.ellipse(p5.windowWidth*0.1 + 50*Math.cos(phase),p5.windowHeight*0.8+ 50*Math.sin(phase),20,20)
    phase+= p5.TWO_PI*0.00511111;
    if (phase > p5.TWO_PI) {
      phase = 0;
    }
  }

  initFil = () => {
    this.setState(
      () => {
        let firstFil = []
        // const spaceship = [0,0,0,1,0,0,1,1,0,1,1,1,1,1]
        for (let i = 0; i < this.state.boxNum; i++) {
          firstFil[i] = 0
          //  firstFil[i] = Math.floor(Math.random()*2)
          // firstFil[i] = spaceship[i%spaceship.length]
        }
        firstFil[Math.floor(firstFil.length/2)] = 1
        return(
          {
            fil: firstFil
          }
        )
      }
    )
  }

  initHues = () => {
    this.setState(
      () => {
        let hues = []
        for (let i = 0; i < 8; i++) {
         // hues[i] = 0
         hues[i] = (Math.random()*360)
          // firstFil[i] = spaceship[i%spaceship.length]
        }
        //hues[Math.floor(hues.length/2)] = 1
        return(
          {
            hues: hues
          }
        )
      }
    )
  }

  setRules = () => {
    this.setState(() => {
      return(
        {
          rules:this.props.rules,
          hues:this.props.hues,
          sats:this.props.sats

        }
      )
    })
  }

  initRules = () => {
    this.setState(
      () => {
        let ruleArr = []
        for (let i = 0; i < 8; i++) {
          ruleArr[i] = Math.floor(Math.random()*2)
        }
        return(
          {
            rules: ruleArr
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
      const boxNum = this.state.boxNum
      const fil = [...prevState.fil]
      const nil = []
      const rules = this.state.rules
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
      <Sketch setup={this.setup} draw={this.draw} windowResized={this.onWindowResize}/>
    )
  }

}

export default P5Sketch
