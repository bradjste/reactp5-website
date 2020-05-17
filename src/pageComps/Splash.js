import React, { Component } from 'react';
import {Link} from 'react-router-dom';


class Splash extends Component {

    componentDidMount() {
      this.fadeInById('splashCard')
      if(!this.props.hasEntered) {
        document.getElementById('enterLink').classList.add('enter-off')
        setTimeout(this.fadeInEnter,1100)
        setTimeout(this.props.enterChange,300);
      }
    }

    fadeInById(id) {
      document.getElementById(id).classList.add('fade-in')
    }

    fadeInEnter() {      
        document.getElementById('enterLink').classList.remove('enter-off')
        document.getElementById('enterLink').classList.add('fade-in')
    }

    render() {
        let pageLink = "/" + (this.props.activePage === "" ? this.props.activePage : "about")
        return (
          <div id = 'UI' className="UI">
            <Link id='enterLink' to={pageLink} >
              <button className='enter' onClick={this.props.isSplashNo}>ENTER</button>
            </Link>
            
            <div id='splashCardDiv' className="splashCard"> 
              {this.props.splash}
            </div>
          </div>
        )
    }
}

export default Splash