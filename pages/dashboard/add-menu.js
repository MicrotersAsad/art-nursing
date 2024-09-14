// pages/menus.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './layout';
import Link from 'next/link';

const MenuManagement = () => {
  const [menuData, setMenuData] = useState({
    title: '',
    link: '',
    openIn: '_self',
    order: '',
    parentMenuId: '',
    status: 'active',
  });
  const [parentMenus, setParentMenus] = useState([]);
  const [menus, setMenus] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editMenuId, setEditMenuId] = useState(null);
  const router = useRouter();

  // Fetch menus and parent menus
  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('/api/menus');
      const menus = await response.json();
      setMenus(menus);
      setParentMenus(menus);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!menuData.title || !menuData.link || !menuData.openIn || menuData.order === '') {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await fetch(`/api/menus${isEditing ? `?id=${editMenuId}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...menuData,
          order: parseInt(menuData.order, 10),
        }),
      });

      if (response.ok) {
        alert(`Menu ${isEditing ? 'updated' : 'created'} successfully`);
        setMenuData({
          title: '',
          link: '',
          openIn: '_self',
          order: '',
          parentMenuId: '',
          status: 'active',
        });
        setIsEditing(false);
        setEditMenuId(null);
        fetchMenus(); // Refresh the menu list
      } else {
        const result = await response.json();
        alert(`Failed to ${isEditing ? 'update' : 'create'} menu: ${result.message}`);
      }
    } catch (error) {
      alert(`Error ${isEditing ? 'updating' : 'creating'} menu`);
      console.error(error);
    }
  };

  // Handle edit
  const handleEdit = (menu) => {
    setMenuData({
      title: menu.title,
      link: menu.link,
      openIn: menu.openIn || '_self',
      order: menu.order || '',
      parentMenuId: menu.parentMenuId || '',
      status: menu.status,
    });
    setIsEditing(true);
    setEditMenuId(menu._id);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this menu?')) {
      try {
        const response = await fetch(`/api/menus?id=${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setMenus(menus.filter((menu) => menu._id !== id));
          alert('Menu deleted successfully');
        } else {
          alert('Failed to delete menu');
        }
      } catch (error) {
        console.error('Error deleting menu:', error);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          {isEditing ? 'Edit Menu Item' : 'Add Menu Item'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label className="block text-gray-700">Title*</label>
            <input
              type="text"
              value={menuData.title}
              onChange={(e) => setMenuData({ ...menuData, title: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Link */}
          <div className="mb-4">
            <label className="block text-gray-700">Link*</label>
            <input
              type="text"
              value={menuData.link}
              onChange={(e) => setMenuData({ ...menuData, link: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Open In */}
          <div className="mb-4">
            <label className="block text-gray-700">Open In*</label>
            <select
              value={menuData.openIn}
              onChange={(e) => setMenuData({ ...menuData, openIn: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="_self">Same Tab</option>
              <option value="_blank">New Tab</option>
            </select>
          </div>

          {/* Order */}
          <div className="mb-4">
            <label className="block text-gray-700">Order*</label>
            <input
              type="number"
              value={menuData.order}
              onChange={(e) => setMenuData({ ...menuData, order: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Parent Menu */}
          <div className="mb-4">
            <label className="block text-gray-700">Parent Menu</label>
            <select
              value={menuData.parentMenuId}
              onChange={(e) => setMenuData({ ...menuData, parentMenuId: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="">None</option>
              {parentMenus.map((menu) => (
                <option key={menu._id} value={menu._id}>
                  {menu.title}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-gray-700">Status*</label>
            <select
              value={menuData.status}
              onChange={(e) => setMenuData({ ...menuData, status: e.target.value })}
              required
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Update Menu' : 'Create Menu'}
          </button>
        </form>

        {/* Menu Listing Table */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 mt-12">Menus List</h2>
        <table className="min-w-full border-collapse block md:table">
          <thead className="block md:table-header-group">
            <tr className="border-b border-gray-200 md:border-none block md:table-row">
              <th className="p-2 text-left font-medium text-gray-600 block md:table-cell">Title</th>
              <th className="p-2 text-left font-medium text-gray-600 block md:table-cell">Link</th>
              <th className="p-2 text-left font-medium text-gray-600 block md:table-cell">Order</th>
              <th className="p-2 text-left font-medium text-gray-600 block md:table-cell">Status</th>
              <th className="p-2 text-left font-medium text-gray-600 block md:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {menus.map((menu) => (
              <tr
                key={menu._id}
                className="border-b border-gray-200 md:border-none block md:table-row"
              >
                <td className="p-2 block md:table-cell">{menu.title}</td>
                <td className="p-2 block md:table-cell">{menu.link}</td>
                <td className="p-2 block md:table-cell">{menu.order}</td>
                <td className="p-2 block md:table-cell">{menu.status}</td>
                <td className="p-2 block md:table-cell">
                  <button
                    onClick={() => handleEdit(menu)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(menu._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default MenuManagement;
