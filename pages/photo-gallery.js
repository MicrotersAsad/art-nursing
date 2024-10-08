import React, { useState } from 'react';
import Modal from 'react-modal'; // Modal for image preview
import Zoom from 'react-medium-image-zoom'; // Zoom for image
import 'react-medium-image-zoom/dist/styles.css'; // Zoom CSS
import Image from 'next/image';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader for loading animation

Modal.setAppElement('#__next'); // Setting up the root for the modal

const PhotoGallery = ({ photos }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Open modal to show image
  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl text-center p-8 font-bold">Art Nursing Gallery</h2>

      {photos.length === 0 ? (
        <div className="flex justify-center items-center min-h-screen">
          <ClipLoader color={'#123abc'} loading={true} size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="photo-item cursor-pointer" onClick={() => openModal(photo.img)}>
              <Image
                src={photo.img}
                alt={`Photo ${index}`}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal to display the clicked image */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
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
            maxHeight: '90vh',
            padding: 0,
            overflow: 'hidden',
          },
        }}
      >
        {selectedImage && (
          <div className="modal-content">
            <Zoom>
              <Image
                src={selectedImage}
                alt="Selected"
                width={1000}
                height={700}
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </Zoom>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export async function getServerSideProps(context) {
  const protocol = context.req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const host = context.req.headers.host;

  try {
    const res = await fetch(`${protocol}://${host}/api/photo-gallery`);
    const photos = await res.json();

    return {
      props: {
        photos: photos || [], // Passing the photos as props
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        photos: [], // Fallback to empty array in case of error
      },
    };
  }
}

export default PhotoGallery;
