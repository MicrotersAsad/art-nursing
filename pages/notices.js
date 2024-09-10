import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '../components/PageHeader'; // Import the PageHeader component

const AllNotice = () => {
  const [notices, setNotices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredNotices, setFilteredNotices] = useState([]); // State for filtered notices

  useEffect(() => {
    const fetchNoticesAndDepartments = async () => {
      try {
        const noticeResponse = await fetch('/api/notice');
        if (!noticeResponse.ok) {
          throw new Error('Failed to fetch notices');
        }
        const noticeData = await noticeResponse.json();
        setNotices(noticeData);
        setFilteredNotices(noticeData); // Initialize filteredNotices with all notices

        const departmentResponse = await fetch('/api/department');
        if (!departmentResponse.ok) {
          throw new Error('Failed to fetch departments');
        }
        const departmentData = await departmentResponse.json();
        setDepartments(departmentData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticesAndDepartments();
  }, []);

  // Function to get department name by ID
  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  // Function to check if the notice is new (within the last 7 days)
  const isNew = (noticeDate) => {
    const currentDate = new Date();
    const noticeDateObj = new Date(noticeDate);
    const timeDifference = currentDate - noticeDateObj;
    const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert to days
    return daysDifference <= 7; // Consider as new if within the last 7 days
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setFilteredNotices(notices); // Reset if search term is cleared
    } else {
      const filtered = notices.filter((notice) =>
        notice.title.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredNotices(filtered);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {/* Add the PageHeader component */}
      <PageHeader
        title="All Notices"
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: 'Notices' }
        ]}
      />

      <div className="max-w-7xl mx-auto p-4 border mt-5 mb-5">
        <h1 className="text-2xl font-bold mb-4">All Notices</h1>

        {/* Search Bar */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search by title..."
          className="mb-4 p-2 border rounded w-full"
        />

        {loading ? (
          <p>Loading...</p>
        ) : filteredNotices.length === 0 ? (
          <p>No notices found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Sl. No</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">File</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotices.map((notice, index) => (
                  <tr key={notice._id} className="bg-white border-b hover:bg-gray-100">
                    {/* Serial Number Column */}
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{new Date(notice.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{getDepartmentName(notice.department)}</td>
                    <td className="px-4 py-2">
                      <Link href={`/notices/${notice.slug}`}>
                        <p className="text-blue-600 hover:underline">
                          {notice.title}
                          {/* Show "new" tag if the notice is new */}
                          {isNew(notice.date) && (
                            <span className="ml-2 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 py-1 px-3 rounded-full shadow-lg">
                              New
                            </span>
                          )}
                        </p>
                      </Link>
                    </td>
                    <td className="py-2 px-4">
                      {notice.filePath ? (
                        <Link
                          href={`/uploads/${notice.filePath.split('/').pop()}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </Link>
                      ) : (
                        <p className="text-gray-500 text-sm">No PDF available</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AllNotice;
