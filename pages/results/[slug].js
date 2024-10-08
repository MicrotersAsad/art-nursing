import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const ResultDetail = ({ result, departments, error }) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState('');

  useEffect(() => {
    setFilteredData(result.content); // Initially show all data
  }, [result.content]);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    // Parse the content into a DOM structure to manipulate it
    const table = document.createElement('div');
    table.innerHTML = result.content;

    // Get all rows except the first one in tbody (excluding the first tr)
    const rows = table.querySelectorAll('tbody tr');
    
    // Skip the first row and apply filtering only to subsequent rows
    rows.forEach((row, index) => {
      if (index === 0) return; // Skip the first row

      const rowText = row.textContent.toLowerCase();
      if (rowText.includes(term)) {
        row.style.display = ''; // Show row if it matches
      } else {
        row.style.display = 'none'; // Hide row if it doesn't match
      }
    });

    // Set the modified HTML back as filtered data
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

    // Convert the HTML table to a worksheet
    const workbook = XLSX.utils.table_to_book(table, { sheet: 'Sheet1' });

    // Generate excel file and trigger download
    XLSX.writeFile(workbook, 'result-data.xlsx');
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

          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search table data..."
            className="mb-4 p-2 border border-gray-300 rounded"
          />

          {/* Render dynamic content with filtered data */}
          <div className="result-content" dangerouslySetInnerHTML={{ __html: filteredData }} />

          {/* Button to download data as Excel */}
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

          {/* Global CSS Styling */}
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
