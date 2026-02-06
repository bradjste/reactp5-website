import React from 'react'
import { NavLink } from 'react-router-dom'

export default function NavItem({ item, tolink }) {
    return (
        <li id={item}>
            <NavLink to={tolink}>{item}</NavLink>
        </li>
    )
}
