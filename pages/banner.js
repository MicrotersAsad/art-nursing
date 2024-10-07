import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Link from 'next/link';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

const Banner = () => {
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
      <div className="flex items-center justify-center h-full">
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
          <div key={index} className="relative overflow-hidden h-[600px]">
            <div
              className="absolute inset-0 bg-cover bg-center z-0 brightness-[60%]"
              style={{
                backgroundImage: `url(${slider.img})`,
              }}
            ></div>

            <div className="relative z-10 flex flex-col justify-center max-w-7xl mx-auto h-full px-4">
              {/* Heading with AOS fade-up effect */}
              <h1
                data-aos="fade-up"
                className="text-3xl md:text-5xl text-white font-bold mb-4 shadow-md"
              >
                {slider.heading}
              </h1>

              {/* Subheading with AOS fade-up effect */}
              <p
                data-aos="fade-up"
                className="text-lg md:text-xl text-white mb-6 shadow-md"
              >
                {slider.subHeading}
              </p>

              {/* Conditionally render button if buttonLink and buttonText are available */}
              {slider.buttonLink && slider.buttonText && (
                <Link href={slider.buttonLink} passHref>
                  <button className="bg-blue-600 text-white rounded px-5 py-3 hover:bg-blue-700 transition duration-300 ease-in-out">
                    {slider.buttonText}
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </Slider>

      <style jsx>{`
        .slick-slide {
          height: 607px !important;
        }
      `}</style>
    </div>
  );
};

export default Banner;
