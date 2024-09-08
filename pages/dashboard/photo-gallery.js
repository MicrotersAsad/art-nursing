import React, { useEffect, useState } from 'react';
import Layout from './layout';

const Photogallery = () => {
  const [formData, setFormData] = useState({ img: null });
  const [img, setImg] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch all images on component mount
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch('/api/photo-gallery');
        const data = await response.json();

        if (Array.isArray(data)) {
          setImg(data); // Ensure it's an array before setting it in state
        } else {
          setImg([]); // Default to an empty array if data is not an array
        }
      } catch (error) {
        console.error('Failed to fetch images:', error);
        setImg([]); // Handle the case of a failed API call
      } finally {
        setLoading(false); // Loading is done
      }
    }

    fetchImages();
  }, []);

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      img: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    if (formData.img) {
      formDataObj.append('img', formData.img); // Only append image if a new one is uploaded
    }

    try {
      const response = await fetch('/api/photo-gallery', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        const newImg = await response.json();
        setImg((prevImg) => [...prevImg, newImg]); // Update state with new image
      } else {
        const error = await response.text();
        console.error('Failed to submit form:', error);
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/photo-gallery?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImg((prevImg) => prevImg.filter((image) => image._id !== id));
      } else {
        const error = await response.text();
        console.error('Failed to delete image:', error);
        alert('Failed to delete image. Please try again.');
      }
    } catch (error) {
      console.error('Error during image deletion:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Photo Gallery</h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-2 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Upload Image
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {img.map((image) => (
              <div key={image._id} className="relative">
                <img
                  src={image.img}
                  alt="Gallery"
                  className="w-full  object-cover rounded"
                />
                <button
                  onClick={() => handleDelete(image._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
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

export default Photogallery;
