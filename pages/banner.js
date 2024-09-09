import React, { useEffect, useState } from 'react';
import Slider from 'react-slick'; // Import Slider from react-slick
import Link from 'next/link';
import 'slick-carousel/slick/slick.css'; // slick slider CSS
import 'slick-carousel/slick/slick-theme.css'; // slick slider theme


export default function Banner() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all sliders from the API on component mount
  useEffect(() => {
    async function fetchSliders() {
      try {
        const response = await fetch('/api/banner'); // Make sure the API endpoint is correct
        const data = await response.json();
        if (Array.isArray(data)) {
          setSliders(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Error fetching sliders:', error);
      } finally {
        setLoading(false); // Finish loading once the data has been fetched
      }
    }
    fetchSliders();
  }, []);

  if (loading) {
    return <div>Loading sliders...</div>; // Show a loading message while fetching data
  }

  if (sliders.length === 0) {
    return <div>No sliders available.</div>; // Show fallback if no sliders are present
  }

  // Slider settings for react-slick
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
              height: '600px', // Ensure fixed height for the slider
              overflow: 'hidden', // Prevents overflow of elements
            }}
          >
            {/* Image with shadow overlay and custom styles */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '600px', // Fixed height
                backgroundImage: `url(${slider.img})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center', // Center the background image
                zIndex: 0,
                filter: 'brightness(60%)', // Darken the image for contrast
              }}
            ></div>

            {/* Text and buttons with responsive styling */}
            <div
              className="carousel-caption d-flex flex-column justify-content-center align-items-start max-w-7xl mx-auto"
              style={{
                position: 'relative',
                zIndex: 1,
                height: '100%',
                padding: '0 15px', // Padding for small devices
              }}
            >
              <h1
                style={{
                  fontSize: '3rem',
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)', // Adds shadow to text
                  marginBottom: '1rem',
                }}
              >
                {slider.heading}
              </h1>
              <p
                style={{
                  fontSize: '1.2rem',
                  color: 'white',
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)', // Adds shadow to text
                  marginBottom: '1.5rem',
                }}
              >
                {slider.subHeading}
              </p>
              <div className="d-flex gap-2 mt-3">
                <Link href={slider.buttonLink} passHref>
                  <p
                    className="btn btn-primary px-4 py-2"
                    style={{
                      fontSize: '1rem',
                      backgroundColor: '#007bff', // Customize button color
                      color: '#fff', // White text color
                      borderRadius: '4px', // Rounded corners
                      padding: '10px 20px', // Padding for button
                      cursor: 'pointer', // Pointer on hover
                    }}
                  >
                    {slider.buttonText || 'FOR WINDOWS'}
                  </p>
                </Link>
                
              </div>
            </div>
          </div>
        ))}
      </Slider>
      <style jsx>{`
         .carousel-item,
.slick-slide {
  height: 600px !important; /* Ensure the height is applied */
}

      `}</style>

    </div>
  );
}
