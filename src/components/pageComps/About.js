import React, { Component } from 'react';
import gif0 from "../../img/gif0.gif"
import gif1 from "../../img/gif1.gif"
let gifList = [gif0,gif1]

class About extends Component {

    constructor(props) {
        super(props)
        this.props.isSplashNo()
        this.props.changeActivePage("about")
        this.state = {gifNum: 0}
        setInterval(this.changeGif.bind(this),5000)
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
                <div className="about">
                    <div className="aboutText">
                        <h1 className="subtopic">Hello, world!</h1>
                        <h2 className="subtopic3">I am a <strong>creative technologist</strong> 
                                       ; an experience designer and generative artist armed with the power of computation and electronics.</h2>
                        <h2 className="subtopic3">
                            I received my Bachelor of Arts from UC San Diego in <a rel='noreferrer noopener' className="conLink" href="https://music-cms.ucsd.edu/ugrad/icam-major.html" target="_blank">Interdisciplinary Computing & the Arts Major - Music Technology (ICAM) </a>
                              in 2017.
                            Here I learned to synthesize principles of music, computer science, fine art, electrical engineering, and interface design to create new tools of expression and experience for humans in the digital age.
                            <br />
                            <br />
                            I am currently employed as a full-stack software engineer, honing my craft as an effective and resourseful programmatic problem-solver. 
                            <br />
                            <br />
                            I code in languages such as Java, JavaScript, SQL, and Python to achieve sustainable and scalable solutions to complex technical problems. 
                            <br />
                            <br />
                            I created this website using primarily the <a rel='noreferrer noopener' className="conLink" href="https://reactjs.org" target="_blank">React.js </a>
                             and <a rel='noreferrer noopener' className="conLink" href="https://p5js.org" target="_blank">p5.js </a> libraries.
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
            </div>
            
        )
    }
}

export default About