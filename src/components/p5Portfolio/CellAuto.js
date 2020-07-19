import React, {Component} from 'react'
import Sketch from 'react-p5'

let randHue = Math.floor(Math.random()*360)
let phase = 0;
let mouseIsPressed = false;
let lastRules = []

class CellAuto extends Component {

  constructor(props) {
    super(props)
    this.state = {
      fil: [],
      rules: [0,0,0,0,0,0,0,0],
      hues: [0,30,60,90,120,150,180,210],
      sats: [40,30,40,30,20,20,40,20],
      circBool: false,
      boxNum: 30,
      frameRate: 24
    }
    this.initFil = this.initFil.bind(this)
    this.calcNil = this.calcNil.bind(this)
    this.changePattern = this.changePattern.bind(this)
  }

  componentDidMount() {
    document.getElementById('p5Id').classList.add('enter-off')
    this.fadeInById('p5Id')
    this.changePattern();
  }

  fadeInById(id) {
    document.getElementById(id).classList.remove('enter-off')
    document.getElementById(id).classList.add('fade-in')
  }

  // setup = (p5,canvasParentRef) => {
  //   let canvas = p5.createCanvas(p5.width,p5.height)
  //   canvas.parent(canvasParentRef);
  //   p5.colorMode(p5.HSB,360,100,100)
  //   p5.background(360)
  //   this.initFil()
  //   p5.frameRate(20)
  //   p5.noStroke()
  //   p5.background(0)
  // }

  setup = (p5,canvasParentRef) => {
    p5.frameRate(this.state.frameRate);
    let canvas = p5.createCanvas(p5.windowWidth*.835,p5.windowHeight*0.2)
    canvas.parent(canvasParentRef);
    p5.colorMode(p5.HSB,360,100,100,100)
    p5.noStroke();
    p5.background(0);
  }

  changePattern(e) {
    this.setState(
       () => {
         let ruleArr = []
         let hueArr = []
         let satArr = []
         for (let i = 0; i < 8; i++) {
           ruleArr[i] = Math.floor(Math.random()*2)
           hueArr[i] = Math.floor(Math.random()*360)
           satArr[i] = Math.floor(Math.random()*60)
         }
         return(
           {
             fil: this.randomizeFil(),
             rules: ruleArr,
             hues: hueArr,
             sats: satArr
           }
         )
       }
     )
   }

  draw = p5 => {
    let currRuleSelect = 0
    let phaseAdd = 0;
    let circRatio = 0.1;
    const boxNum = this.state.boxNum
    let currHue = 0;
    if (JSON.stringify(lastRules) !== JSON.stringify(this.state.rules)) {
      this.initFil()
      lastRules = [...this.state.rules]
    }
    let currRow = [...this.state.fil];
    let nextRow = []
    let ux = Math.floor(p5.width / boxNum)+1+Math.max((50*p5.mouseX/p5.width),0);
    let uy = Math.floor(p5.height / boxNum)+1
    if (p5.height >= p5.width) {
      uy = Math.floor(p5.height / boxNum)+1
      ux = uy*(.7);
      circRatio = 0.3
    }
    const rowNum = Math.floor(p5.height / uy)
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
          p5.fill((100*(i/(p5.width/ux))+(100*(j/(p5.height/uy))+currHue+randHue+100*Math.sin(phase)))%360,
                  (((0.0018*p5.dist(p5.mouseX,p5.mouseY,ux*i,uy*j)))*(100))+(((j*1.0)/p5.height)*180),
                   100)
        } else if(mouseIsPressed) {
          p5.fill((currHue+randHue)%360,100,100)
        }
        else {
          p5.fill((currHue+randHue)%360,100,0)
        }
       
        
        
        if (mouseIsPressed) {
          phaseAdd = 0.09;
        }

        if (this.state.circBool) {
          if (p5.dist(p5.mouseX,p5.mouseY,ux*i,uy*j) < p5.width*circRatio) {
            p5.rect(0,0,ux,uy)

          }  
        } else {
          p5.rect(ux*(i-0.5),uy*(j),ux,uy+1)
        }
        nextRow[i] = this.state.rules[currRuleSelect]
      }
      currRow = [...nextRow]
    }
    this.calcNil()   
    phase+= p5.TWO_PI*0.00511111 + phaseAdd;
    if (phase > p5.TWO_PI) {
      phase = 0;
    }
  }

  mousePressed = () => { 
    mouseIsPressed = true;
  }

  mouseReleased = () => { 
    mouseIsPressed = false;
  }

  initFil = () => {
    this.setState(
      () => {
        let firstFil = []
        for (let i = 0; i < this.state.boxNum; i++) {
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

  randomizeFil() {
    let filArr = [];
    for (let i = 0; i< this.state.boxNum; i++) {
      filArr[i] = Math.floor(Math.random()*2);
    }
    return filArr;
  }


  onWindowResize = (p5) => {
    p5.resizeCanvas(p5.width,p5.height)
  }

  calcNil = () => {
    this.setState( prevState => {
      const boxNum = this.state.boxNum
      const fil = [...prevState.fil]
      let nil = []
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
      <div id='p5Id' className='cell-autom' onClick={this.changePattern}>
          <Sketch setup={this.setup} draw={this.draw} windowResized={this.onWindowResize} mousePressed={this.mousePressed} mouseReleased={this.mouseReleased}/>
      </div>
    )
  }

}

export default CellAuto