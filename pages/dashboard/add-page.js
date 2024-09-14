import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from './layout';
// Dynamically load the Quill editor to prevent SSR issues
const QuillWrapper = dynamic(() => import('../../components/EditorWrapper'), { ssr: false });

const AddPage = () => {
  const [pageName, setPageName] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaImage, setMetaImage] = useState(null);
  const router = useRouter();

  // Automatically generate slug based on page name
  useEffect(() => {
    setSlug(
      pageName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with dashes
        .replace(/(^-|-$)+/g, '') // Remove leading or trailing dashes
    );
  }, [pageName]);

  // Handle the Quill editor content change
  const handleQuillChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pageName || !slug || !content || !metaTitle || !metaDescription) {
      alert('All fields are required!');
      return;
    }

    const formData = new FormData();
    formData.append('name', pageName);
    formData.append('slug', slug);
    formData.append('content', content);
    formData.append('metaTitle', metaTitle);
    formData.append('metaDescription', metaDescription);
    if (metaImage) {
      formData.append('metaImage', metaImage);
    }

    const response = await fetch('/api/pages', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      router.push('dashbaord/all-page');
    } else {
      alert('Error creating page');
    }
  };

  return (
    <Layout>

  
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Create New Page</h1>
      <form onSubmit={handleSubmit}>
        {/* Page Name Input */}
        <div className="mb-4">
          <label htmlFor="pageName" className="block font-medium mb-2">
            Page Name
          </label>
          <input
            id="pageName"
            type="text"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter page name"
          />
        </div>

        {/* Slug (Automatically Generated) */}
        <div className="mb-4">
          <label htmlFor="slug" className="block font-medium mb-2">
            Slug (Auto-Generated)
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            readOnly
            className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Quill Editor for Content */}
        <div className="mb-6">
          <label htmlFor="content" className="block font-medium mb-2">
            Content*
          </label>
          <div className="border border-gray-300 rounded-lg shadow-sm p-3">
            <QuillWrapper initialContent={content} onChange={handleQuillChange} />
          </div>
        </div>

        {/* Meta Title */}
        <div className="mb-4">
          <label htmlFor="metaTitle" className="block font-medium mb-2">
            Meta Title
          </label>
          <input
            id="metaTitle"
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter meta title"
          />
        </div>

        {/* Meta Description */}
        <div className="mb-4">
          <label htmlFor="metaDescription" className="block font-medium mb-2">
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter meta description"
          />
        </div>

        {/* Meta Image Upload */}
        <div className="mb-4">
          <label htmlFor="metaImage" className="block font-medium mb-2">
            Meta Image
          </label>
          <input
            id="metaImage"
            type="file"
            onChange={(e) => setMetaImage(e.target.files[0])}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Create Page
        </button>
      </form>
    </div>
    </Layout>
  );
};

export default AddPage;
