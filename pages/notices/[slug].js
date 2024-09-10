import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const NoticeDetail = () => {
  const router = useRouter();
  const { slug } = router.query; // Extract slug from the URL
  const [notice, setNotice] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch notice details by slug
  useEffect(() => {
    if (slug) {
      const fetchNotice = async () => {
        try {
          const response = await fetch(`/api/notice?slug=${slug}`);
          if (!response.ok) {
            throw new Error('Failed to fetch notice details');
          }
          const data = await response.json();
          setNotice(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchNotice();
    }
  }, [slug]);

  // Fetch departments to get department name
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/department');
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }
        const data = await response.json();
        setDepartments(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchDepartments();
  }, []);

  // Function to get department name from department ID
  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

 
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 border mt-5 mb-5">
      <Link href="/notices">
        <p className="text-blue-500 hover:underline mb-4 inline-block">← Back to Notices</p>
      </Link>
      {notice ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">{notice.title}</h1>
          <p><strong>Department:</strong> {getDepartmentName(notice.department)}</p>
          <p><strong>Date:</strong> {new Date(notice.date).toLocaleDateString()}</p>
          <div dangerouslySetInnerHTML={{ __html: notice.content }} />
          {notice.filePath ? (
            <a href={`/uploads/${notice.filePath.split('/').pop()}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">View PDF</a>
          ) : (
            <p>No PDF available</p>
          )}
        </div>
      ) : (
        <p>No notice found.</p>
      )}
    </div>
  );
};

export default NoticeDetail;
