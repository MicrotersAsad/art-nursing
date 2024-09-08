import React from 'react';
import Image from 'next/image'; // Import Next.js Image component
import logo from "../public/img/logo (3).png"; // Ensure this is the correct path to your logo image
import { FaFacebook, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#00254c] text-white py-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Section - Logo and Description */}
        <div>
          {/* Use Image component from Next.js for optimized image loading */}
          <Image
            src={logo}
            alt="Victoria Nursing College"
            width={100} // Adjust the size as needed
            height={100}
            className="h-16 mb-4"
          />
          <p className="text-pink-500 text-lg mb-4 font-bold">Art Nursing College</p>
          <p className="text-gray-300">
            Victoria Nursing College (VNC) is the Supreme Private Nursing College in Comilla District of Bangladesh.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-white bg-blue-600 p-2 rounded-full">
             <FaFacebook/>
            </a>
            <a href="#" className="text-white bg-red-600 p-2 rounded-full">
             <FaYoutube/>
            </a>
          </div>
        </div>

        {/* Middle Section - Featured Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Featured Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-gray-300 hover:text-pink-500">About Us</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-pink-500">Brochure</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-pink-500">News</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-pink-500">Corona Information</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-pink-500">Our Department</a>
            </li>
            <li>
              <a href="#" className="text-gray-300 hover:text-pink-500">Contact</a>
            </li>
          </ul>
        </div>

        {/* Right Section - Contact Information */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Information</h3>
          <p className="text-gray-300 mb-4">
            Tahera Mansion, Cumilla Medical College Road, Kuchaitylu, Cumilla 3500, Chittagong Division, Bangladesh
          </p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <i className="fas fa-phone-alt mr-2"></i>
              <a href="tel:01733852842" className="text-gray-300 hover:text-pink-500">01733852842</a>
            </li>
            <li className="flex items-center">
              <i className="fas fa-phone-alt mr-2"></i>
              <a href="tel:01730363166" className="text-gray-300 hover:text-pink-500">01730363166</a>
            </li>
            <li className="flex items-center">
              <i className="fas fa-phone-alt mr-2"></i>
              <a href="tel:01730363188" className="text-gray-300 hover:text-pink-500">01730363188</a>
            </li>
            <li className="flex items-center">
              <i className="fas fa-envelope mr-2"></i>
              <a href="mailto:victorianursingcollege@gmail.com" className="text-gray-300 hover:text-pink-500">
                victorianursingcollege@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className="mt-10 border-t border-gray-600 pt-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            © 2024 Victoria Nursing College. All rights reserved. Developed by{" "}
            <a href="#" className="text-pink-500 hover:underline">Webo Developer</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
