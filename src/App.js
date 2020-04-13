import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import About from './pageComps/About'
import Art from './pageComps/About'
import Music from './pageComps/About'
import Contact from './pageComps/About'
import P5Sketch from './P5Sketch.js';
import splashCard from './img/bsSplashCard.png'
import ReactTypingEffect from 'react-typing-effect'

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        rules: [1,0,1,1,0,1,1,0],
        hues: [0,30,60,90,120,150,180,210],
        sats: [100,100,100,100,20,30,40,50],
        fil: [],
        isBlur: true,
        boxNum: 250
      };
      this.changeBlur = this.changeBlur.bind(this)
      this.changePattern = this.changePattern.bind(this)
      // setInterval(this.changeBlur,10000)
      this.changePattern()
  }

  changeBlur(e) {
    if (this.state.isBlur){
      document.getElementById('LiveBackDrop').style.filter = 'blur(0px)';
    }
    else {
      document.getElementById('LiveBackDrop').style.filter = 'blur(4px)';
    }
    this.setState(
      prevState => ({
        isBlur: !(prevState.isBlur)
      })
    )
    
  }

  onHover(e) {

  }

  randomizeFil() {
    let filArr = [];
    for (let i = 0; i< this.state.boxNum; i++) {
      filArr[i] = Math.floor(Math.random()*2);
    }
    return filArr;
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
            fil: this.randomizeFil(),
            rules: ruleArr,
            hues: hueArr,
            sats: satArr
          }
        )
      }
    )
  }

  render() {
    const typeText = ['welcome to my website',
                      'it\'s not ready quite yet, sorry about that',
                      'feel free to around and generate some new patterns',
                      'you can reach me at bradjste@gmail.com in the meantime']
    return(
      <Router>
        
      <div  id='App'>          

        <div id='LiveBackDrop' className="LiveBackDrop" onMouseMove={this.handleMouseMove}  onClick={this.changePattern}>
          <P5Sketch canvasParentRef='LiveBackDrop' 
              sats={this.state.sats} 
              rules={this.state.rules} 
              hues={this.state.hues} 
              boxNum={this.state.boxNum}
              fil={this.state.fil}/>   
        </div>  
        
        <Route exact path="/">
          <div id = 'UI' className="UI">

            {/* 
            <div className="linkDiv">
            <Link to="/about" ><button>About</button></Link>
            <Link to="/art" ><button>Art</button></Link>
            <Link to="/music" ><button>Music</button></Link>
            <Link to="/contact"><button>Contact</button></Link>
            </div> 
            */}

            <div className="splashCard"> 
              <img src={splashCard} onClick={this.changeBlur} alt="title card of site" />
            </div>

            <div id = 'construct' className="construct" >
            <ReactTypingEffect className="constructR" text={typeText} speed={50} eraseDelay={800}/>
              {/* <h1>New site under construction!</h1> */}
              
            </div>
          </div>
        </Route> 
        <Route path="/about">
          <About />
        </Route> 
        <Route path="/art">
          <Art />
        </Route> 
        <Route path="/music">
          <Music />
        </Route> 
        <Route path="/contact">
          <Contact />
        </Route> 
        

      </div>
      </Router>
    );
  }
}

export default App;
