import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Layout from './layout';

// Dynamically import the QuillWrapper component with SSR disabled
const QuillWrapper = dynamic(() => import('../../components/EditorWrapper'), { ssr: false });

function About() {
  const [quillContent, setQuillContent] = useState('');
  const [existingContent, setExistingContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [existingMetaTitle, setExistingMetaTitle] = useState('');
  const [existingMetaDescription, setExistingMetaDescription] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/about');
        if (!response.ok) {
          throw new Error('Failed to fetch content');
        }
        const data = await response.json();
        setQuillContent(data?.content || '');
        setMetaTitle(data?.metaTitle || '');
        setMetaDescription(data?.metaDescription || '');
        setExistingContent(data?.content || '');
        setExistingMetaTitle(data?.metaTitle || '');
        setExistingMetaDescription(data?.metaDescription || '');
      } catch (error) {
        console.error('Error fetching content:', error.message);
        setError(error.message);
      }
    };

    fetchContent();
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: quillContent, metaTitle, metaDescription }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to post content: ${errorMessage}`);
      }

      // Handle success
      setError(null);
      setExistingContent(quillContent);
      setExistingMetaTitle(metaTitle);
      setExistingMetaDescription(metaDescription);
    } catch (error) {
      console.error('Error posting content:', error.message);
      setError(error.message);
    }
  }, [quillContent, metaTitle, metaDescription]);

  const handleQuillChange = useCallback((newContent) => {
    setQuillContent(newContent);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-5">
        <h2 className="text-2xl font-bold mb-4">Edit About Us Page Content</h2>
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}
        <div className="mb-4">
          <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700">
            Meta Title
          </label>
          <input
            type="text"
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700">
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            rows="3"
          />
        </div>
        <QuillWrapper initialContent={quillContent} onChange={handleQuillChange} />
        <button
          className="btn btn-primary p-2 mt-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit Content
        </button>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">About Us Content</h2>
          <p className="text-sm font-medium text-gray-700">Meta Title: {existingMetaTitle}</p>
          <p className="text-sm font-medium text-gray-700">Meta Description: {existingMetaDescription}</p>
          <div dangerouslySetInnerHTML={{ __html: existingContent }} className="prose"></div>
        </div>
      </div>
    </Layout>
  );
}

export default About;
