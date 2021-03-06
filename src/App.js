import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Splash from './components/pageComps/Splash'
import About from './components/pageComps/About'
import Contact from './components/pageComps/Contact'
import Portfolio from './components/pageComps/Portfolio'
import P5Sketch from './components/P5Sketch.js';
import splashCard from './img/bsSplashCard2.png'
import Navbar from "./components/Navbar"

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        isBlur: false,
        isSplash: true,
        hasEntered: false,
        activePage: ""
      };
      this.changeBlur = this.changeBlur.bind(this)
      this.changePattern = this.changePattern.bind(this)
      this.changeActivePage= this.changeActivePage.bind(this)     
      this.isSplashYes = this.isSplashYes.bind(this)
      this.isSplashNo = this.isSplashNo.bind(this)
      this.changePattern()
  }

  changeBlur(e) {
    if (this.state.isBlur){
      document.getElementById('LiveBackDrop').style.filter = 'blur(0px)';
      document.getElementById('splashCard').style.opacity = '0.5';
    }
    else {
      document.getElementById('LiveBackDrop').style.filter = 'blur(7px)';
      document.getElementById('splashCard').style.opacity = '1';
    }
    this.setState(
      prevState => ({
        isBlur: !(prevState.isBlur)
      })
    )
    
  }


  changeActivePage = (x) => {
    this.setState(() => {
      return {
        activePage: x
      }
    })
  }


  enterChange(e) {
    this.setState(() => {
      return {
        hasEntered: true
      }
    })
  }

  isSplashYes(e) {
    this.setState(() => {
      return {
        isSplash: true
      }
    })
  }

  isSplashNo(e) {
    this.setState(() => {
      return {
        isSplash: false
      }
    })
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

  oldSiteRedirect = () => {
    window.open('https://bradjste.github.io/bjsWebsite/','_blank')
  }

  render() {
      let splash = <img id='splashCard'src={splashCard} alt="title card of site" />
      return(
      <div  id='App'>  
        <Router basename={`${process.env.PUBLIC_URL}/`}>       
          {!this.state.isSplash && this.state.activePage.length > 0 &&
          <Navbar className="navbar"
                enterChange={this.enterChange.bind(this)}
                hasEntered={this.state.hasEntered}
                isSplashYes={this.isSplashYes}
                isSplashNo={this.isSplashNo}
                activePage={this.state.activePage}
                />}
                

        
          <div id='LiveBackDrop' className="LiveBackDrop" onMouseMove={this.handleMouseMove}  onClick={this.changePattern}>
            {/* <img src={backImg} alt="backing img" /> */}
            <P5Sketch canvasParentRef='LiveBackDrop'/>   
          </div>   

          <Route exact path="/">
            <Splash splash={splash} 
                    hasEntered={this.state.hasEntered} 
                    isSplashNo={this.isSplashNo} 
                    isSplashYes={this.isSplashYes} 
                    changeBlur={this.changeBlur}
                    />
          </Route> 
          <Route path="/about">
            <About enterChange={this.enterChange.bind(this)} 
                    isSplashNo={this.isSplashNo} 
                    hasEntered={this.state.hasEntered} 
                    isSplashYes={this.isSplashYes}
                    changeActivePage={this.changeActivePage.bind(this)}
                    />
          </Route> 
          <Route path="/portfolio">
            <Portfolio enterChange={this.enterChange.bind(this)} 
                    isSplashNo={this.isSplashNo} 
                    hasEntered={this.state.hasEntered} 
                    isSplashYes={this.isSplashYes}
                    changeActivePage={this.changeActivePage.bind(this)}
                    />
          </Route> 
          <Route path="/contact">
            <Contact enterChange={this.enterChange.bind(this)} 
                      hasEntered={this.state.hasEntered} 
                      isSplashNo={this.isSplashNo} 
                      isSplashYes={this.isSplashYes}
                      changeActivePage={this.changeActivePage.bind(this)}
                      />
          </Route> 
        </Router>
      </div>
    );
  }
}

export default App;
