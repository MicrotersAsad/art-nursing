import React, { useEffect, useState } from 'react';
import Modal from 'react-modal'; // Modal for image preview
import Zoom from 'react-medium-image-zoom'; // Zoom for image
import 'react-medium-image-zoom/dist/styles.css'; // Zoom CSS
import Image from 'next/image';

Modal.setAppElement('#__next'); // Setting up the root for the modal

const PhotoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all photos from API
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch('/api/video-gallery'); // Make sure the API endpoint is correct
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);


  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="max-w-7xl mx-auto bg-white py-12 px-4 md:px-10">
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video._id} className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${getYouTubeId(video.videoUrl)}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
                
              </div>
            ))}
          </div>
    </div>
  );
};
// Helper function to extract YouTube video ID from URL
const getYouTubeId = (url) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|v=)?([^"&?\/\s]{11})/);
  return match ? match[1] : '';
};

export default PhotoGallery;
