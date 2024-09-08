// components/ContactDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaTrashAlt,
  FaEdit,
} from 'react-icons/fa';
import Layout from './layout';

const ContactDashboard = () => {
  const [contactInfo, setContactInfo] = useState({
    address: '',
    callToUs: '',
    email: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: '',
    },
    locationLink: '',
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Flag to handle edit mode
  const [contactList, setContactList] = useState([]); // List of contact info for table display
  const [selectedContactId, setSelectedContactId] = useState(null); // To track the selected contact for editing

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get('/api/contact');
      if (response.data) {
        setContactList(response.data); // Fetch all contacts into the array
      }
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching contact information');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing && selectedContactId) {
        // Update existing contact
        await axios.put(`/api/contact?id=${selectedContactId}`, contactInfo);
        toast.success('Contact information updated successfully!');
      } else {
        // Create new contact
        await axios.post('/api/contact', contactInfo);
        toast.success('Contact information saved successfully!');
      }

      setIsEditing(false);
      setSelectedContactId(null);
      fetchContactInfo(); // Refresh the table after adding or updating contact
    } catch (error) {
      toast.error('Error saving contact information');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`/api/contact?id=${id}`);
        toast.success('Contact information deleted successfully!');
        fetchContactInfo(); // Refresh the table after deletion
      } catch (error) {
        toast.error('Error deleting contact information');
      }
    }
  };

  const handleEdit = (contact) => {
    setContactInfo(contact);
    setIsEditing(true);
    setSelectedContactId(contact._id); // Set the selected contact ID for editing
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Layout>


    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

        {/* Form to add/edit contact info */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-lg font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={contactInfo.address}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Call To Us</label>
            <input
              type="text"
              name="callToUs"
              value={contactInfo.callToUs}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={contactInfo.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Location Link</label>
            <input
              type="url"
              name="locationLink"
              value={contactInfo.locationLink}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter Google Maps or other location link"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium">Social Links</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <FaFacebook className="text-blue-600 mr-2" />
                <input
                  type="url"
                  name="facebook"
                  placeholder="Facebook Link"
                  value={contactInfo.socialLinks.facebook}
                  onChange={handleSocialChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="flex items-center">
                <FaTwitter className="text-blue-400 mr-2" />
                <input
                  type="url"
                  name="twitter"
                  placeholder="Twitter Link"
                  value={contactInfo.socialLinks.twitter}
                  onChange={handleSocialChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="flex items-center">
                <FaLinkedin className="text-blue-800 mr-2" />
                <input
                  type="url"
                  name="linkedin"
                  placeholder="LinkedIn Link"
                  value={contactInfo.socialLinks.linkedin}
                  onChange={handleSocialChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="flex items-center">
                <FaInstagram className="text-pink-600 mr-2" />
                <input
                  type="url"
                  name="instagram"
                  placeholder="Instagram Link"
                  value={contactInfo.socialLinks.instagram}
                  onChange={handleSocialChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="flex items-center">
                <FaYoutube className="text-red-600 mr-2" />
                <input
                  type="url"
                  name="youtube"
                  placeholder="YouTube Link"
                  value={contactInfo.socialLinks.youtube}
                  onChange={handleSocialChange}
                  className="w-full p-3 border rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              {isEditing ? 'Update Contact Information' : 'Save Contact Information'}
            </button>
          </div>
        </form>

        {/* Table for displaying contact info */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Saved Contact Information</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">Address</th>
                <th className="py-2 px-4 border-b">Call To Us</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Social Links</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No Contact Information Found
                  </td>
                </tr>
              ) : (
                contactList.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{contact.address}</td>
                    <td className="py-2 px-4 border-b">{contact.callToUs}</td>
                    <td className="py-2 px-4 border-b">{contact.email}</td>
                    <td className="py-2 px-4 border-b">
                      <a href={contact.locationLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Location
                      </a>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        {contact.socialLinks.facebook && (
                          <a href={contact.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                            <FaFacebook className="text-blue-600" />
                          </a>
                        )}
                        {contact.socialLinks.twitter && (
                          <a href={contact.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                            <FaTwitter className="text-blue-400" />
                          </a>
                        )}
                        {contact.socialLinks.linkedin && (
                          <a href={contact.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="text-blue-800" />
                          </a>
                        )}
                        {contact.socialLinks.instagram && (
                          <a href={contact.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                            <FaInstagram className="text-pink-600" />
                          </a>
                        )}
                        {contact.socialLinks.youtube && (
                          <a href={contact.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                            <FaYoutube className="text-red-600" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
                          onClick={() => handleEdit(contact)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                          onClick={() => handleDelete(contact._id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
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
};

export default ContactDashboard;
