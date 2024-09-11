import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

export default function Banner() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all sliders from the API on component mount
  useEffect(() => {
    async function fetchSliders() {
      try {
        const response = await fetch('/api/banner');
        const data = await response.json();
        if (Array.isArray(data)) {
          setSliders(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSliders();

    // Initialize AOS for animations
    AOS.init({
      duration: 1000, // Animation duration in ms
      once: false, // Animation only happens once
    });
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  if (sliders.length === 0) {
    return <div>No sliders available.</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div>
      <Slider {...settings}>
        {sliders.map((slider, index) => (
          <div
            key={index}
            className="carousel-item"
            style={{
              position: 'relative',
              height: '600px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '600px',
                backgroundImage: `url(${slider.img})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                zIndex: 0,
                filter: 'brightness(60%)',
              }}
            ></div>

            <div
              className="carousel-caption d-flex flex-column justify-content-center align-items-start max-w-7xl mx-auto"
              style={{
                position: 'relative',
                zIndex: 1,
                height: '100%',
                padding: '0 15px',
              }}
            >
              {/* Heading with AOS fade-up effect */}
              <h1
                data-aos="fade-up"
                style={{
                  fontSize: '3rem',
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
                  marginBottom: '1rem',
                }}
              >
                {slider.heading}
              </h1>
              
              {/* Subheading with AOS fade-up effect */}
              <p
                data-aos="fade-up"
                style={{
                  fontSize: '1.2rem',
                  color: 'white',
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
                  marginBottom: '1.5rem',
                }}
              >
                {slider.subHeading}
              </p>
              
              <div className="mt-3">
                {/* Conditionally render button if buttonLink and buttonText are available */}
                {slider.buttonLink && slider.buttonText && (
                  <Link href={slider.buttonLink} passHref>
                    <button
                      className="btn btn-primary px-4 py-2"
                      style={{
                        fontSize: '1rem',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                      }}
                    >
                      {slider.buttonText}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <style jsx>{`
        .carousel-item,
        .slick-slide {
          height: 600px !important;
        }
      `}</style>
    </div>
  );
}