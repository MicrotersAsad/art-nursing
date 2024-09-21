// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import axios from 'axios';

// export default function ProgrammeDetails() {
//   const router = useRouter();
//   const { slug } = router.query;

//   const [program, setProgram] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

  // useEffect(() => {
  //   if (slug) {
  //     axios.get(`/api/programme/${slug}`)
  //       .then(response => {
  //         setProgram(response.data.data);
  //         console.log(program);
          
  //         setLoading(false);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching program:', error);
  //         setError('Failed to fetch program details');
  //         setLoading(false);
  //       });
  //   }
  // }, [slug]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

//   if (!program) {
//     return <div>No Program Found</div>;
//   }

//   return (
//     <div className="container mx-auto p-6 grid grid-cols-12 gap-4">
//       <div className="col-span-3 bg-gray-50 p-4 border rounded-lg">
//         <h2 className="font-bold text-lg mb-4">Related Menus</h2>
//         {/* Related links */}
//       </div>

//       <div className="col-span-9 bg-white p-6 border rounded-lg">
//         <h1 className="text-3xl font-bold mb-4">{program.name}</h1>

//         <section className="mb-6">
//           <h2 className="text-xl font-semibold mb-2">Program Description</h2>
//           <p>{program.description || 'No description available'}</p>
//         </section>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function ProgrammeDetails() {
  const router = useRouter();
  const { slug } = router.query; // Get the slug from the query parameters

  const [program, setProgram] = useState(null);  // State to hold program details
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);      // Error state

  useEffect(() => {
    if (slug) {
      axios.get(`/api/programme/${slug}`)
        .then(response => {
          setProgram(response.data.data);
          console.log(program);
          
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching program:', error);
          setError('Failed to fetch program details');
          setLoading(false);
        });
    }
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!program) {
    return <div>No Program Found</div>;
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-12 gap-4">
      {/* Sidebar Section */}
      <div className="col-span-3 bg-gray-50 p-4 border rounded-lg">
        {/* Related Menus */}
        <h2 className="font-bold text-lg mb-4">Related Menus</h2>
        <ul className="space-y-2">
          <li><a href="#department" className="text-blue-600">About the Program</a></li>
          <li><a href="#" className="text-blue-600">Faculty Members</a></li>
          <li><a href="#" className="text-blue-600">Class Videos</a></li>
          <li><a href="#" className="text-blue-600">Faculty Members</a></li>
          <li><a href="#" className="text-blue-600">Computer Labs</a></li>
        </ul>

        {/* Related Categories */}
        <h2 className="font-bold text-lg mt-6 mb-4">Related Categories</h2>
        <ul className="space-y-2">
          <li><a href="#" className="text-red-600">Department of Computer Science and Engineering</a></li>
          <li><a href="#" className="text-red-600">Department of Electrical and Electronic Engineering</a></li>
          <li><a href="#" className="text-red-600">Department of Textile Engineering</a></li>
          <li><a href="#" className="text-red-600">Department of English</a></li>
          <li><a href="#" className="text-red-600">Department of Business Administration (BBA)</a></li>
        </ul>
      </div>

      {/* Main Content Section */}
      <div className="col-span-9 bg-white p-6 border rounded-lg">
        <h1 className="text-3xl font-bold mb-4">{program.name}</h1>

        {/* departmentInfo */}
        <section className="mb-6">
          <h2 id='department' className="text-xl font-semibold mb-2">About the Department/Program</h2>
          <div className="my-4" dangerouslySetInnerHTML={{ __html: program.departmentInfo }} />
        </section>

        {/* Mission */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">The mission of the Program Offering Entity</h2>
          <div className="my-4" dangerouslySetInnerHTML={{ __html: program.departmentInfo }} />
        </section>

        {/* Objectives */}
        {/* <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Objectives of the Program Offering Entity</h2>
          <ul className="list-disc list-inside">
            {program.objectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </section> */}

        {/* Program Description */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Description of the Program</h2>
          <div className="my-4" dangerouslySetInnerHTML={{ __html: program.departmentInfo }} />
        </section>
      </div>
    </div>
  );
}
