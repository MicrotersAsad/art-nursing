import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import the AOS CSS

const StatisticsCard = ({ title, value, animation }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/\D/g, ''), 10); // Extract numeric value
    if (start === end) return;

    let incrementTime = (1000 / end); // Duration of the count (1 second)
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
  }, [value]);

  return (
    <div
      data-aos={animation} // Apply the AOS animation
      className="p-12 bg-white shadow-2xl rounded-2xl transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl w-full mx-auto max-w-lg"
    >
      <h2 className="text-4xl font-bold mb-6 text-gray-700 text-center">{title}</h2>
      <div className="text-center">
        <span className="text-7xl font-extrabold text-blue-600">{count}+</span>
      </div>
    </div>
  );
};

const Statistics = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200, // Animation duration
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <div className="pt-5 pb-5 bg-gray-100 flex flex-col justify-center items-center px-4">
      <h1
        className="text-3xl font-extrabold text-gray-800 mb-16 text-center"
        data-aos="fade-up" // Animation for the heading
      >
        Our Community Statistics
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 w-full max-w-7xl">
        {/* Card 1: Students */}
        <StatisticsCard title="Students" value="500+" animation="fade-up" />

        {/* Card 2: Faculty */}
        <StatisticsCard title="Faculty" value="3+" animation="fade-up" />

        {/* Card 3: Teachers */}
        <StatisticsCard title="Teachers" value="30+" animation="fade-up" />
      </div>
    </div>
  );
};

export default Statistics;
