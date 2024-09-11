import Link from 'next/link';
import React, { useEffect, useState } from 'react';

export default function NoticesAndBlogs() {
  const [notices, setNotices] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [searchTermNotices, setSearchTermNotices] = useState('');
  const [searchTermBlogs, setSearchTermBlogs] = useState('');
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [visibleNotices, setVisibleNotices] = useState(5); // Number of notices initially visible
  const [visibleBlogs, setVisibleBlogs] = useState(5); // Number of blogs initially visible

  // Fetch notices from API
  useEffect(() => {
    async function fetchNotices() {
      try {
        const response = await fetch('/api/notice');
        const data = await response.json();
        setNotices(data);
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
        setBlogs(data);
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

  // Infinite Scroll for Notices
  const handleScrollNotices = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    setVisibleNotices((prevVisible) => prevVisible + 5); // Show 5 more notices on scroll
  };

  // Infinite Scroll for Blogs
  const handleScrollBlogs = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    )
      return;
    setVisibleBlogs((prevVisible) => prevVisible + 5); // Show 5 more blogs on scroll
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScrollNotices);
    window.addEventListener('scroll', handleScrollBlogs);
    return () => {
      window.removeEventListener('scroll', handleScrollNotices);
      window.removeEventListener('scroll', handleScrollBlogs);
    };
  }, []);

  return (
    <div className="w-full bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notices Section */}
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
              <div className="max-h-48 overflow-y-auto">
                {filteredNotices.length === 0 ? (
                  <div className="text-center py-4 text-gray-600">No notices available.</div>
                ) : (
                  filteredNotices.slice(0, visibleNotices).map((notice) => (
                    <div key={notice._id} className="flex items-center mb-4">
                      {/* Date Box */}
                      <div className="flex flex-col items-center justify-center text-white rounded-md overflow-hidden w-20 h-20">
                        <div className="bg-blue-900 w-full text-center py-1 text-3xl font-bold">
                          {new Date(notice.date).getDate()}
                        </div>
                        <div className="bg-blue-500 w-full text-center py-1 text-xs">
                          {new Date(notice.date).toLocaleString('default', { month: 'short' })}-{new Date(notice.date).getFullYear()}
                        </div>
                      </div>
                      {/* Notice Title */}
                      <div className="ml-4">
                        <Link
                          href={`notices/${notice?.slug}`}
                          className="text-blue-600 hover:underline font-medium"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {notice.title}
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Blogs Section */}
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
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-4 text-gray-600">No blogs available.</div>
              ) : (
                filteredBlogs.slice(0, visibleBlogs).map((blog) => (
                  <div key={blog._id} className="flex items-center mb-4">
                    {/* Date Box */}
                    <div className="flex flex-col items-center justify-center text-white rounded-md overflow-hidden w-16 h-16">
                      <div className="bg-blue-900 w-full text-center py-1 text-xl font-bold">
                        {new Date(blog.date).getDate()}
                      </div>
                      <div className="bg-blue-500 w-full text-center py-1 text-xs">
                        {new Date(blog.date).toLocaleString('default', { month: 'short' })}-{new Date(blog.date).getFullYear()}
                      </div>
                    </div>
                    {/* Blog Title */}
                    <div className="ml-4">
                      <Link
                        href={`/blogs/${blog.id}`}
                        className="text-blue-600 hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {blog.title}
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
