import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { ClipLoader } from 'react-spinners';
import { FaArrowRight } from 'react-icons/fa';
import Head from 'next/head';

const BlogSection = ({ initialBlogs }) => {
  const [loading, setLoading] = useState(!initialBlogs.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [blogsData, setBlogsData] = useState(initialBlogs);
  const [categories, setCategories] = useState([]);
  const blogsPerPage = 9;

  const currentBlogs = blogsData.slice((currentPage - 1) * blogsPerPage, currentPage * blogsPerPage);
  const totalPages = Math.ceil(blogsData.length / blogsPerPage);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/blogs`);
      setBlogsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to fetch blogs.');
      setLoading(false);
    }
  }, []);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      console.log('Categories fetched:', response.data); // Debug log to check categories
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) {
      console.warn('Blog does not have a categoryId:', categoryId); // Logs when categoryId is missing
      return 'No Category';
    }

    const category = categories.find((cat) => cat._id === categoryId);
    
    if (!category) {
      console.warn(`No matching category found for ID: ${categoryId}`); // Logs if category is not found
      return 'Unknown Category';
    }

    return category.name;
  };

  useEffect(() => {
    if (!initialBlogs.length) {
      fetchBlogs();
    } else {
      setLoading(false);
    }
  }, [fetchBlogs, initialBlogs]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (blogsData.length === 0) {
    return <p>No blogs available.</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
      <Head>
        <title>YtubeTools Blog | Ytubetool</title>
        <meta name="description" content="Blog Page" />
        <meta property="og:url" content="https://ytubetools.com/blog" />
        <meta
          property="og:description"
          content="Enhance your YouTube experience with our comprehensive suite of tools designed for creators and viewers alike. Extract video summaries, titles, descriptions, and more. Boost your channel's performance with advanced features and insights."
        />
      </Head>

      <div className="container mx-auto px-4 p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-8">
          <div>
            {currentBlogs.slice(0, 1).map((blog, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                {blog.image && (
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={600}
                    height={400}
                    layout="responsive"
                    className="object-cover rounded-lg"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-3xl font-semibold mb-2">
                    <Link href={`/blog/${blog.slug}`} passHref>
                      <span className="text-blue-500 hover:underline">{blog.title}</span>
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4">{blog.description}</p>
                  <p className="text-gray-500 text-sm">By {blog.author} · {new Date(blog.createdAt).toLocaleDateString()}</p>
                  <div className="mt-2">
                    <span className="px-4 py-2">{getCategoryName(blog.category)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {currentBlogs.slice(1, 4).map((blog, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col md:flex-row">
                {blog.image && (
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={280}
                    height={100}
                    layout="responsive"
                    className="object-cover rounded-lg blog-img"
                  />
                )}
                <div className="p-4">
                  <h4 className="text-lg font-semibold">
                    <Link href={`/blog/${blog.slug}`} passHref>
                      <span className="text-blue-500 hover:underline">{blog.title}</span>
                    </Link>
                  </h4>
                  <p className="text-gray-500 text-sm">By {blog.author} · {new Date(blog.createdAt).toLocaleDateString()}</p>
                  <div className="mt-2">
                    <span className="px-4 py-2">{getCategoryName(blog.categoryId)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <nav className="block">
            <ul className="flex pl-0 rounded list-none flex-wrap">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index} className="page-item">
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`page-link ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  try {
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host;
    const apiUrl = `${protocol}://${host}/api/blogs`;
    const { data } = await axios.get(apiUrl);
    return {
      props: {
        initialBlogs: data,
      },
    };
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    return {
      props: {
        initialBlogs: [],
      },
    };
  }
}

export default BlogSection;
