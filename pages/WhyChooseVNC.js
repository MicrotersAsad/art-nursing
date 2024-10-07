import Image from 'next/image';
import React, { useState, useEffect } from 'react';

export default function WhyChooseANC() {
  const [whyChooseData, setWhyChooseData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/setting'); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setWhyChooseData(data.whyChooseANC || []); // Set whyChooseANC from the API response
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="w-full bg-gray-200 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose ANC</h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseData.length > 0 ? (
            whyChooseData.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-10 rounded-lg shadow-md flex items-center ${index % 2 === 0 ? 'bg-[#0d1128]' : 'bg-blue-800'} text-black`}
                data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
              >
                <div className="mr-4">
                  {/* SVG Icons remain the same */}
                  <Image
                src={item?.iconUrl} // Use dynamic logo URL
                alt="Logo"
                width={128}
                height={128}
                className="icon-logo"
              />
                </div>
                <div>
                  {/* Dynamic Title and Description */}
                  <h3 className="text-xl font-semibold mb-2">{item.heading}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
