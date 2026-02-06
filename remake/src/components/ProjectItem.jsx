import React from 'react'

export default function ProjectItem({ img, title, link }) {
    return (
        <div>
            <p className="projTitle">{title}</p>
            <div className="portProjItem">
                <img
                    src={img}
                    alt={title}
                    onClick={() => window.open(link, '_blank')}
                />
            </div>
        </div>
    )
}
