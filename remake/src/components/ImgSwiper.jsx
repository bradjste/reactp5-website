import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCoverflow, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'

import gif1 from '../img/noiseStuff.gif'
import gif2 from '../img/gg.gif'
import gif5 from '../img/kube.gif'
import img1 from '../img/art0.jpg'
import img2 from '../img/art1.jpg'
import img3 from '../img/art2.jpg'
import img4 from '../img/art3.jpg'
import img5 from '../img/art4.jpg'
import img6 from '../img/cagan.png'

export default function ImgSwiper() {
    const images = [
        { src: gif1, alt: 'Noise', key: 0 },
        { src: gif2, alt: 'Effect', key: 1 },
        { src: gif5, alt: 'Kube', key: 2 },
        { src: img6, alt: 'Cagan', key: 3 },
        { src: img1, alt: 'Art 1', key: 4 },
        { src: img2, alt: 'Art 2', key: 5 },
        { src: img3, alt: 'Art 3', key: 6 },
        { src: img4, alt: 'Art 4', key: 7 },
        { src: img5, alt: 'Art 5', key: 8 },
    ]

    return (
        <Swiper
            modules={[EffectCoverflow, Navigation]}
            effect="coverflow"
            grabCursor
            centeredSlides
            slidesPerView={3}
            spaceBetween={30}
            coverflowEffect={{
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
            }}
            navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }}
            className="swiper"
        >
            {images.map((img) => (
                <SwiperSlide key={img.key} className="slideImg">
                    <img src={img.src} alt={img.alt} />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}
