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
                className={`bg-white p-5 rounded-lg shadow-md flex items-center ${index % 2 === 0 ? 'bg-[#0d1128]' : 'bg-blue-800'} text-black`}
                data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}
              >
                <div className="mr-4">
                  {/* SVG Icons remain the same */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6 14H6v-1c0-2.67 5.33-4 6-4s6 1.33 6 4v1z" />
                  </svg>
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
