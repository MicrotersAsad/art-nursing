import React, { useEffect, useState } from 'react';
import Layout from './layout';

const Photogallery = () => {
  const [formData, setFormData] = useState({ videoUrl: '' });
  const [videos, setVideos] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch all videos on component mount
  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await fetch('/api/video-gallery');
        const data = await response.json();

        if (Array.isArray(data)) {
          setVideos(data); // Ensure it's an array before setting it in state
        } else {
          setVideos([]); // Default to an empty array if data is not an array
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        setVideos([]); // Handle the case of a failed API call
      } finally {
        setLoading(false); // Loading is done
      }
    }

    fetchVideos();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      videoUrl: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/video-gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newVideo = await response.json();
        setVideos((prevVideos) => [...prevVideos, newVideo.newVideo]); // Update state with new video
        setFormData({ videoUrl: '' }); // Clear input field
      } else {
        const error = await response.text();
        console.error('Failed to submit form:', error);
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/video-gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVideos((prevVideos) => prevVideos.filter((video) => video._id !== id));
      } else {
        const error = await response.text();
        console.error('Failed to delete video:', error);
        alert('Failed to delete video. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error deleting video. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Video Gallery</h1>

        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            placeholder="Enter YouTube video URL"
            value={formData.videoUrl}
            onChange={handleInputChange}
            className="border border-gray-300 p-2 rounded-lg w-full mb-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Video
          </button>
        </form>

        {loading ? (
          <p>Loading videos...</p>
        ) : (
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
                <button
                  onClick={() => handleDelete(video._id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

// Helper function to extract YouTube video ID from URL
const getYouTubeId = (url) => {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|v=)?([^"&?\/\s]{11})/);
  return match ? match[1] : '';
};

export default Photogallery;
