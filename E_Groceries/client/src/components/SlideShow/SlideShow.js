import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import img1 from '../../assets/homeImg1.jpg';
import img2 from '../../assets/homeImg2.jpg';
import img3 from '../../assets/homeImg3.jpg';
import './slideShow.css';
import { useNavigate } from 'react-router-dom';


const SlideShow = () => {
  const statement = "WE'LL DELIVER EVERYTHING YOU NEED";

  // array of image URLs
  const images = [
   img1, img2, img3
  ];

  // settings for the slideshow
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    beforeChange: (current, next) => setSlideIndex(next)
  };

  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((slideIndex + 1) % images.length);
    }, settings.autoplaySpeed);
    return () => clearInterval(interval);
  }, [slideIndex, settings.autoplaySpeed, images.length]);


  const navigate = useNavigate()
  const handleShopClick = () =>{
    navigate('/shop')
  }
  return (
    <div className="slideshow-container" style={{marginTop:"100px"}}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <div className="slide-img-container">
              <img src={image} alt={`Slide ${index}`} className='imgHome'/>
              <div className="slide-text-container">
                <p className="slide-textH">FRESHCO PANTRY!</p>
                <p className="slide-text">{statement}</p>
                <button className="btn1 btn-color-21" onClick={handleShopClick}>Shop</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SlideShow;
