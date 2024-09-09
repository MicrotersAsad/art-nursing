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
        setNotices(data.slice(0, 5)); // Limit to 5
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
        setBlogs(data.slice(0, 5)); // Limit to 5
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
        {/* Latest Notices Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Latest Notices</h2>
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
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Title</th>
                </tr>
              </thead>
              <tbody>
                {filteredNotices.length > 0 ? (
                  filteredNotices.map(notice => (
                    <tr key={notice.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border">
                        <Link href="#" className="text-blue-500 hover:underline">
                          {notice.title}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-2 border text-center">No notices found</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Latest Blogs Section */}
        <div className="bg-white p-6 shadow-md rounded-lg">
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
          )}
        </div>
      </div>
    </div>
  );
}
