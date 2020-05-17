import React, {Component} from 'react'
import { NavLink } from "react-router-dom";


class DDItem extends Component {

    render() {
        return (
            <NavLink to={"/"+this.props.item}>
                <div className="ddDiv"onClick={this.props.openMenu}>               
                    <li id={this.props.item} >
                        {this.props.item}
                    </li>
                </div>
             </NavLink>
           
        )
    }
}




export default DDItem