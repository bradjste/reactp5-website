import React, { Component } from 'react';
import ImgSwiper from '../ImgSwiper';
import MusicPlayer from 'react-responsive-music-player'
import playlist from '../../playlist';
import CellAuto from '../p5Portfolio/CellAuto';
import NoisePaint from '../p5Portfolio/NoisePaint';
import Harmony from '../p5Portfolio/Harmony';
import caret from '../../img/caret.png'
import vansGif from '../../img/vans.gif'
import p50 from '../../img/p5Sticker1.svg'
import p51 from '../../img/p5Sticker2.png'
import p52 from '../../img/p5Sticker3.png'
import p53 from '../../img/p5Sticker4.png'
import p54 from '../../img/p5Sticker5.png'
import splunkGif from '../../img/splunk.gif'
import ProjectItem from '../ProjectItem'
import {Button,ButtonGroup,DropdownButton,Dropdown}  from 'react-bootstrap';

let p5Pix = [];

class Portfolio extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currSubject: "Interactive_port",
            photo: 0
        }
        this.changePortf = this.changePortf.bind(this);
        this.props.isSplashNo()
        this.props.changeActivePage("portfolio")
        this.changeProjPhoto = this.changeProjPhoto.bind(this);
        setInterval(this.changeProjPhoto,1800);
        p5Pix[0] = p50;
        p5Pix[1] = p51;
        p5Pix[2] = p52;
        p5Pix[3] = p53;
        p5Pix[4] = p54;
    }

    componentDidMount() {
        if (!this.props.hasEntered) {
            document.getElementById('portfolioPage').classList.add('enter-off')
            setTimeout(this.fadeInDelay,200)
            setTimeout(this.props.enterChange,300);
        }   
        document.getElementById(this.state.currSubject).classList.add('portBtnActive')
    }

    changeProjPhoto = () => {
        this.setState(prevState => {
            return {           
                photo: (prevState.photo += 1) % 5
            }
        });
        console.log(this.state.photo)
    }

    fadeInDelay() {
        document.getElementById('portfolioPage').classList.remove('enter-off')
        document.getElementById('portfolioPage').classList.add('fade-in')
    }

    changePortf = portPage => {
        let page = "";
        console.log(portPage)
        if (portPage === 0) {
            page = "Generative Art_port"
        } else if (portPage === 1) {
            page = "Projects_port"
        }
        else if (portPage === 2) {
            page = "Music_port"
        }
        else if (portPage === 3) {
            page = "Interactive_port"
        }
        this.setState((prevState) => {
            document.getElementById(prevState.currSubject).classList.remove('portBtnActive')
            document.getElementById(page).classList.add('portBtnActive')
            return(
                {currSubject: page}
            )
        })
    }

    setup = (p5,canvasParentRef) => {
        let canvas = p5.createCanvas(p5.windowWidth,p5.windowHeight)
        canvas.parent(canvasParentRef);
        p5.colorMode(p5.HSB,360,100,100,100)
        p5.noStroke();
    }
    
    draw = p5 => {
        p5.background(0,0,0,0)
        p5.fill(20,100,100)
        p5.textSize(30)
        p5.text('HI THERE',p5.windowWidth*0.6, p5.windowWidth*0.5)
    }

    

    render() {
        return (
            <div id='portfolioPage'>
                <div className="portfolio">

                    <DropdownButton id="mobile-port-dropdown" title={<div id = 'dd-title'>
                            {this.state.currSubject.split("_")[0].toLowerCase()}
                            <img src={caret} alt='dropdown caret'/>
                        </div>}>
                        {this.state.currSubject !== 'Interactive_port' && <Dropdown.Item onClick={() => {this.changePortf(3)}} className='mob-port-subject'>interactive</Dropdown.Item>}
                        {this.state.currSubject !== 'Generative Art_port' &&<Dropdown.Item onClick={() => {this.changePortf(0)}} className='mob-port-subject'>generative art</Dropdown.Item>}
                        {this.state.currSubject !== 'Projects_port' &&<Dropdown.Item onClick={() => {this.changePortf(1)}} className='mob-port-subject'>projects</Dropdown.Item>}
                        {this.state.currSubject !== 'Music_port' &&<Dropdown.Item onClick={() => {this.changePortf(2)}} className='mob-port-subject'>music</Dropdown.Item>}
                    </DropdownButton>
                    <ButtonGroup className='bg' aria-label='Portfolio subject selector'>
                        <Button id="Interactive_port" className='portBtn' onClick={() => {this.changePortf(3)}}>interactive</Button>
                        <div className='portSubDivider'/>
                        <Button id="Generative Art_port" className='portBtn' onClick={() => {this.changePortf(0)}}>generative art</Button>
                        <div className='portSubDivider'/>
                        <Button id="Projects_port" className='portBtn' onClick={() => {this.changePortf(1)}}>projects</Button>
                        <div className='portSubDivider'/>
                        <Button id="Music_port" className='portBtn' onClick={() => {this.changePortf(2)}}>music</Button>
                    </ButtonGroup>
                    <div className="portMenuDivSep"/>
                    <div className="portContent" id='portContentId'>
                        {this.state.currSubject === "Interactive_port" && <div>
                            <h2 className="subtopic">Engage with the Future</h2>
                            <div id='interact'>
                                <NoisePaint />
                                <CellAuto />
                                <Harmony />
                            </div>
                        </div>}  
                        {this.state.currSubject === "Generative Art_port" && <div className='swiper'>
                            <h2 className="subtopic">Algorithms Into Art</h2>
                            <ImgSwiper className='swiper'/>                          
                        </div>}
                        {this.state.currSubject === "Projects_port" && <div>
                            {document.getElementById('portContentId').classList.remove('no-scroll')}
                            <h2 className="subtopic">Art + Tech</h2>
                            <div id='projItemsDiv'>
                                <ProjectItem img={splunkGif} title="Splunk Plays Blackjack" link="https://github.com/bradjste/Splunk_Plays_Blackjack"/>
                                <ProjectItem img={p5Pix[this.state.photo]} title="p5.js Sticker Designs" link="https://p5js.org"/>
                                <ProjectItem img={vansGif} title="Jen Stark + Vans Shoes" link="https://www.youtube.com/watch?v=Mi1jzYIzVt4"/>
                            </div>
                            
                        </div>}

                        {this.state.currSubject === "Music_port" && <div className='musicPort'>
                            <div>
                                <h2 className="subtopic">Hexer Quiz</h2>
                                <MusicPlayer className="player" playlist={playlist} btnColor="#F89272"/>
                            </div>
                            <br/>
                            <br/>
                            <div>
                                <h2 className="subtopic4">Bandcamp: <a href="https://hexerquiz.bandcamp.com/" rel='noreferrer noopener' target="_blank" className='conLink'>hexerquiz.bandcamp.com</a></h2>
                                <h2 className="subtopic4">SoundCloud: <a href="https://soundcloud.com/bradjste" rel='noreferrer noopener' target="_blank" className='conLink'>soundcloud.com/bradjste</a></h2>
                            </div>
                        </div>}

                                          
                    </div>
                </div>
                
            </div>

        )
    }
}

export default Portfolio