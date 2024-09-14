import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import Next.js Image component

export default function AboutSection() {
  const [aboutData, setAboutData] = useState({
    headline: '',
    description: '',
    aboutImageUrl: '',
  });

  useEffect(() => {
    // Fetch data from the API
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/setting');
        if (response.ok) {
          const data = await response.json();
          // Assuming the `aboutSection` data structure is like {headline, description, aboutImageUrl}
          setAboutData(data.aboutSection);
        }
      } catch (error) {
        console.error('Error fetching about section data:', error);
      }
    };
    
    fetchSettings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto bg-white py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Content Section */}
        <div className="lg:w-1/2 text-left" data-aos="fade-right">
          <h2 className="text-3xl font-bold mb-4">{aboutData.headline || 'About Art Nursing College'}</h2>
          <p className="text-gray-700 mb-6">
            {aboutData.description || 'A brief description about Art Nursing College.'}
          </p>
          <Link href="/about">
            <span className="inline-block px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition duration-300">
              Know More
            </span>
          </Link>
        </div>

        {/* Right Image Section */}
        <div className="lg:w-1/2" data-aos="fade-left">
          {aboutData.aboutImageUrl ? (
            <Image 
              src={aboutData.aboutImageUrl} // The image source from the API
              alt="Art Nursing College Campus" 
              className="w-full object-cover"
              width={500}  // Adjust width as needed
              height={300} // Adjust height as needed
            />
          ) : (
            <Image 
              src="/img/campus.png" // Fallback static image if no image from API
              alt="Art Nursing College Campus" 
              className="w-full object-cover"
              width={500}  // Adjust width as needed
              height={300} // Adjust height as needed
            />
          )}
        </div>

      </div>
    </div>
  );
}
