import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Layout from '../layout';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

// Dynamically load Quill editor (only on client-side)
const QuillWrapper = dynamic(() => import('../../../components/EditorWrapper'), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
];

const EditPage = () => {
  const [pageData, setPageData] = useState({
    name: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
  });

  const [content, setContent] = useState(''); // Manage content separately for Quill
  const [metaImage, setMetaImage] = useState(null); // Meta image state
  const [existingMetaImage, setExistingMetaImage] = useState(''); // Existing image
  const router = useRouter();
  const { slug } = router.query;

  // Fetch existing page data when the component loads
  useEffect(() => {
    if (slug) {
      fetch(`/api/pages?slug=${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setPageData(data);
          setContent(data.content); // Set content for Quill editor
          setExistingMetaImage(data.metaImage); // Set existing meta image
        })
        .catch((error) => console.error('Error fetching page:', error));
    }
  }, [slug]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(); // Create FormData for file upload
    formData.append('id', pageData._id); // Include page ID for update
    formData.append('name', pageData.name);
    formData.append('slug', pageData.slug);
    formData.append('content', content); // Include the content from Quill editor
    formData.append('metaTitle', pageData.metaTitle);
    formData.append('metaDescription', pageData.metaDescription);

    if (metaImage) {
      formData.append('metaImage', metaImage); // Append new image if available
    } else {
      formData.append('existingMetaImage', existingMetaImage); // Use existing image if no new one is selected
    }

    const response = await fetch(`/api/pages`, {
      method: 'PUT',
      body: formData, // Send FormData including file and page data
    });

    if (response.ok) {
      alert('Page updated successfully');
      
    } else {
      alert('Failed to update page');
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setMetaImage(e.target.files[0]); // Update meta image state
  };

  // Handle changes in the Quill editor
  const handleQuillChange = (value) => {
    const sanitizedValue = DOMPurify.sanitize(value); // Sanitize content from Quill editor
    setContent(sanitizedValue); // Update content state when Quill changes
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Edit Page</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Page Name</label>
            <input
              type="text"
              value={pageData.name}
              onChange={(e) => setPageData({ ...pageData, name: e.target.value })}
              required
              className="w-full p-2 border"
            />
          </div>
          <div className="mb-4">
            <label>Slug</label>
            <input
              type="text"
              value={pageData.slug}
              onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
              required
              className="w-full p-2 border"
            />
          </div>

          {/* Quill Editor for Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block font-medium mb-2">
              Content*
            </label>
            <div className="border border-gray-300 rounded-lg shadow-sm p-3">
              <QuillWrapper initialContent={content} onChange={handleQuillChange} modules={modules} formats={formats} />
            </div>
          </div>

          <div className="mb-4">
            <label>Meta Title</label>
            <input
              type="text"
              value={pageData.metaTitle}
              onChange={(e) =>
                setPageData({ ...pageData, metaTitle: e.target.value })
              }
              required
              className="w-full p-2 border"
            />
          </div>
          <div className="mb-4">
            <label>Meta Description</label>
            <textarea
              value={pageData.metaDescription}
              onChange={(e) =>
                setPageData({ ...pageData, metaDescription: e.target.value })
              }
              required
              className="w-full p-2 border"
            />
          </div>

          {/* Meta Image Upload */}
          <div className="mb-4">
            <label>Meta Image</label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full p-2 border"
            />
            {/* Show the existing meta image if available */}
            {existingMetaImage && (
              <div className="mt-4">
                <p>Existing Image:</p>
                <Image width={40} height={40} src={existingMetaImage} alt="Existing Meta" className="w-48 h-auto" />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Update Page
          </button>

          {/* Render sanitized content */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Preview:</h2>
            <div className="content-container border p-4">
              {parse(content)}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditPage;
