import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from './layout';

const AllPage = () => {
  const [pages, setPages] = useState([]);
  const router = useRouter();

  // Fetch all pages from the API
  useEffect(() => {
    const fetchPages = async () => {
      const response = await fetch('/api/pages');
      const data = await response.json();
      setPages(data);
    };

    fetchPages();
  }, []);

  const handleDelete = async (slug) => {
    console.log('Deleting page with slug:', slug);  // Check if slug is being passed correctly
    
    const confirmDelete = confirm('Are you sure you want to delete this page?');
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/pages?slug=${slug}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Check if response is ok (2xx)
        if (!response.ok) {
          const errorResponse = await response.json();  // Parse error response
          alert(`Failed to delete the page: ${errorResponse.message}`);
        } else {
          const data = await response.json();  // Expect a JSON response
          alert(data.message);  // Show success message
          // Remove the deleted page from the state to update the UI
          setPages(pages.filter(page => page.slug !== slug));
        }
      } catch (error) {
        console.error('Error deleting page:', error);
        alert('An error occurred while trying to delete the page');
      }
    }
  };
  
  
  return (
    <Layout>


    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Page Management</h1>
      <div className="flex justify-end mb-4">
        <Link href="/admin/pages/create">
          <button className="bg-blue-500 text-white py-2 px-4 rounded">
            Add New Page
          </button>
        </Link>
      </div>
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Slug</th>
            <th className="border px-4 py-2">Meta Title</th>
            <th className="border px-4 py-2">Meta Description</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pages.map((page) => (
            <tr key={page._id}>
              <td className="border px-4 py-2">{page.name}</td>
              <td className="border px-4 py-2">{page.slug}</td>
              <td className="border px-4 py-2">{page.metaTitle}</td>
              <td className="border px-4 py-2">{page.metaDescription}</td>
              <td className="border px-4 py-2">
                <Link href={`/dashboard/edit/${page.slug}`}>
                  <button className="bg-green-500 text-white py-1 px-2 rounded mr-2">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(page.slug)} // Pass slug instead of _id
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
                <Link href={`/${page.slug}`}>
                  <button className="bg-blue-500 text-white py-1 px-2 rounded ml-2">
                    View
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </Layout>
  );
};

export default AllPage;
