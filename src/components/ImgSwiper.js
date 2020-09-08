import React from 'react';
import Swiper from 'react-id-swiper';
import img1 from '../img/art0.jpg'
import img2 from '../img/art1.jpg'
import img3 from '../img/art2.jpg'
import img4 from '../img/art3.jpg'
import img5 from '../img/art4.jpg'
import img6 from '../img/cagan.png'
import gif1 from '../img/noiseStuff.gif'
import gif2 from '../img/gg.gif'
import gif5 from '../img/kube.gif'



const ImgSwiper = () => {
    const params = {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: false
      },
        spaceBetween: 30,
        slidesPerView: 3,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      }
    
    return (
      <Swiper {...params}>
        <div className="slideImg">
            <img src={gif1} alt="Slide #1" />
        </div>
        <div className="slideImg">
            <img src={gif2} alt="Slide #2" />
        </div>
        <div className="slideImg">
            <img src={gif5} alt="Slide #3" />
        </div>
        <div className="slideImg">
            <img src={img6} alt="Slide #4" />
        </div>
        <div className="slideImg">
            <img src={img1} alt="Slide #4" />
        </div>
        <div className="slideImg">
            <img src={img2} alt="Slide #5" />
        </div>
        <div className="slideImg">
            <img src={img3} alt="Slide #6" />
        </div>
        <div className="slideImg">
            <img src={img4} alt="Slide #7" />
        </div>
        <div className="slideImg">
            <img src={img5} alt="Slide #8" />
        </div>

      </Swiper>
    )
  };


  export default ImgSwiper;