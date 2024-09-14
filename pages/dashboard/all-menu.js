// pages/menus.js

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from './layout';

const MenuList = () => {
  const [menus, setMenus] = useState([]);

  // Fetch menus from the API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus');
        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error('Error fetching menus:', error);
      }
    };
    fetchMenus();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Menus List</h2>
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
              <tr key={menu._id} className="border-b border-gray-200 md:border-none block md:table-row">
                <td className="p-2 block md:table-cell">{menu.title}</td>
                <td className="p-2 block md:table-cell">{menu.link}</td>
                <td className="p-2 block md:table-cell">{menu.order}</td>
                <td className="p-2 block md:table-cell">{menu.status}</td>
                <td className="p-2 block md:table-cell">
                  <Link href={`/menus/edit/${menu._id}`}>
                    <p className="text-blue-500 hover:text-blue-700 mr-2">Edit</p>
                  </Link>
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

export default MenuList;
