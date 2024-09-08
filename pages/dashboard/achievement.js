import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './layout';

const AchievementsDashboard = () => {
  const [achievements, setAchievements] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    image: null,
    existingImagePath: null,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch achievements list
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axios.get('/api/achievement');
        setAchievements(response.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file change (for image upload)
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  // Handle form submission for adding/editing achievements
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    if (formData.image) {
      formDataObj.append('image', formData.image);
    } else {
      formDataObj.append('existingImagePath', formData.existingImagePath);
    }

    try {
      if (isEdit) {
        // Update achievement if in edit mode
        formDataObj.append('id', formData.id);
        await axios.put('/api/achievement', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Add new achievement
        await axios.post('/api/achievement', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      const updatedAchievements = await axios.get('/api/achievement');
      setAchievements(updatedAchievements.data);
      resetForm();
    } catch (error) {
      console.error('Error uploading achievement:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await axios.delete(`/api/achievement?id=${id}`);
        setAchievements((prevAchievements) =>
          prevAchievements.filter((achievement) => achievement._id !== id)
        );
      } catch (error) {
        console.error('Error deleting achievement:', error);
      }
    }
  };

  // Handle edit
  const handleEdit = (achievement) => {
    setFormData({
      id: achievement._id,
      title: achievement.title,
      existingImagePath: achievement.imagePath,
      image: null, // Set to null initially
    });
    setIsEdit(true);
  };

  // Reset form after submission/edit
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      image: null,
      existingImagePath: null,
    });
    setIsEdit(false);
  };

  if (loading) return <p className="text-center text-lg">Loading...</p>;

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Achievements Dashboard</h1>

          {/* Achievement Form */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {isEdit ? 'Edit Achievement' : 'Add New Achievement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter achievement title"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Upload Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-gray-500"
                />
              </div>
              {isEdit && formData.existingImagePath && (
                <div>
                  <label className="block text-lg font-medium text-gray-700">Existing Image</label>
                  <img
                    src={formData.existingImagePath}
                    alt="Achievement"
                    className="w-32 h-32 object-cover rounded mt-2"
                  />
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  disabled={uploading}
                >
                  {uploading ? 'Saving...' : isEdit ? 'Update Achievement' : 'Add Achievement'}
                </button>
              </div>
            </form>
          </div>

          {/* Achievements List Table */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Achievements</h2>
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Title</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Image</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((achievement) => (
                  <tr key={achievement._id} className="border-t">
                    <td className="py-3 px-4 text-sm text-gray-800">{achievement.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {achievement.imagePath ? (
                        <img
                          src={achievement.imagePath}
                          alt={achievement.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm flex space-x-3">
                      <button
                        onClick={() => handleEdit(achievement)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(achievement._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AchievementsDashboard;
