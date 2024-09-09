import React from 'react';

export default function WhyChooseVNC() {
  return (
    <div className="w-full bg-gray-200 py-12">
      <div className="container mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center mb-8">Why Choose ANC</h2>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Job Opportunities */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px" className="mx-auto mb-4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6 14H6v-1c0-2.67 5.33-4 6-4s6 1.33 6 4v1z"/>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Job Opportunities</h3>
          </div>

          {/* Modern Laboratory */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px" className="mx-auto mb-4">
              <path d="M20 2H4v2h16V2zm-7 5h-2v10H9v2h6v-2h-2V7zm-3-3h8v2H5V4z"/>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Modern Laboratory</h3>
          </div>

          {/* Modern Laboratory Midwifery */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px" className="mx-auto mb-4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6 14H6v-1c0-2.67 5.33-4 6-4s6 1.33 6 4v1z"/>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Modern Laboratory – Midwifery</h3>
          </div>

          {/* Modern Laboratory Nursing */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px" className="mx-auto mb-4">
              <path d="M20 2H4v2h16V2zm-7 5h-2v10H9v2h6v-2h-2V7zm-3-3h8v2H5V4z"/>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Modern Laboratory – Nursing</h3>
          </div>

          {/* Modern Laboratory Paramedic */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px" className="mx-auto mb-4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm6 14H6v-1c0-2.67 5.33-4 6-4s6 1.33 6 4v1z"/>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Modern Laboratory – Paramedic</h3>
          </div>

          {/* Canteen */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48px" height="48px" className="mx-auto mb-4">
              <path d="M20 2H4v2h16V2zm-7 5h-2v10H9v2h6v-2h-2V7zm-3-3h8v2H5V4z"/>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Canteen</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
