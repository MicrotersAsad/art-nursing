import React, { useEffect, useState } from 'react';
import Layout from './layout';
import Link from 'next/link';

const AllNotice = () => {
  const [notices, setNotices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNoticesAndDepartments = async () => {
      try {
        const noticeResponse = await fetch('/api/notice');
        if (!noticeResponse.ok) {
          throw new Error('Failed to fetch notices');
        }
        const noticeData = await noticeResponse.json();
        setNotices(noticeData);

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

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Notices</h1>

        {notices.length === 0 ? (
          <p>No notices found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">File</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice) => (
                  <tr key={notice._id} className="bg-white border-b hover:bg-gray-100">
                    <td className="px-4 py-2">{getDepartmentName(notice.department)}</td>
                    <td className="px-4 py-2">
                      <Link href={`/notices/${notice.slug}`}>
                        <p className="text-blue-600 hover:underline">{notice.title}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-2">{new Date(notice.date).toLocaleDateString()}</td>
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
    </Layout>
  );
};

export default AllNotice;
