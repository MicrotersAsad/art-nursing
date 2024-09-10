import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component
import campus from '../public/img/campus.png'; // Make sure the path is correct

export default function AboutSection() {
  return (
    <div className="max-w-7xl mx-auto bg-white py-12 px-4 md:px-10">
      <div className="max-w-7xl  mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Content Section */}
        <div className="lg:w-1/2 text-left" data-aos="fade-right">
          <h2 className="text-3xl font-bold mb-4">About Art Nursing College</h2>
          <p className="text-gray-700 mb-6">
          Art Nursing College (ANC) is the Supreme Private Nursing College in the Cumilla District of Bangladesh.
          A Diploma in Nursing Science & Midwifery is a professional program designed to train students in both nursing care and midwifery practices, enabling them to provide comprehensive healthcare to patients.
          A Diploma in Nursing Science & Midwifery is a professional program designed to train students in both nursing care and midwifery practices, enabling them to provide comprehensive healthcare to patients.
         
          </p>
          <p className="text-gray-700 mb-6">
          A Diploma in Nursing Science & Midwifery is a professional program designed to train students in both nursing care and midwifery practices, enabling them to provide comprehensive healthcare to patients.
          A Diploma in Nursing Science & Midwifery is a professional program designed to train students in both nursing care and midwifery practices, enabling them to provide comprehensive healthcare to patients.
          A Diploma in Nursing Science & Midwifery is a professional program designed to train students in both nursing care and midwifery practices, enabling them to provide comprehensive healthcare to patients.
          </p>
          <p className="text-gray-700 mb-6">
          A Diploma in Nursing Science & Midwifery is a professional program designed to train students in both nursing care and midwifery practices, enabling them to provide comprehensive healthcare to patients.
          A Diploma in Nursing Science & Midwifery is a professional program designed to train students.
          </p>
          <Link href="/about">
            <span className="inline-block px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition duration-300">
              Know More
            </span>
          </Link>
        </div>

        {/* Right Image Section */}
        <div className="lg:w-1/2" data-aos="fade-left">
          <Image 
            src={campus} // The image source from the public folder
            alt="Art Nursing College Campus" 
            className="w-full object-cover"
            width={500}  // Adjust width as needed
            height={300} // Adjust height as needed
          />
        </div>

      </div>
    </div>
  );
}
