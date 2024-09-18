import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout';

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '') // Trim hyphens from the start
    .replace(/-+$/, ''); // Trim hyphens from the end
}

function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState({
    name: '',
    slug: '',
    description: ''
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data || []);  // Safeguard against undefined data
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      setError(error.message);
    }
  };

  const handleSaveCategory = async () => {
    const { name, slug, description } = categoryData;
    
    if (!name || !description) {
      toast.error('Name and description are required.');
      return;
    }

    const newCategory = {
      name,
      slug: slug || createSlug(name), // Generate slug if it's empty
      description
    };

    const method = editingCategory ? 'PUT' : 'POST';
    const response = await fetch(`/api/categories${editingCategory ? `?id=${editingCategory._id}` : ''}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCategory),
    });

    if (response.ok) {
      setCategoryData({ name: '', slug: '', description: '' });
      setEditingCategory(null);
      toast.success(`Category ${editingCategory ? 'updated' : 'added'} successfully!`);
      await fetchCategories(); // Reload categories after saving
    } else {
      const errorData = await response.json();
      console.error(`Error ${editingCategory ? 'updating' : 'adding'} category:`, errorData.error);
      setError(errorData.error);
      toast.error(`Error: ${errorData.error}`);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      await fetchCategories(); // Update the category list after deletion
      toast.success('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error.message);
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prevState => {
      const newState = { ...prevState, [name]: value };
      if (name === 'name' && !editingCategory) {
        newState.slug = createSlug(value);
      }
      return newState;
    });
  };

  const handleEdit = (category) => {
    setCategoryData({
      name: category.name || '',
      slug: category.slug || createSlug(category.name || ''),
      description: category.description || ''
    });
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setCategoryData({ name: '', slug: '', description: '' });
    setEditingCategory(null);
  };

  return (
    <Layout>
      <div className="container mx-auto p-5">
        <h2 className="text-2xl font-bold mb-5">Categories</h2>

        <div className="border p-4 rounded-lg shadow-md mb-5">
          <h3 className="text-xl font-semibold mb-3">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={categoryData.name}
              onChange={handleInputChange}
              className="mt-1 block p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">Slug</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={categoryData.slug}
              onChange={handleInputChange}
              className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={categoryData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            {editingCategory && (
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSaveCategory}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {editingCategory ? 'Update Category' : 'Add New Category'}
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-3">Categories List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(category)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    No categories available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {error && <div className="text-red-500 mt-4">Error: {error}</div>}
        <ToastContainer />
      </div>
    </Layout>
  );
}

export default Categories;
