import React from 'react';

export default function WhyChooseVNC() {
  return (
    <div className="w-full bg-gray-200 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose ANC</h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Job Opportunities */}
          <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
            <div className="mr-4">
              {/* Job Opportunities Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6 14H6v-1c0-2.67 5.33-4 6-4s6 1.33 6 4v1z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Job Opportunities</h3>
              <p>We provide strong career support to help our students find job opportunities in various healthcare sectors.</p>
            </div>
          </div>

          {/* Modern Laboratory */}
          <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
            <div className="mr-4">
              {/* Modern Laboratory Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px">
                <path d="M20 2H4v2h16V2zm-7 5h-2v10H9v2h6v-2h-2V7zm-3-3h8v2H5V4z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Modern Laboratory</h3>
              <p>Our facilities are equipped with state-of-the-art labs that provide a practical learning experience.</p>
            </div>
          </div>

          {/* Modern Laboratory Midwifery */}
          <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
            <div className="mr-4">
              {/* Midwifery Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6 14H6v-1c0-2.67 5.33-4 6-4s6 1.33 6 4v1z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Modern Laboratory – Midwifery</h3>
              <p>Specialized labs for midwifery training ensure students get hands-on experience in a real-world setting.</p>
            </div>
          </div>

          {/* Modern Laboratory Nursing */}
          <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
            <div className="mr-4">
              {/* Nursing Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px">
                <path d="M20 2H4v2h16V2zm-7 5h-2v10H9v2h6v-2h-2V7zm-3-3h8v2H5V4z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Modern Laboratory – Nursing</h3>
              <p>Our nursing labs are designed to simulate hospital environments, giving students practical exposure.</p>
            </div>
          </div>

          {/* Modern Laboratory Paramedic */}
          <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
            <div className="mr-4">
              {/* Paramedic Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6 14H6v-1c0-2.67 5.33-4 6-4s6 1.33 6 4v1z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Modern Laboratory – Paramedic</h3>
              <p>Fully equipped paramedic labs prepare students for emergency response scenarios and patient care.</p>
            </div>
          </div>

          {/* Canteen */}
          <div className="bg-white p-5 rounded-lg shadow-md flex items-center">
            <div className="mr-4">
              {/* Canteen Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px">
                <path d="M20 2H4v2h16V2zm-7 5h-2v10H9v2h6v-2h-2V7zm-3-3h8v2H5V4z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Canteen</h3>
              <p>Our canteen provides nutritious meals and a comfortable environment for students to relax and dine.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
