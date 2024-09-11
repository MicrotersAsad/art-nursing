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
import Link from 'next/link';

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
  const [isEditing, setIsEditing] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get('/api/contact');
      if (response.data) {
        setContactList([response.data]); // Treat the contact as a list for uniformity
        setLoading(false);
      }
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
        await axios.post(`/api/contact`, contactInfo);
        toast.success('Contact information updated successfully!');
      } else {
        await axios.post(`/api/contact`, contactInfo);
        toast.success('Contact information saved successfully!');
      }

      setIsEditing(false);
      setSelectedContactId(null);
      fetchContactInfo();
    } catch (error) {
      toast.error('Error saving contact information');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`/api/contact`);
        toast.success('Contact information deleted successfully!');
        fetchContactInfo();
      } catch (error) {
        toast.error('Error deleting contact information');
      }
    }
  };

  const handleEdit = (contact) => {
    setContactInfo(contact);
    setIsEditing(true);
    setSelectedContactId(contact._id);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <ToastContainer />
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
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
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium">Social Links</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(contactInfo.socialLinks).map((key) => (
                  <div className="flex items-center" key={key}>
                    <input
                      type="url"
                      name={key}
                      placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)} Link`}
                      value={contactInfo.socialLinks[key]}
                      onChange={handleSocialChange}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
              >
                {isEditing ? 'Update Contact Information' : 'Save Contact Information'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Saved Contact Information</h3>
            {contactList.length > 0 ? (
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
                  {contactList.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">{contact.address}</td>
                      <td className="py-2 px-4 border-b">{contact.callToUs}</td>
                      <td className="py-2 px-4 border-b">{contact.email}</td>
                      <td className="py-2 px-4 border-b">
                        <Link href={contact.locationLink} target="_blank" rel="noopener noreferrer">
                          Location
                        </Link>
                      </td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex space-x-2">
                          {Object.keys(contact.socialLinks).map((key) => (
                            <Link
                              href={contact.socialLinks[key]}
                              key={key}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600"
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Link>
                          ))}
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
                            onClick={handleDelete}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No contact information available</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactDashboard;
