import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';

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

  return (
    <>
      <PageHeader
        title={pageData.name}
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: `${pageData.name}` }
        ]}
      />
   <div className="max-w-7xl mx-auto p-4  mt-5 mb-5">
     
      <div className="content mb-8" dangerouslySetInnerHTML={{ __html: pageData.content }}></div>
      {pageData.metaImage && (
        <div>
          <img src={pageData.metaImage} alt="Meta Image" className="mb-4" />
        </div>
      )}
    </div>
    </>
  );
};

export default ViewPage;
