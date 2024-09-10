import React, { useEffect, useState } from 'react';
import Modal from 'react-modal'; // Modal for image preview
import Zoom from 'react-medium-image-zoom'; // Zoom for image
import 'react-medium-image-zoom/dist/styles.css'; // Zoom CSS
import Image from 'next/image';

Modal.setAppElement('#__next'); // Setting up the root for the modal

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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

  // Open modal to show image
  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="max-w-7xl mx-auto bg-white">
    <div className="photo-gallery grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
      {photos.map((photo, index) => (
        <div key={index} className="photo-item">
          <Zoom>
            <Image
              src={photo.img} // Ensure this is the correct path to your photo
              alt={photo.alt || 'Photo'}
              className="w-[400px] h-[300px] object-cover cursor-pointer" // Fixed width and height
              width={400}
              height={400}
              onClick={() => openModal(photo.img)}
            />
          </Zoom>
        </div>
      ))}

      {/* Modal for viewing images */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <button onClick={closeModal} className="close-button">Close</button>
        {selectedImage && (
          <div className="modal-content">
            <Zoom>
              <Image
                src={selectedImage}
                alt="Selected"
                layout="fill"
                objectFit="contain"
              />
            </Zoom>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .modal {
          max-width: 90%;
          max-height: 90%;
          margin: auto;
          position: relative;
        }
        .overlay {
          background: rgba(0, 0, 0, 0.8);
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #fff;
          border: none;
          padding: 10px;
          cursor: pointer;
        }
      `}</style>
    </div>
    </div>
  );
};

export default PhotoGallery;
