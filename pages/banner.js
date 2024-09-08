import Link from 'next/link';
import { useEffect, useState } from 'react';

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

  return (
    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {sliders.map((slider, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-current={index === 0 ? 'true' : 'false'}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <div className="carousel-inner">
        {sliders.map((slider, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
            style={{ position: 'relative', height: '100vh', minHeight: '400px' }} // Responsive height
          >
            {/* Image with shadow overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh', // Fill the full height of the container
                backgroundImage: `url(${slider.img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(60%)', // Darken the image for better contrast
              }}
            ></div>

            {/* Text and buttons with responsive styling */}
            <div
              className="carousel-caption d-flex flex-column justify-content-center align-items-start"
              style={{ position: 'relative', zIndex: 1, height: '100%', padding: '0 15px' }} // Center vertically and add padding for small devices
            >
              <h1
                style={{
                  fontSize: '3rem',
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
                }}
                className="mb-3"
              >
                {slider.heading}
              </h1>
              <p
                style={{
                  fontSize: '1.2rem',
                  color: 'white',
                  textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)',
                }}
                className="mb-4"
              >
                {slider.subHeading}
              </p>
              <div className="d-flex gap-2 mt-3">
                <Link
                  href={slider.buttonLink}
                  className="btn btn-primary px-4 py-2"
                  style={{ fontSize: '1rem' }}
                >
                  {slider.buttonText || 'FOR WINDOWS'}
                </Link>
                <Link
                  href={slider.buttonLink}
                  className="btn btn-secondary px-4 py-2"
                  style={{ fontSize: '1rem' }}
                >
                  FOR MAC
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}
