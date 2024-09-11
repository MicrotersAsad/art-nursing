import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Modal from 'react-modal'; // Modal for image preview
import Zoom from 'react-medium-image-zoom'; // Zoom for image
import 'react-medium-image-zoom/dist/styles.css'; // Zoom CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

Modal.setAppElement('#__next'); // Setting up the root for the modal

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalIndex, setModalIndex] = useState(0); // Track index for modal slider

  // Fetch all photos from API
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch('/api/photo-gallery'); // Make sure the API endpoint is correct
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  // Slick Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // Open modal to show image and set index
  const openModal = (image, index) => {
    setSelectedImage(image);
    setModalIndex(index);
    setModalIsOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
  };

  // Modal slider settings
  const modalSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    initialSlide: modalIndex, // Start from clicked image
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setModalIndex(current), // Update index when slide changes
  };

  if (loading) {
    return <div>Loading gallery...</div>;
  }

  return (
    <div>
      {/* Main gallery slider */}
      <Slider {...settings}>
        {photos.map((photo, index) => (
          <div key={index} onClick={() => openModal(photo.img, index)}>
            <img
              src={photo.img}
              alt={`Photo ${index}`}
              style={{ width: '100%', height: '400px', objectFit: 'cover', cursor: 'pointer' }}
            />
          </div>
        ))}
      </Slider>

      {/* Modal to display the clicked image with slider */}
     
      <Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Image Modal"
  shouldCloseOnOverlayClick={false} // Prevent modal from closing on overlay click
  style={{
    overlay: { zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '90%',
      maxHeight: '90vh', // Use full height of viewport
      padding: 0, // Remove padding to fit content
      overflow: 'hidden', // Hide overflow
    }
  }}
>
  {photos.length > 0 && (
    <div>
      <Slider {...modalSettings}>
        {photos.map((photo, index) => (
          <div key={index}>
            <Zoom>
              <img
                src={photo.img}
                alt={`Modal Image ${index}`}
                style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain' }} // Ensure full height utilization
              />
            </Zoom>
          </div>
        ))}
      </Slider>

      {/* Close button */}
      <button
        onClick={closeModal}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'red',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          cursor: 'pointer',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  )}
</Modal>

    </div>
  );
}

export default PhotoGallery;