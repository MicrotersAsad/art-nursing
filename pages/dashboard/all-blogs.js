import React, { useState, useEffect } from 'react';
import Layout from './layout';
import Link from 'next/link';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(''); // Single select
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [selectedBlogs, setSelectedBlogs] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchBlogs();
  }, [showDrafts]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
    setLoading(false);
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/blogs');
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error.message);
    }
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const response = await fetch(`/api/blogs?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete blog');
        }
        setBlogs(blogs.filter((blog) => blog._id !== id));
        toast.success('Blog deleted successfully!');
      } catch (error) {
        console.error('Error deleting blog:', error.message);
        toast.error('Failed to delete blog');
      }
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const categoryMatch = !selectedCategory || selectedCategory === 'All' || blog.category.includes(selectedCategory);
    const searchMatch = !search || blog.title.toLowerCase().includes(search.toLowerCase());
    const draftMatch = showDrafts ? blog.isDraft : !blog.isDraft;
    return categoryMatch && searchMatch && draftMatch;
  });

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handleClick = (event, pageNumber) => {
    event.preventDefault();
    setCurrentPage(pageNumber);
  };

  const handleSelectBlog = (blogId) => {
    if (selectedBlogs.includes(blogId)) {
      setSelectedBlogs(selectedBlogs.filter(id => id !== blogId));
    } else {
      setSelectedBlogs([...selectedBlogs, blogId]);
    }
  };

  const handleSelectAllBlogs = () => {
    if (selectedBlogs.length === currentBlogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(currentBlogs.map(blog => blog._id));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-5">
        <h2 className="text-3xl font-semibold mb-6">All Blogs</h2>
        <div className="mb-3 flex flex-wrap items-center">
          <input
            type="text"
            placeholder="Search by title"
            value={search}
            onChange={handleSearchChange}
            className="block appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-sm leading-tight focus:outline-none focus:border-blue-500 mb-3 md:mb-0"
          />
          <div className="relative ml-0 md:ml-3 mb-3 md:mb-0">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="block appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-sm leading-tight focus:outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="relative ml-0 md:ml-3 mb-3 md:mb-0 flex items-center">
            <label className="mr-2">Show Drafts</label>
            <input
              type="checkbox"
              checked={showDrafts}
              onChange={(e) => setShowDrafts(e.target.checked)}
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedBlogs.length === currentBlogs.length}
                      onChange={handleSelectAllBlogs}
                    />
                  </th>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Views</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
  {currentBlogs.map((blog) => {
    // Find the category name based on the blog's category ID
    const categoryName = categories.find(category => category._id === blog.category)?.name || 'Unknown';

    return (
      <tr key={blog._id}>
        <td className="py-2 px-4 border-b">
          <input
            type="checkbox"
            checked={selectedBlogs.includes(blog._id)}
            onChange={() => handleSelectBlog(blog._id)}
          />
        </td>
        <td className="py-2 px-4 border-b">{blog.title}</td>
        {/* Display the matched category name */}
        <td className="py-2 px-4 border-b">{categoryName}</td>
        <td className="py-2 px-4 border-b">
          <span className="flex items-center">
            <FaEye className="mr-1" /> {blog.viewCount}
          </span>
        </td>
        <td className="py-2 px-4 border-b flex items-center justify-center">
          <Link href={`/dashboard/edit-blog?id=${blog._id}`}>
            <button className="mr-3 text-blue-500 hover:text-blue-700">
              <FaEdit />
            </button>
          </Link>
          <button onClick={() => handleDelete(blog._id)} className="text-red-500 hover:text-red-700">
            <FaTrash />
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

            </table>
            <div className="flex justify-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={(event) => handleClick(event, index + 1)}
                  className={`mx-1 px-3 py-1 border rounded ${index + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 hover:bg-blue-100'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </Layout>
  );
}

export default AllBlogs;
