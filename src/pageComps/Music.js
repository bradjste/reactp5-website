import React, { Component } from 'react';
import MusicPlayer from 'react-responsive-music-player'
import playlist from '../playlist';

class Music extends Component {

    componentWillMount() {
        this.props.isSplashNo()
        this.props.changeActivePage("music")
    }

    componentDidMount() {
        if (!this.props.hasEntered) {
          document.getElementById('musicPage').classList.add('enter-off')
          setTimeout(this.fadeInDelay,200)
          setTimeout(this.props.enterChange,300);
        }   
        
      }
    
      fadeInDelay() {
        document.getElementById('musicPage').classList.remove('enter-off')
        document.getElementById('musicPage').classList.add('fade-in')
      }

    render() {
        return (
            <div id="musicPage">
                <div className="backingMusic" />
                <div  className="music">
                    <h1 className="subtopic">Hexer Quiz</h1>
                    <MusicPlayer className="player" playlist={playlist} btnColor="#F89272"/>
                    <h2 className="subtopic4">Bandcamp: <a href="https://hexerquiz.bandcamp.com/" rel='noreferrer noopener' target="_blank" className='conLink'>hexerquiz.bandcamp.com</a></h2>
                    <h2 className="subtopic4">SoundCloud: <a href="https://soundcloud.com/bradjste" rel='noreferrer noopener' target="_blank" className='conLink'>soundcloud.com/bradjste</a></h2>
                </div>
            </div>

        )
    }
}

export default Music