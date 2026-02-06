import React from 'react'
import { NavLink } from 'react-router-dom'

export default function DDItem({ item, openMenu }) {
    return (
        <NavLink to={`/${item}`}>
            <div className="ddDiv" onClick={openMenu}>
                <li id={item}>{item}</li>
            </div>
        </NavLink>
    )
}
