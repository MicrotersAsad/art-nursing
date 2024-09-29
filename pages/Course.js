import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CoursesSection() {
  const [courses, setCourses] = useState([]);

  // Fetch data from the API when the component is mounted
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/setting"); // Assuming API endpoint
        const data = await response.json();
        setCourses(data.ourCourses || []); // Ensure it fetches the courses
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* Section Title */}
      <h2 className="text-3xl font-bold text-center mb-8">Our Courses</h2>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <div
              key={index}
              className="bg-blue-900 text-white p-6 rounded-lg text-center pt-14 pb-14"
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div className="mb-4">
                {/* Course Icon */}
                <Image
                  src={course.iconUrl} // Assuming the API returns an icon URL for each course
                  alt={course.heading}
                  className="w-12 h-12 mx-auto"
                  width={24}
                  height={24}
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{course.heading}</h3>
              <p>{course.description}</p>
              {/* Read More Button */}
              <Link href={course.buttonLink || "#"}>
                <p className="mt-4 inline-block px-6 py-2 bg-[#F4A139] text-blue-900 font-semibold rounded-md">
                  {course.buttonText || "Read More"}
                </p>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700">No courses available at the moment.</p>
        )}
      </div>
    </div>
  );
}
