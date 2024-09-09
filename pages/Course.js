import React from 'react';
import Link from 'next/link'; // Import Link for navigation

export default function CoursesSection() {
  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* Section Title */}
      <h2 className="text-3xl font-bold text-center mb-8">Our Courses</h2>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Nursing Course */}
        <div className="bg-blue-900 text-white p-6 rounded-lg text-center pt-14 pb-14">
          <div className="mb-4">
            {/* Nursing Icon (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.29 8.62a12.07 12.07 0 01-.15 2.71c-.44 2.4-1.68 4.75-4.13 6.6-1.86 1.39-4.02 2.07-6.16 2.07-3.74 0-7.27-2.57-9.55-6.52C1.09 9.78 3.42 6.13 7.22 5.14 10.01 4.42 12.56 6 15 7.68c.48-.26.92-.52 1.34-.74.45-.23.9-.46 1.39-.63a12.04 12.04 0 012.56-.69zM12 10.9a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Diploma in Nursing Science & Midwifery</h3>
          <p>
            A Diploma in Nursing Science & Midwifery is a professional program designed to train students in both nursing care and midwifery practices, enabling them to provide comprehensive healthcare to patients.
          </p>
          {/* Read More Button */}
          <Link href="/courses/nursing-science">
            <p className="mt-4 inline-block px-6 py-2 bg-[#F4A139] text-blue-900 font-semibold rounded-md">Read More</p>
          </Link>
        </div>

        {/* Midwifery Course */}
        <div className="bg-blue-900 text-white p-6 rounded-lg text-center pt-14 pb-14">
          <div className="mb-4">
            {/* Midwifery Icon (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 12v1m2 0v-1m2 0v1m2 0v-1m4 0a7 7 0 01-4 6.39A7 7 0 014 12V7a4 4 0 018 0v3" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Diploma in Midwifery</h3>
          <p>
            A Diploma in Midwifery is a professional program designed to train students in both nursing care and midwifery practices, enabling them to provide comprehensive healthcare to patients.
          </p>
          {/* Read More Button */}
          <Link href="/courses/midwifery">
            <p className="mt-4 inline-block px-6 py-2 bg-[#F4A139] text-blue-900 font-semibold rounded-md">Read More</p>
          </Link>
        </div>

        {/* B.Sc. Course */}
        <div className="bg-blue-900 text-white p-6 rounded-lg text-center pt-14 pb-14">
          <div className="mb-4">
            {/* BSc Icon (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mx-auto"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20l9-5-9-5-9 5 9 5z" />
              <path d="M12 10l9-5-9-5-9 5z" />
              <path d="M12 10v10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">B.Sc. in Nursing (Basic)</h3>
          <p>
            A B.Sc. in Nursing (Basic) is a professional program designed to train students in both nursing care and midwifery practices, enabling them to provide comprehensive healthcare to patients.
          </p>
          {/* Read More Button */}
          <Link href="/courses/bsc-nursing-basic">
            <p className="mt-4 inline-block px-6 py-2 bg-[#F4A139] text-blue-900 font-semibold rounded-md">Read More</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
