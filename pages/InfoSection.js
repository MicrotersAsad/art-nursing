import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InfoSection() {
  const [heroArea, setHeroArea] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/setting');
        if (response.ok) {
          const data = await response.json();
          setHeroArea(data.heroArea || []); // Set the heroArea from the API response
        }
      } catch (error) {
        console.error('Error fetching heroArea data:', error);
      }
    };
    
    fetchSettings();
  }, []);

  return (
    <div className="w-full">
      {/* Full-width grid layout without gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
        {heroArea.length > 0 ? (
          heroArea.map((hero, index) => (
            <div
              key={index}
              className={`p-6 ${
                (index % 2 === 0) ? 'bg-[#0d1128]' : 'bg-blue-800'
              } text-white`}
            >
              <div className="flex justify-center m-4">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 20l9-5-9-5-9 5 9 5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 12l9-5-9-5-9 5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-center mb-3">
                {hero.title || 'No Title'}
              </h3>
              <p className="text-center text-gray-300">
                {hero.description || 'No description available.'}
              </p>
              {/* Button */}
              <div className="flex justify-center m-4">
                <Link href={hero.buttonLink || '/'} passHref>
                  <p className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                    {hero.buttonText || 'Learn More'}
                  </p>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No hero sections available</p>
        )}
      </div>
    </div>
  );
}
