import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import ClipLoader from 'react-spinners/ClipLoader'; // Import ClipLoader from react-spinners

const ResultDetail = ({ result, departments, error }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (result.content) {
      setFilteredData(result.content); // Initially show all data
      setLoading(false); // Data loaded, set loading to false
    }
  }, [result.content]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const table = document.createElement('div');
    table.innerHTML = result.content;

    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach((row, index) => {
      if (index === 0) return;
      const rowText = row.textContent.toLowerCase();
      row.style.display = rowText.includes(term) ? '' : 'none';
    });

    setFilteredData(table.innerHTML);
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept._id === departmentId);
    return department ? department.name : 'Unknown Department';
  };

  const downloadExcel = () => {
    const table = document.querySelector('.result-content table');
    if (!table) {
      alert('No data to export');
      return;
    }

    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' });
    XLSX.writeFile(workbook, 'result-data.xlsx');
  };

  if (error) return <p>Error: {error}</p>;

  if (loading) {
    // Show ClipLoader when loading state is true
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={150} color={"#3498db"} loading={loading} />
      </div>
    );
  }

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

          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search table data..."
            className="mb-4 p-2 border border-gray-300 rounded"
          />

          <div className="result-content" dangerouslySetInnerHTML={{ __html: filteredData }} />

          <button
            onClick={downloadExcel}
            className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Download as Excel
          </button>

          {result.filePath ? (
            <a href={`/uploads/${result.filePath.split('/').pop()}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">View PDF</a>
          ) : (
            <p>No PDF available</p>
          )}

          <style jsx global>{`
            .result-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 1rem;
              text-align: left;
            }

            .result-content table th,
            .result-content table td {
              border: 1px solid #ddd;
              padding: 12px 15px;
            }

            .result-content table th {
              background-color: #f4f4f4;
              font-weight: bold;
            }

            .result-content table tr:nth-child(even) {
              background-color: #f9f9f9;
            }

            .result-content table tr:hover {
              background-color: #f1f1f1;
            }

            .result-content table td {
              word-wrap: break-word;
              max-width: 300px;
            }
          `}</style>
        </div>
      ) : (
        <p>No result found.</p>
      )}
    </div>
  );
};

export async function getServerSideProps(context) {
  const { req, query } = context;
  const { slug } = query;
  let result = null;
  let departments = [];
  let error = null;

  try {
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host;

    const resultResponse = await fetch(`${protocol}://${host}/api/result?slug=${slug}`);
    if (!resultResponse.ok) {
      throw new Error('Failed to fetch result details');
    }
    result = await resultResponse.json();

    const departmentResponse = await fetch(`${protocol}://${host}/api/department`);
    if (!departmentResponse.ok) {
      throw new Error('Failed to fetch departments');
    }
    departments = await departmentResponse.json();
  } catch (err) {
    error = err.message;
  }

  return {
    props: {
      result,
      departments,
      error,
    },
  };
}

export default ResultDetail;
