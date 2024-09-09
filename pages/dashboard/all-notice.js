import React, { useEffect, useState } from 'react';
import Layout from './layout';

const AllNotice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the notices from the API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/notice');
        if (!response.ok) {
          throw new Error('Failed to fetch notices');
        }
        const data = await response.json();
        setNotices(data); // Assuming API response is an array of notices
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);



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
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Content</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice) => (
                <tr key={notice.id} className="bg-white border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{notice.title}</td>
                  <td className="px-4 py-2">{notice.content}</td>
                  <td className="px-4 py-2">
                    {new Date(notice.date).toLocaleDateString()}
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
