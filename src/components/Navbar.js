import React, { Component } from 'react';
import NavItem from './NavItem';
import {Link} from 'react-router-dom';
import MobileMenu from './MobileMenu'
import splashCard from '../img/bjsLogo2.png'

class Navbar extends Component {

    componentDidMount() {

        if (!this.props.hasEntered){
            this.fadeInById('navId')
        }
        document.getElementById(this.props.activePage).classList.add('active');
    }


    fadeInById(id) {
        document.getElementById(id).classList.add('fade-in')
    }
    
    componentDidUpdate() {
        document.getElementById(this.props.activePage).classList.add('active');
    }

    getSnapshotBeforeUpdate(prevProps) {
        document.getElementById(prevProps.activePage).classList.remove('active');
        return null;
    }

    render() {
        return (
            <div >               
                <nav id='navId' className='nav'>
                    
                    <div className="splashCardCorner"> 
                        <Link to="/"  onClick={this.props.isSplashYes}>
                            <img src={splashCard}  alt="title card of site" />
                        </Link>
                    </div>
                

                    <ul>
                        <NavItem item="about" tolink="/about"></NavItem>
                        <NavItem item="portfolio" tolink="/portfolio"></NavItem>
                        {/* <NavItem item="art" tolink="/art"></NavItem> */}
                        {/* <NavItem item="music" tolink="/music"></NavItem> */}
                        <NavItem item="contact" tolink="/contact" ></NavItem>
                    </ul>

                    <MobileMenu activePage={this.props.activePage}/>
                </nav>
            </div>
        )
    }
}
export default Navbar