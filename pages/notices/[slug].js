import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader for loading state

const NoticeDetail = ({ notice, departments, error }) => {
  const [loading, setLoading] = useState(false);

  // Function to get department name from department ID
  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#3498db"} loading={loading} />
      </div>
    );
  }

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

// Server-side rendering using getServerSideProps
export async function getServerSideProps(context) {
  const { req, query } = context;
  const { slug } = query;

  let notice = null;
  let departments = [];
  let error = null;

  try {
    // Determine the protocol (http or https) based on the request headers
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host;

    // Fetch the notice details based on the slug
    const noticeResponse = await fetch(`${protocol}://${host}/api/notice?slug=${slug}`, {
      headers: {
        // Pass request headers if needed (e.g., for authentication)
        Authorization: req.headers.authorization || '', // Example for including authorization headers
      },
    });

    if (!noticeResponse.ok) {
      throw new Error('Failed to fetch notice details');
    }
    notice = await noticeResponse.json();

    // Fetch the departments
    const departmentResponse = await fetch(`${protocol}://${host}/api/department`, {
      headers: {
        Authorization: req.headers.authorization || '',
      },
    });

    if (!departmentResponse.ok) {
      throw new Error('Failed to fetch departments');
    }
    departments = await departmentResponse.json();
  } catch (err) {
    error = err.message;
  }

  return {
    props: {
      notice,
      departments,
      error,
    },
  };
}

export default NoticeDetail;
