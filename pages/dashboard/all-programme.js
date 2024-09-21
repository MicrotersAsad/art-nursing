import { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from './layout';

const AllProgramme = () => {
  const [programmes, setProgrammes] = useState([]);
  const [error, setError] = useState(null);

  // Fetch all programs from the API
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await fetch('/api/programme');

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setProgrammes(data.data); // Assuming data contains an array of programs
      } catch (error) {
        console.error('Error fetching programs:', error);
        setError('Failed to fetch programs. Please try again.');
      }
    };

    fetchProgrammes();
  }, []);

  const handleDelete = async (slug) => {
    const confirmDelete = confirm('Are you sure you want to delete this program?');
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/programme?slug=${slug}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          alert(`Failed to delete the program: ${errorResponse.message}`);
        } else {
          const data = await response.json(); // Expect a JSON response
          alert(data.message);
          setProgrammes(programmes.filter(program => program.slug !== slug));
        }
      } catch (error) {
        console.error('Error deleting program:', error);
        alert('An error occurred while trying to delete the program');
      }
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Program Management</h1>
        <div className="flex justify-end mb-4">
          <Link href="/admin/programme/create">
            <button className="bg-blue-500 text-white py-2 px-4 rounded">Add New Program</button>
          </Link>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {!error && programmes.length === 0 && <p>No programs available.</p>}
        {programmes.length > 0 && (
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Slug</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((program) => (
                <tr key={program._id}>
                  <td className="border px-4 py-2">{program.name}</td>
                  <td className="border px-4 py-2">{program.slug}</td>
                  <td className="border px-4 py-2">
                    <Link href={`/dashboard/edit/${program.slug}`}>
                      <button className="bg-green-500 text-white py-1 px-2 rounded mr-2">Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(program.slug)}
                      className="bg-red-500 text-white py-1 px-2 rounded"
                    >
                      Delete
                    </button>
                    <Link href={`/programme/${program.slug}`}>
                      <button className="bg-blue-500 text-white py-1 px-2 rounded ml-2">View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
};

export default AllProgramme;
