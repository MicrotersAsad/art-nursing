import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';

const ViewPage = () => {
  const router = useRouter();
  const { slug } = router.query; // Get slug from URL
  const [pageData, setPageData] = useState(null);

  useEffect(() => {
    if (slug) {
      // Fetch the page data by slug
      fetch(`/api/pages?slug=${slug}`)
        .then((res) => res.json())
        .then((data) => setPageData(data));
    }
  }, [slug]);

  if (!pageData) return <p>Loading...</p>;

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

export default ViewPage;
