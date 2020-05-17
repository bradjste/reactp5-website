import React, { Component } from 'react';
import gif0 from "../img/gif0.gif"
import gif1 from "../img/gif1.gif"
let gifList = [gif0,gif1]

class About extends Component {

    constructor(props) {
        super(props)
        this.state = {gifNum: 0}
        setInterval(this.changeGif.bind(this),5000)
    }

    componentWillMount() {
        this.props.isSplashNo()
        this.props.changeActivePage("about")
    }

    changeGif() {
        this.setState((prevState) => {
            return ({
                gifNum: prevState.gifNum === gifList.length - 1 ? 0 : prevState.gifNum + 1
            })
        })
    }

    componentDidMount() {
        if (!this.props.hasEntered) {
            document.getElementById('aboutPage').classList.add('enter-off')
            setTimeout(this.fadeInDelay,200)
            setTimeout(this.props.enterChange,300);
        }   
    }

    fadeInDelay() {
        document.getElementById('aboutPage').classList.remove('enter-off')
        document.getElementById('aboutPage').classList.add('fade-in')
    }

    render() {
        return (
            <div id='aboutPage'>
                <div className="backingAbout" />
                <div className="about">
                    <div className="aboutText">
                        <h1 className="subtopic">Hello, world!</h1>
                        <h2 className="subtopic3">I am a <strong>creative technologist</strong> 
                                       ; an experience designer and generative artist armed with the power of computation and electronics.</h2>
                        <h2 className="subtopic3">
                            I received my Bachelor of Arts from UC San Diego in <a rel='noreferrer noopener' className="conLink" href="https://music-cms.ucsd.edu/ugrad/icam-major.html" target="_blank">Interdisciplinary Computing & the Arts Major - Music Technology (ICAM) </a>
                              in 2017.
                            Here I learned to synthesize principles of music, computer science, fine art, electrical engineering, and interface design to create new tools of expression and experience for humans in the digital age.
                        </h2>                
                        {/* <h2 className="subtopic3"><strong>I am a creative technologist; </strong> 
                        an interaction designer that integrates cutting-edge technology with modern design principles to create contemporary digital media and applications.</h2>
                        <h2 className="subtopic3"></h2>
                        <h2 className="subtopic3"><strong>I am a creative technologist; </strong> 
                        an interaction designer that integrates cutting-edge technology with modern design principles to create contemporary digital media and applications.</h2>
                        <h2 className="subtopic3"></h2> */}
                    </div>    
                </div>  
                <div className='aboutGif'>
                    <img src={gifList[this.state.gifNum]} alt="loop of generated art"></img>
                </div>
                <div className='aboutGif2'>
                    <img src={gifList[this.state.gifNum]} alt="loop of generated art"></img>
                </div>   
            </div>
            
        )
    }
}

export default About