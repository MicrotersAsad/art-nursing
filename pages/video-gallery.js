import React, { useState } from 'react';
import Modal from 'react-modal'; // Modal for image preview
import ClipLoader from 'react-spinners/ClipLoader'; // ClipLoader for loading spinner
import 'react-medium-image-zoom/dist/styles.css'; // Zoom CSS

Modal.setAppElement('#__next'); // Setting up the root for the modal

const VideoGallery = ({ videos }) => {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color={'#123abc'} loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white py-12 px-4 md:px-10">
      <h2 className="text-3xl text-center p-8 font-bold">Art Nursing Video Gallery</h2>
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

export async function getServerSideProps(context) {
  const protocol = context.req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  const host = context.req.headers.host;

  try {
    const res = await fetch(`${protocol}://${host}/api/video-gallery`);
    const videos = await res.json();

    return {
      props: {
        videos: videos || [], // Passing the videos as props
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        videos: [], // Fallback to empty array in case of error
      },
    };
  }
}

export default VideoGallery;
