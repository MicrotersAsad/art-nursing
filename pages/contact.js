import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto p-6 space-y-6 lg:space-y-0 lg:space-x-8">
      
      {/* Left Section: Contact Information */}
      <div className="w-full lg:w-1/3 space-y-6">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h4 className="text-lg font-bold mb-2">Address</h4>
          <p className="text-gray-600">
            H# 213/90, Kazlar Paar, Samad Nagar, Jatrabari, Dhaka 1236
          </p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          <h4 className="text-lg font-bold mb-2">Call to us</h4>
          <p className="text-gray-600">📞 US +1 (888) 820-3074</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          <h4 className="text-lg font-bold mb-2">Email</h4>
          <p className="text-gray-600">info@doppcall.com</p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          <h4 className="text-lg font-bold mb-2">Social Link</h4>
          <div className="flex space-x-3 text-2xl">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <FaFacebookF />
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <FaTwitter />
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <FaInstagram />
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <FaLinkedinIn />
            </a>
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
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name*
              </label>
              <input
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

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

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Where Are You Located?*
              </label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option>Select Please</option>
                <option>Location 1</option>
                <option>Location 2</option>
              </select>
            </div>

            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Are You Looking To Buy Calls (Advertiser) Or Sell Calls (Publisher)?*
              </label>
              <select className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option>Select Please</option>
                <option>Buy Calls</option>
                <option>Sell Calls</option>
              </select>
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
  );
};

export default Contact;
