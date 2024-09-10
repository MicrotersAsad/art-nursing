import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PageHeader from '../components/PageHeader'; // Import the PageHeader component

const Allresult = () => {
  const [results, setresults] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [filteredresults, setFilteredresults] = useState([]); // State for filtered results

  useEffect(() => {
    const fetchresultsAndDepartments = async () => {
      try {
        const resultResponse = await fetch('/api/result');
        if (!resultResponse.ok) {
          throw new Error('Failed to fetch results');
        }
        const resultData = await resultResponse.json();
        setresults(resultData);
        setFilteredresults(resultData); // Initialize filteredresults with all results

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

    fetchresultsAndDepartments();
  }, []);

  // Function to get department name by ID
  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  // Function to check if the result is new (within the last 7 days)
  const isNew = (resultDate) => {
    const currentDate = new Date();
    const resultDateObj = new Date(resultDate);
    const timeDifference = currentDate - resultDateObj;
    const daysDifference = timeDifference / (1000 * 3600 * 24); // Convert to days
    return daysDifference <= 7; // Consider as new if within the last 7 days
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    if (event.target.value === '') {
      setFilteredresults(results); // Reset if search term is cleared
    } else {
      const filtered = results.filter((result) =>
        result.title.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredresults(filtered);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      {/* Add the PageHeader component */}
      <PageHeader
        title="All results"
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: 'results' }
        ]}
      />

      <div className="max-w-7xl mx-auto p-4 border mt-5 mb-5">
        <h1 className="text-2xl font-bold mb-4">All results</h1>

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
        ) : filteredresults.length === 0 ? (
          <p>No results found.</p>
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
                {filteredresults.map((result, index) => (
                  <tr key={result._id} className="bg-white border-b hover:bg-gray-100">
                    {/* Serial Number Column */}
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{new Date(result.date).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{getDepartmentName(result.department)}</td>
                    <td className="px-4 py-2">
                      <Link href={`/results/${result.slug}`}>
                        <p className="text-blue-600 hover:underline">
                          {result.title}
                          {/* Show "new" tag if the result is new */}
                          {isNew(result.date) && (
                            <span className="ml-2 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 py-1 px-3 rounded-full shadow-lg">
                              New
                            </span>
                          )}
                        </p>
                      </Link>
                    </td>
                    <td className="py-2 px-4">
                      {result.filePath ? (
                        <Link
                          href={`/uploads/${result.filePath.split('/').pop()}`}
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

export default Allresult;
