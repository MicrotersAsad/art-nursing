import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader for loading state

const ViewPage = ({ pageData, error }) => {
  const [loading, setLoading] = useState(false);

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  if (!pageData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#3498db"} loading={true} />
      </div>
    );
  }

  // Sanitize and parse content
  const sanitizedContent = DOMPurify.sanitize(pageData.content);

  return (
    <>
      <PageHeader
        title={pageData.name}
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: `${pageData.name}` }
        ]}
      />
      <div className="max-w-7xl mx-auto p-4 mt-5 mb-5">
        {/* Add the content-container class for proper styling */}
        <div className="content-container mb-8">{parse(sanitizedContent)}</div>
      </div>
    </>
  );
};

// Fetching data server-side using req.headers to construct the base URL
export async function getServerSideProps(context) {
  const { slug } = context.query;
  const { req } = context;
  let pageData = null;
  let error = null;

  try {
    // Determine protocol (http or https) based on req.headers
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host;

    // Fetch page data by slug
    const pageResponse = await fetch(`${protocol}://${host}/api/pages?slug=${slug}`, {
      headers: {
        Authorization: req.headers.authorization || '', // If authorization is needed
      },
    });

    if (!pageResponse.ok) {
      throw new Error('Failed to fetch page data');
    }

    pageData = await pageResponse.json();
  } catch (err) {
    error = err.message;
  }

  return {
    props: {
      pageData,
      error,
    },
  };
}

export default ViewPage;
