import React from 'react';
import Swiper from 'react-id-swiper';
import img1 from './img/art0.jpg'
import img2 from './img/art1.jpg'
import img3 from './img/art2.jpg'
import img4 from './img/art3.jpg'
import img5 from './img/art4.jpg'

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
        pagination: {
          el: '.swiper-pagination',
          type: 'progressbar',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      }
    

    return (
      <Swiper {...params}>
        <div className="slideImg">
            <img src={img1} alt="Slide #1" />
        </div>
        <div className="slideImg">
            <img src={img2} alt="Slide #2" />
        </div>
        <div className="slideImg">
            <img src={img3} alt="Slide #3" />
        </div>
        <div className="slideImg">
            <img src={img4} alt="Slide #4" />
        </div>
        <div className="slideImg">
            <img src={img5} alt="Slide #5" />
        </div>

      </Swiper>
    )
  };

  export default ImgSwiper;