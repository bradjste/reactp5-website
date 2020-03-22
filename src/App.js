import React, { Component } from 'react';
import './App.css';
import P5Sketch from './P5Sketch.js';
import splashCard from './img/bsSplashCard.png'

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        rules: [1,0,1,1,0,1,1,0],
        hues: [0,30,60,90,120,150,180,210],
        sats: [100,100,100,100,20,30,40,50]
      };
      this.changeBlur = this.changeBlur.bind(this)
      this.changePattern = this.changePattern.bind(this)
      // setInterval(this.changeBlur,10000)
  }

  changeBlur(e) {
    if (this.state.isBlur){
      document.getElementById('LiveBackDrop').style.filter = 'blur(0px)';
    }
    else {
      document.getElementById('LiveBackDrop').style.filter = 'blur(6px)';
    }
    this.setState(
      prevState => ({
        isBlur: !(prevState.isBlur)
      })
    )
    
  }

  onHover(e) {

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
          satArr[i] = Math.floor(Math.random()*100)
        }
        return(
          {
            rules: ruleArr,
            hues: hueArr,
            sats: satArr
          }
        )
      }
    )
  }

  

    
  render() {
    return(
      <div  id='App'>          

        <div id='LiveBackDrop' className="LiveBackDrop" onMouseMove={this.handleMouseMove}>
          <P5Sketch canvasParentRef='LiveBackDrop' sats={this.state.sats} rules={this.state.rules} hues={this.state.hues}/>   
        </div> 

        <div id = 'UI' className="UI">
          {/* <button onClick={this.changeBlur} onHover={this.onHover}>
            Blur
          </button>  
          <button onClick={this.changePattern}>
            Pattern
          </button>   */}
          <div className="splashCard"> 
            <img src={splashCard} onClick={this.changePattern} alt="title card of site" />
          </div>
        </div>  
        

      </div>
    );
  }
}

export default App;
