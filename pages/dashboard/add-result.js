import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './layout';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamically import the Quill editor to prevent SSR issues
const QuillWrapper = dynamic(() => import('../../components/EditorWrapper'), { ssr: false });

const ResultDashboard = () => {
  const [notices, setNotices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    department: '',
    pdf: null,
    content: '', // For the rich text editor content
  });
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false); // New state for editing
  const [currentEditId, setCurrentEditId] = useState(null); // Store the ID of the notice being edited
  const [existingPdfPath, setExistingPdfPath] = useState(null); // Store the existing PDF path when editing

  // Fetch existing notices
  useEffect(() => {
    async function fetchNotices() {
      try {
        const response = await axios.get('/api/result');
        setNotices(response.data);
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotices();
  }, []);

  // Fetch existing departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/department');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      department: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      pdf: e.target.files[0],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      content: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const formDataObj = new FormData();
    formDataObj.append('title', formData.title);
    formDataObj.append('department', formData.department);
    formDataObj.append('date', formData.date);
    formDataObj.append('content', formData.content);

    if (formData.pdf) {
      formDataObj.append('file', formData.pdf); // If a new PDF is uploaded, add it to the form data
    }

    try {
      if (editing) {
        // Edit existing notice
        const response = await axios.put(`/api/result`, {
          id: currentEditId,
          title: formData.title,
          department: formData.department,
          date: formData.date,
          content: formData.content,
          existingPdf: existingPdfPath, // Send the existing PDF path if no new file is uploaded
        });
        const updatedNotices = notices.map((notice) =>
          notice._id === currentEditId ? response.data.notice : notice
        );
        setNotices(updatedNotices);
        setEditing(false);
        setCurrentEditId(null);
        setExistingPdfPath(null); // Reset existing PDF path after editing
      } else {
        // Create new notice
        const response = await axios.post('/api/result', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setNotices((prevNotices) => [...prevNotices, response.data.notice]);
      }

      setFormData({
        title: '',
        date: '',
        department: '',
        pdf: null,
        content: '', // Reset the editor content
      });
    } catch (error) {
      console.error('Error uploading result:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (notice) => {
    setFormData({
      title: notice.title,
      department: notice.department,
      date: new Date(notice.date).toISOString().substring(0, 10), // Format date
      content: notice.content,
      pdf: null, // PDF can't be edited, so initialize it as null
    });
    setEditing(true);
    setCurrentEditId(notice._id);
    setExistingPdfPath(notice.filePath); // Store the existing PDF path for later reference
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/result?id=${id}`);
      setNotices(notices.filter((notice) => notice._id !== id));
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  return (
    <Layout>
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            {editing ? 'Edit Result' : 'Result Dashboard'}
          </h1>

          {/* Upload Form */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{editing ? 'Edit Notice' : 'Upload New Notice'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6">
                <label htmlFor="category" className="block mb-2 text-lg font-medium">Select Department*</label>
                <select
                  id="category"
                  onChange={handleDepartmentChange}
                  value={selectedDepartment}
                  className="w-full border border-gray-300 rounded-lg p-3 shadow-sm"
                >
                  <option value="" disabled>Select a Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department._id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter the title"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="mt-2 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                />
              </div>

              {/* Existing PDF display */}
              {existingPdfPath && !formData.pdf && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Existing PDF:</p>
                  <Link
                    href={`/uploads/${existingPdfPath.split('/').pop()}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </Link>
                </div>
              )}

              <div>
                <label className="block text-lg font-medium text-gray-700">Upload New PDF (optional)</label>
                <input
                  type="file"
                  name="pdf"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="mt-2 block w-full text-sm text-gray-500"
                />
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-lg font-medium text-gray-700">Result</label>
                <div className="mt-2">
                  <QuillWrapper
                    value={formData.content}
                    onChange={handleContentChange}
                    theme="snow"
                    className="bg-white shadow-sm"
                    placeholder="Write your notice content here..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : editing ? 'Update Result' : 'Upload Result'}
                </button>
              </div>
            </form>
          </div>

          {/* Display Notices in a Table */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Result</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-left text-gray-700 font-medium">Department</th>
                    <th className="py-2 px-4 border-b text-left text-gray-700 font-medium">Title</th>
                    <th className="py-2 px-4 border-b text-left text-gray-700 font-medium">Date</th>
                    <th className="py-2 px-4 border-b text-left text-gray-700 font-medium">Content</th>
                    <th className="py-2 px-4 border-b text-left text-gray-700 font-medium">PDF</th>
                    <th className="py-2 px-4 border-b text-left text-gray-700 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
  {notices.length === 0 ? (
    <tr>
      <td colSpan="5" className="text-center py-4 text-gray-600">
        No Result available.
      </td>
    </tr>
  ) : (
    notices.map((notice) => {
      const departmentName = departments.find(dept => dept._id === notice.department)?.name || "Unknown Result";

      return (
        <tr key={notice._id} className="border-t">
          <td className="py-2 px-4">{departmentName}</td>
          <td className="py-2 px-4">{notice.title}</td>
          <td className="py-2 px-4">{new Date(notice.date).toLocaleDateString()}</td>
          <td className="py-2 px-4 text-sm text-gray-600">
            <div dangerouslySetInnerHTML={{ __html: notice.content }} />
          </td>
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
          <td className="py-2 px-4">
            <button
              onClick={() => handleEdit(notice)}
              className="text-blue-500 hover:text-blue-700 mr-4"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(notice._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </td>
        </tr>
      );
    })
  )}
</tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResultDashboard;
