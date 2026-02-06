import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, DropdownButton, Dropdown } from 'react-bootstrap'
import ImgSwiper from '../ImgSwiper'
import SimpleAudioPlayer from '../SimpleAudioPlayer'
import playlist from '../../playlist'
import CellAuto from '../p5Portfolio/CellAuto'
import NoisePaint from '../p5Portfolio/NoisePaint'
import Harmony from '../p5Portfolio/Harmony'
import ProjectItem from '../ProjectItem'
import { usePageSetup } from '../../hooks/usePageSetup'
import caret from '../../img/caret.png'
import vansGif from '../../img/vans.gif'
import p50 from '../../img/p5Sticker1.svg'
import p51 from '../../img/p5Sticker2.png'
import p52 from '../../img/p5Sticker3.png'
import p53 from '../../img/p5Sticker4.png'
import p54 from '../../img/p5Sticker5.png'
import splunkGif from '../../img/splunk.gif'


const p5Pix = [p50, p51, p52, p53, p54]

export default function Portfolio({
    isSplashNo,
    changeActivePage,
    hasEntered,
    enterChange,
}) {
    const [currSubject, setCurrSubject] = useState('Interactive_port')
    const [photo, setPhoto] = useState(0)

    usePageSetup('portfolioPage', 'portfolio', isSplashNo, changeActivePage, hasEntered, enterChange)

    const handleChangePortf = (portPage) => {
        const pages = [
            'Generative Art_port',
            'Projects_port',
            'Music_port',
            'Interactive_port',
        ]
        const oldEl = document.getElementById(currSubject)
        const newPage = pages[portPage]

        if (oldEl) {
            oldEl.classList.remove('portBtnActive')
        }
        const newEl = document.getElementById(newPage)
        if (newEl) {
            newEl.classList.add('portBtnActive')
        }

        setCurrSubject(newPage)
    }

    return (
        <div id="portfolioPage">
            <div className="portfolio">
                <DropdownButton
                    id="mobile-port-dropdown"
                    title={
                        <div id="dd-title">
                            {currSubject.split('_')[0].toLowerCase()}
                            <img src={caret} alt="dropdown caret" />
                        </div>
                    }
                >
                    {currSubject !== 'Interactive_port' && (
                        <Dropdown.Item onClick={() => handleChangePortf(3)} className="mob-port-subject">
                            interactive
                        </Dropdown.Item>
                    )}
                    {currSubject !== 'Generative Art_port' && (
                        <Dropdown.Item onClick={() => handleChangePortf(0)} className="mob-port-subject">
                            generative art
                        </Dropdown.Item>
                    )}
                    {currSubject !== 'Projects_port' && (
                        <Dropdown.Item onClick={() => handleChangePortf(1)} className="mob-port-subject">
                            projects
                        </Dropdown.Item>
                    )}
                    {currSubject !== 'Music_port' && (
                        <Dropdown.Item onClick={() => handleChangePortf(2)} className="mob-port-subject">
                            music
                        </Dropdown.Item>
                    )}
                </DropdownButton>

                <ButtonGroup className="bg" aria-label="Portfolio subject selector">
                    <Button id="Interactive_port" className="portBtn" onClick={() => handleChangePortf(3)}>
                        interactive
                    </Button>
                    <div className="portSubDivider" />
                    <Button id="Generative Art_port" className="portBtn" onClick={() => handleChangePortf(0)}>
                        generative art
                    </Button>
                    <div className="portSubDivider" />
                    <Button id="Projects_port" className="portBtn" onClick={() => handleChangePortf(1)}>
                        projects
                    </Button>
                    <div className="portSubDivider" />
                    <Button id="Music_port" className="portBtn" onClick={() => handleChangePortf(2)}>
                        music
                    </Button>
                </ButtonGroup>

                <div className="portMenuDivSep" />

                <div className="portContent" id="portContentId">
                    {currSubject === 'Interactive_port' && (
                        <div>
                            <h2 className="subtopic">Engage with the Future</h2>
                            <div id="interact">
                                <NoisePaint />
                                <CellAuto />
                                <Harmony />
                            </div>
                        </div>
                    )}

                    {currSubject === 'Generative Art_port' && (
                        <div className="swiper">
                            <h2 className="subtopic">Algorithms Into Art</h2>
                            <ImgSwiper />
                        </div>
                    )}

                    {currSubject === 'Projects_port' && (
                        <div>
                            <h2 className="subtopic">Art + Tech</h2>
                            <div id="projItemsDiv">
                                <ProjectItem
                                    img={splunkGif}
                                    title="Splunk Plays Blackjack"
                                    link="https://github.com/bradjste/Splunk_Plays_Blackjack"
                                />
                                <ProjectItem
                                    img={p5Pix[photo]}
                                    title="p5.js Sticker Designs"
                                    link="https://p5js.org"
                                />
                                <ProjectItem
                                    img={vansGif}
                                    title="Jen Stark + Vans Shoes"
                                    link="https://www.youtube.com/watch?v=Mi1jzYIzVt4"
                                />
                            </div>
                        </div>
                    )}

                    {currSubject === 'Music_port' && (
                        <div className="musicPort">
                            <div>
                                <h2 className="subtopic">Hexer Quiz</h2>
                                <SimpleAudioPlayer className="player" playlist={playlist} />
                            </div>
                            <br />
                            <br />
                            <div>
                                <h2 className="subtopic4">
                                    Bandcamp:{' '}
                                    <a
                                        href="https://hexerquiz.bandcamp.com/"
                                        rel="noreferrer noopener"
                                        target="_blank"
                                        className="conLink"
                                    >
                                        hexerquiz.bandcamp.com
                                    </a>
                                </h2>
                                <h2 className="subtopic4">
                                    SoundCloud:{' '}
                                    <a
                                        href="https://soundcloud.com/bradjste"
                                        rel="noreferrer noopener"
                                        target="_blank"
                                        className="conLink"
                                    >
                                        soundcloud.com/bradjste
                                    </a>
                                </h2>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
