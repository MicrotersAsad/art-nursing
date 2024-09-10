import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const ResultDetail = () => {
  const router = useRouter();
  const { slug } = router.query; // Extract slug from the URL
  const [result, setresult] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch result details by slug
  useEffect(() => {
    if (slug) {
      const fetchresult = async () => {
        try {
          const response = await fetch(`/api/result?slug=${slug}`);
          if (!response.ok) {
            throw new Error('Failed to fetch result details');
          }
          const data = await response.json();
          setresult(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchresult();
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
      <Link href="/results">
        <p className="text-blue-500 hover:underline mb-4 inline-block">← Back to results</p>
      </Link>
      {result ? (
        <div>
          <h1 className="text-2xl font-bold mb-4">{result.title}</h1>
          <p><strong>Department:</strong> {getDepartmentName(result.department)}</p>
          <p><strong>Date:</strong> {new Date(result.date).toLocaleDateString()}</p>
          <div dangerouslySetInnerHTML={{ __html: result.content }} />
          {result.filePath ? (
            <a href={`/uploads/${result.filePath.split('/').pop()}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">View PDF</a>
          ) : (
            <p>No PDF available</p>
          )}
        </div>
      ) : (
        <p>No result found.</p>
      )}
    </div>
  );
};

export default ResultDetail;
