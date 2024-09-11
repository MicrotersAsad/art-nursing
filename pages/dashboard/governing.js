import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './layout';
import Image from 'next/image';

const GoverningDashboard = () => {
  const [governing, setgoverning] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    designation: '',
    department: '',
    photo: null,
    existingPhotoPath: null, // Keep track of existing photo
  });
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Fetch governing list
  useEffect(() => {
    const fetchgoverning = async () => {
      try {
        const response = await axios.get('/api/governing');
        setgoverning(response.data);
      } catch (error) {
        console.error('Error fetching governing data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchgoverning();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file (photo) change
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      photo: e.target.files[0],
    }));
  };

  // Handle form submission for adding/editing
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('designation', formData.designation);
    formDataObj.append('department', formData.department);
    if (formData.photo) {
      formDataObj.append('photo', formData.photo);
    } else {
      formDataObj.append('existingPhotoPath', formData.existingPhotoPath);
    }

    try {
      if (isEdit) {
        formDataObj.append('id', formData.id);
        await axios.put('/api/governing', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('/api/governing', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      const updatedgoverningList = await axios.get('/api/governing');
      setgoverning(updatedgoverningList.data);
      resetForm();
    } catch (error) {
      console.error('Error uploading governing info:', error);
    } finally {
      setUploading(false);
    }
  };

  // Handle governing deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this governing member?')) {
      try {
        await axios.delete(`/api/governing?id=${id}`);
        setgoverning((prevgoverning) => prevgoverning.filter((member) => member._id !== id));
      } catch (error) {
        console.error('Error deleting governing member:', error);
      }
    }
  };

  // Handle governing edit
  const handleEdit = (governingMember) => {
    setFormData({
      id: governingMember._id,
      name: governingMember.name,
      designation: governingMember.designation,
      department: governingMember.department,
      existingPhotoPath: governingMember.photoPath,
      photo: null,
    });
    setIsEdit(true);
  };

  // Reset the form after adding/editing
  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      designation: '',
      department: '',
      photo: null,
      existingPhotoPath: null,
    });
    setIsEdit(false);
  };



  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">governing Dashboard</h1>

          {/* governing Form */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{isEdit ? 'Edit governing' : 'Add New governing'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter governing name"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter governing designation"
                  required
                />
              </div>
              
              <div>
                <label className="block text-lg font-medium text-gray-700">Photo</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-gray-500"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  disabled={uploading}
                >
                  {uploading ? 'Saving...' : isEdit ? 'Update governing' : 'Add governing'}
                </button>
              </div>
            </form>
          </div>

          {/* governing List Table */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">governing List</h2>
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Photo</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Designation</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Department</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {governing.map((member) => (
                  <tr key={member._id} className="border-t">
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {member.photoPath ? (
                        <Image
                          src={member.photoPath}
                          alt={member.name}
                          className="w-16 h-16 object-cover rounded-full"
                          width={16}
                          height={16}
                        />
                      ) : (
                        <span className="text-gray-500">No Photo</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">{member.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{member.designation}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{member.department}</td>
                    <td className="py-3 px-4 text-sm flex space-x-3">
                      <button
                        onClick={() => handleEdit(member)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
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

export default GoverningDashboard;
