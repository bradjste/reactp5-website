import React, { Component } from "react"
import activeIcon from "../img/menuActive.png"
import inactiveIcon from "../img/menuInactive.png"
import DDItem from "./DDItem"


class MobileMenu extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            menuOpen: false
        }
        this.openMenu = this.openMenu.bind(this)
        
    }

    componentDidMount() {
        document.getElementById("activeIcon").style.display = "none"

    }

    openMenu(e) {    
        this.setState(
            (prevState) => ({
              menuOpen: !prevState.menuOpen
            })
          )
          if(!this.state.menuOpen) {
            document.getElementById("activeIcon").style.display = "inline-flex"
          } else {
            document.getElementById("activeIcon").style.display = "none"
          }
    }

    render() {
        return (
            <div id="mobMenuId" className="mobMenu">
                <div id="menuIcon" className="mobMenuIcon">
                    <img src={inactiveIcon} 
                         alt="menu icon"
                         onClick={this.openMenu}
                         />
                   
                    <img id="activeIcon"
                         src={activeIcon} 
                         alt="menu icon"
                         onClick={this.openMenu}
                         />
                    {!this.state.menuOpen &&<p className='displayPageMob'>{this.props.activePage}</p>}
                </div>
                
                {this.state.menuOpen && 
                    <div id="dropdownMobile" className="dropdownMobile">
                        <DDItem openMenu={this.openMenu} item="about"/>
                        <DDItem openMenu={this.openMenu} item="portfolio"/>
                        <DDItem openMenu={this.openMenu} item="contact"/>
                    </div>
                }
            </div>
        )
    }

}

export default MobileMenu