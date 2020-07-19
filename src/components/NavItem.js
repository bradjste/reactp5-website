import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
class NavItem extends Component {
    render() {
        return (
            
            <li id={this.props.item} onClick={this.props.openMenu}>
                <NavLink to={this.props.tolink}>{this.props.item}</NavLink>
            </li>
            
        )
    }
}
export default NavItem