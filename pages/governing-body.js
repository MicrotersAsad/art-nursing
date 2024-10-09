import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaFacebookF, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

// Component for displaying Governing Body information
const GoverningBody = () => {
  const [members, setMembers] = useState([]);
  const [notices, setNotices] = useState([]);

  // Fetch governing body members from API
  useEffect(() => {
    const fetchGoverningBody = async () => {
      try {
        const response = await axios.get('/api/governing'); // Your API endpoint
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching governing body members:', error);
      }
    };

    const fetchNotices = async () => {
      try {
        const response = await axios.get('/api/notice'); // Your API endpoint
        setNotices(response.data);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    fetchGoverningBody();
    fetchNotices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Responsive Layout for Main Section and Sidebar */}
      <div className="flex flex-col md:flex-row">
        {/* Main Section */}
        <div className="w-full md:w-3/4">
          <h1 className="text-4xl font-bold text-blue-800 mb-6">Governing Body</h1>
          <table className="w-full border-collapse border border-green-600">
  <thead>
    <tr className="bg-green-200">
      <th className="border border-green-600 p-3">Ser</th> {/* প্যাডিং 3 ব্যবহার করা হয়েছে */}
      <th className="border border-green-600 p-3">Name</th>
      <th className="border border-green-600 p-3">Designation</th>
      <th className="border border-green-600 p-3">Picture</th>
    </tr>
  </thead>
  <tbody>
    {members.map((member, index) => (
      <tr key={index}>
        <td className="border border-green-600 p-3 text-center">{index + 1}</td> {/* Center Alignment for Numbers */}
        <td className="border border-green-600 p-3">{member.name}</td> {/* প্যাডিং 3 */}
        <td className="border border-green-600 p-3">{member.designation}</td> {/* প্যাডিং 3 */}
        <td className="py-3 px-4 text-sm text-gray-800 text-center">
          {member.photoPath ? (
            <Image
              src={member.photoPath}
              alt={member.name}
              className="w-28 h-28 object-cover"
              width={60}
              height={60}
            />
          ) : (
            <span className="text-gray-500">No Photo</span>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>

        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-gray-100 p-4 mb-5 shadow-lg border rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Notices</h2>
          <ul className="space-y-4">
            {notices.slice(0, 5).map((notice, index) => (
              <li key={index} className="bg-white p-3 shadow-md rounded-md flex items-center">
                <FaArrowRight className="text-blue-600 mr-2" />
                <div>
                  <Link href={`/notices/${notice.slug}`}>
                    <p className="font-semibold text-blue-600 hover:underline">{notice.title}</p>
                  </Link>
                  <p className="text-sm text-gray-500">{notice.date}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Additional Sidebar Information */}
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
            <div className="flex space-x-4 justify-center">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <FaFacebookF className="text-2xl text-blue-600 hover:text-blue-800" />
              </a>
              {/* YouTube */}
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800"
              >
                <FaYoutube className="text-2xl text-red-600 hover:text-red-800" />
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                <FaLinkedinIn className="text-2xl text-blue-500 hover:text-blue-700" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoverningBody;
