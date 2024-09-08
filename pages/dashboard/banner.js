import { useState, useEffect } from 'react';
import Layout from './layout';
import Link from 'next/link';

export default function Dashboard() {
  const [formData, setFormData] = useState({
    img: null,
    heading: '',
    subHeading: '',
    buttonText: '',
    buttonLink: '',
  });

  const [sliders, setSliders] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true); // Add loading state
  const [editId, setEditId] = useState(null); // Add edit ID state to track editing
  const [existingImage, setExistingImage] = useState(''); // Track the existing image for editing

  // Fetch all sliders on component mount
  useEffect(() => {
    async function fetchSliders() {
      try {
        const response = await fetch('/api/banner');
        const data = await response.json();

        if (Array.isArray(data)) {
          setSliders(data); // Ensure it's an array before setting it in state
        } else {
          setSliders([]); // Default to an empty array if data is not an array
        }
      } catch (error) {
        setSliders([]); // Handle the case of a failed API call
      } finally {
        setLoading(false); // Loading is done
      }
    }

    fetchSliders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
    formDataObj.append('heading', formData.heading);
    formDataObj.append('subHeading', formData.subHeading);
    formDataObj.append('buttonText', formData.buttonText);
    formDataObj.append('buttonLink', formData.buttonLink);

    try {
      const method = editId ? 'PUT' : 'POST';
      const url = editId ? `/api/banner?id=${editId}` : '/api/banner';

      const response = await fetch(url, {
        method,
        body: formDataObj,
      });

      if (response.ok) {
        const newSlider = await response.json();

        if (editId) {
          // Update existing slider
          setSliders((prevSliders) =>
            prevSliders.map((slider) => (slider._id === editId ? newSlider : slider))
          );
        } else {
          // Add new slider
          setSliders((prevSliders) => [...prevSliders, newSlider]);
        }

        setFormData({
          img: null,
          heading: '',
          subHeading: '',
          buttonText: '',
          buttonLink: '',
        });

        setEditId(null); // Reset edit mode
        setExistingImage(''); // Reset existing image
      } else {
        alert('Failed to upload slider.');
      }
    } catch (error) {
      console.error('Error uploading slider:', error);
    }
  };

  const handleEdit = (slider) => {
    setFormData({
      img: null, // Reset the img field to null for a new upload if desired
      heading: slider.heading,
      subHeading: slider.subHeading,
      buttonText: slider.buttonText,
      buttonLink: slider.buttonLink,
    });
    setEditId(slider._id); // Set edit mode with slider ID
    setExistingImage(slider.img); // Store the existing image
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/banner?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSliders((prevSliders) => prevSliders.filter((slider) => slider._id !== id));
      } else {
        alert('Failed to delete slider.');
      }
    } catch (error) {
      console.error('Error deleting slider:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-r  py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white shadow-2xl p-8 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {editId ? 'Edit Slider' : 'Upload New Slider'}
          </h1>

          {/* Form for slider upload */}
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
              <label className="block text-md font-semibold text-gray-800 mb-1">Upload Image</label>
              {existingImage && !formData.img && (
                <div className="mb-4">
                  <img
                    src={existingImage.startsWith('/uploads') ? existingImage : `/uploads/${existingImage}`}
                    alt="Current Slider"
                    className="w-32 h-32 object-cover rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">Current Image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
              />
              <small className="text-xs text-gray-500 mt-1 block">
                Please upload a high-quality image (JPG, PNG). Leave blank to keep the existing image.
              </small>
            </div>

            {/* Rest of the input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-1">Heading</label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
                  placeholder="Enter heading"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-semibold text-gray-800 mb-1">Sub-Heading</label>
                <input
                  type="text"
                  name="subHeading"
                  value={formData.subHeading}
                  onChange={handleInputChange}
                  className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
                  placeholder="Enter sub-heading"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-1">Button Text</label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
                  placeholder="Enter button text"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-semibold text-gray-800 mb-1">Button Link</label>
                <input
                  type="text"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleInputChange}
                  className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
                  placeholder="Enter button link"
                  required
                />
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                className="inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                {editId ? 'Update Slider' : 'Upload Slider'}
              </button>
            </div>
          </form>

          {/* Display the existing sliders in a table */}
          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-800 text-center">Existing Sliders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Heading</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Subheading</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Button Text</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Button URL</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sliders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-600">
                      No sliders available
                    </td>
                  </tr>
                ) : (
                  sliders.map((slider, index) => (
                    <tr key={index} className="border-t hover:bg-gray-100 transition duration-200">
                      <td className="px-6 py-4">
                        {slider.img ? (
                          <img
                            src={slider.img.startsWith('/uploads') ? slider.img : `/uploads/${slider.img}`}
                            alt={slider.heading}
                            className="w-20 h-20 object-cover rounded shadow-sm"
                          />
                        ) : (
                          <p>No image</p>
                        )}
                      </td>
                      <td className="px-6 py-4">{slider.heading}</td>
                      <td className="px-6 py-4">{slider.subHeading}</td>
                      <td className="px-6 py-4">{slider.buttonText}</td>
                      <td className="px-6 py-4">
                        <Link href={slider.buttonLink} className="text-indigo-500 hover:underline">
                          {slider.buttonLink}
                        </Link>
                      </td>
                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-200"
                          onClick={() => handleEdit(slider)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                          onClick={() => handleDelete(slider._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
