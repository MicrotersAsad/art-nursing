import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { ClipLoader } from 'react-spinners'; // Import loader

const Contact = () => {
  const [contactInfo, setContactInfo] = useState({
    address: '',
    callToUs: '',
    email: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
    },
    locationLink: '',
  });

  const [loading, setLoading] = useState(true);

  // Fetch contact information from the API
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get('/api/contact');
        setContactInfo(response.data); // Set the fetched data
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching contact information:', error);
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  // Show loader while data is being fetched
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={60} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-6 space-y-6 lg:space-y-0 lg:space-x-8">
        {/* Left Section: Contact Information */}
        <div className="w-full lg:w-1/3 space-y-6">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h4 className="text-lg font-bold mb-2">Address</h4>
            <p className="text-gray-600">{contactInfo.address}</p>
          </div>

          <div className="p-6 bg-white shadow-md rounded-lg">
            <h4 className="text-lg font-bold mb-2">Call to us</h4>
            <p className="text-gray-600">📞 {contactInfo.callToUs}</p>
          </div>

          <div className="p-6 bg-white shadow-md rounded-lg">
            <h4 className="text-lg font-bold mb-2">Email</h4>
            <p className="text-gray-600">{contactInfo.email}</p>
          </div>

          <div className="p-6 bg-white shadow-md rounded-lg">
            <h4 className="text-lg font-bold mb-2">Social Link</h4>
            <div className="flex space-x-3 text-2xl">
              {contactInfo.socialLinks.facebook && (
                <a href={contactInfo.socialLinks.facebook} className="text-blue-600 hover:text-blue-800">
                  <FaFacebookF />
                </a>
              )}
              {contactInfo.socialLinks.twitter && (
                <a href={contactInfo.socialLinks.twitter} className="text-blue-600 hover:text-blue-800">
                  <FaTwitter />
                </a>
              )}
              {contactInfo.socialLinks.instagram && (
                <a href={contactInfo.socialLinks.instagram} className="text-blue-600 hover:text-blue-800">
                  <FaInstagram />
                </a>
              )}
              {contactInfo.socialLinks.linkedin && (
                <a href={contactInfo.socialLinks.linkedin} className="text-blue-600 hover:text-blue-800">
                  <FaLinkedinIn />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Contact Form */}
        <div className="w-full lg:w-2/3">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
            <p className="text-gray-600 mb-6">
              Still have questions? Ask us directly, we're open 24/7.
            </p>

            <form className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name*
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email*
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number*
                </label>
                <input
                  type="tel"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Message Input Box */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Message*
                </label>
                <textarea
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Embedded Map */}
      <div className='max-w-7xl mx-auto pt-5 pb-5'>
        {contactInfo.locationLink && (
          <iframe
            src={contactInfo.locationLink}
            width="1200"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          ></iframe>
        )}
      </div>
    </>
  );
};

export default Contact;
