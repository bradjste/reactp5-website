import React, { Component } from 'react';
import ImgSwiper from '../ImgSwiper';

class Art extends Component {

    componentWillMount() {
        this.props.isSplashNo()
        this.props.changeActivePage("art")
    }

    componentDidMount() {
        console.log(this.props.enterChange)
        if (!this.props.hasEntered) {
            document.getElementById('artPage').classList.add('enter-off')
            setTimeout(this.fadeInDelay,200)
            setTimeout(this.props.enterChange,300);
        }   
    }

    fadeInDelay() {
        document.getElementById('artPage').classList.remove('enter-off')
        document.getElementById('artPage').classList.add('fade-in')
    }

    render() {
        return (
            <div id='artPage'>
                <div className="backing" />
                <div className="art">
                    <h2 className="subtopic">Generative Art - Algorithms and Accidents</h2>
                    <ImgSwiper className='swiper'/>
                </div>
            </div>

        )
    }
}

export default Art