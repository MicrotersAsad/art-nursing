import React from 'react';
import Link from 'next/link';

export default function InfoSection() {
  return (
    <div className="w-full">
      {/* Full-width grid layout without gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Admission Block */}
        <div className="bg-[#0d1128] text-white p-6">
            <div className="flex justify-center m-4 ">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12l9-5-9-5-9 5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-center mb-3">Admission</h3>
            <p className="text-center text-gray-300">
              We have students coming from different backgrounds, cultures, and nationalities. Over 500 international students are enrolled.
            </p>
            {/* Button */}
            <div className="flex justify-center m-4">
              <Link href="/admission" passHref>
                <p className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                  Learn More
                </p>
              </Link>
            </div>
          </div>
        {/* Programs Block */}
        <div className="bg-blue-800 text-white p-6">
        <div className="flex justify-center m-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7V3a1 1 0 00-1-1H9a1 1 0 00-1 1v4H4v2h16V7h-4zm-5 4H9v7h6v-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-center mb-3">Admission</h3>
            <p className="text-center text-gray-300">
              We have students coming from different backgrounds, cultures, and nationalities. Over 500 international students are enrolled.
            </p>
            {/* Button */}
            <div className="flex justify-center mt-4">
              <Link href="/admission" passHref>
                <p className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                  Learn More
                </p>
              </Link>
            </div>
          </div>

        {/* Tuition Fees Block */}
        <div className="bg-[#0d1128] text-white p-6">
        <div className="flex justify-center m-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h1m-1 0v-4h-1m4 0h-1v4h1m-4 0H8m4 0v4h4m0 0V7h-4M6 5V3h6v2m0 6H4v6h4m0-6V5h4v4h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-center mb-3">Admission</h3>
            <p className="text-center text-gray-300">
              We have students coming from different backgrounds, cultures, and nationalities. Over 500 international students are enrolled.
            </p>
            {/* Button */}
            <div className="flex justify-center mt-4">
              <Link href="/admission" passHref>
                <p className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                  Learn More
                </p>
              </Link>
            </div>
          </div>
        {/* Scholarship Block */}
        <div className="bg-blue-800 text-white p-6">
        <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-center mb-3">Admission</h3>
            <p className="text-center text-gray-300">
              We have students coming from different backgrounds, cultures, and nationalities. Over 500 international students are enrolled.
            </p>
            {/* Button */}
            <div className="flex justify-center mt-4">
              <Link href="/admission" passHref>
                <p className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                  Learn More
                </p>
              </Link>
            </div>
          </div>

      </div>
    </div>
  );
}
