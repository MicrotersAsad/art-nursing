import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function NoticesAndBlogs() {
  const [notices, setNotices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [searchTermNotices, setSearchTermNotices] = useState('');
  const [searchTermBlogs, setSearchTermBlogs] = useState('');
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Fetch notices from API
  useEffect(() => {
    async function fetchNotices() {
      try {
        const response = await fetch('/api/notice');
        const data = await response.json();
        setNotices(data); // Keep all notices, limit display by scrolling
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoadingNotices(false);
      }
    }
    fetchNotices();
  }, []);

  // Fetch blogs from API
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        setBlogs(data); // Keep all blogs, limit display by scrolling
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoadingBlogs(false);
      }
    }
    fetchBlogs();
  }, []);

  // Handle search functionality for notices
  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTermNotices.toLowerCase())
  );

  // Handle search functionality for blogs
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTermBlogs.toLowerCase())
  );

  return (
    <div className="w-full bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Existing Notices Section */}
        <div className="bg-white p-6 shadow-md rounded-lg" data-aos="fade-right">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Notices</h2>
          <input
            type="text"
            placeholder="Search notices..."
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            value={searchTermNotices}
            onChange={e => setSearchTermNotices(e.target.value)}
          />
          {loadingNotices ? (
            <div>Loading notices...</div>
          ) : (
            <div className="overflow-x-auto">
              {/* Set a fixed height for the table container and allow scrolling */}
              <div className="max-h-48 overflow-y-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b text-left text-gray-700 font-medium">Title</th>
                      <th className="py-2 px-4 border-b text-left text-gray-700 font-medium">Date</th>
                      <th className="py-2 px-4 border-b text-left text-gray-700 font-medium">PDF</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotices.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-gray-600">
                          No notices available.
                        </td>
                      </tr>
                    ) : (
                      filteredNotices.map((notice) => (
                        <tr key={notice._id} className="border-t">
                          <td className="py-2 px-4">{notice.title}</td>
                          <td className="py-2 px-4">{new Date(notice.date).toLocaleDateString()}</td>
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Latest Blogs Section */}
        <div className="bg-white p-6 shadow-md rounded-lg" data-aos="fade-left">
          <h2 className="text-xl font-semibold mb-4">Latest Blogs</h2>
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            value={searchTermBlogs}
            onChange={e => setSearchTermBlogs(e.target.value)}
          />
          {loadingBlogs ? (
            <div>Loading blogs...</div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 border">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBlogs.length > 0 ? (
                    filteredBlogs.map(blog => (
                      <tr key={blog.id} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border">
                          <Link href="#" className="text-blue-500 hover:underline">
                            {blog.title}
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-2 border text-center">No blogs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
