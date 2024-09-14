import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from './layout';

const CreateMenuForm = () => {
  const [menuData, setMenuData] = useState({
    title: '',
    link: '',
    openIn: '_self',
    order: '',
    parentMenuId: '', // Changed from parentMenu to parentMenuId
    status: 'active',
  });
  const [parentMenus, setParentMenus] = useState([]);
  const router = useRouter();

  // Fetch parent menus (menus without a parentMenuId)
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('/api/menus');
        const menus = await response.json();
        setParentMenus(menus);
      } catch (error) {
        console.error('Error fetching parent menus:', error);
      }
    };
    fetchMenus();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...menuData,
          order: parseInt(menuData.order, 10),
        }),
      });

      if (response.ok) {
        alert('Menu created successfully');
        router.push('/admin/menus'); // Redirect to the menu listing page
      } else {
        const result = await response.json();
        alert(`Failed to create menu: ${result.message}`);
      }
    } catch (error) {
      alert('Error creating menu');
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add Menu Item</h2>
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
            Create Menu
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateMenuForm;
