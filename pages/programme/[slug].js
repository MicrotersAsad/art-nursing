import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import PageHeader from '../../components/PageHeader';

export default function ProgrammeDetails() {
  const router = useRouter();
  const { slug } = router.query;

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notices, setNotices] = useState([]);
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [noticeError, setNoticeError] = useState(null);

  // Fetch Program Details
  useEffect(() => {
    if (slug) {
      axios.get(`/api/programme/${slug}`)
        .then(response => {
          setProgram(response.data.data);
          setFacultyMembers(response.data.data.facultyMembers);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching program:', error);
          setError('Failed to fetch program details');
          setLoading(false);
        });
    }
  }, [slug]);

  // Fetch Notices
  useEffect(() => {
    axios.get(`/api/notice`)
      .then(response => {
        setNotices(response.data.slice(0, 5)); // Show only the first 5 notices
      })
      .catch(error => {
        console.error('Error fetching notices:', error);
        setNoticeError('Failed to fetch notices');
      });
  }, []);

  useEffect(() => {
    // Apply data-label to table cells dynamically
    const applyDataLabels = () => {
      const tables = document.querySelectorAll('.jodit-content table');
      tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          cells.forEach((cell, index) => {
            if (headers[index]) {
              cell.setAttribute('data-label', headers[index].textContent);
            }
          });
        });
      });
    };

    applyDataLabels(); // Apply when the component is mounted
  }, [program]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  if (!program) {
    return <div className="flex justify-center items-center h-screen">No Program Found</div>;
  }

  return (
    <>
      {/* Add the PageHeader component */}
      <PageHeader
        title="Programme"
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: `${program.name}` }
        ]}
      />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar Section - TOC */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-gray-50 p-4">
          <h2 className="font-bold text-lg sm:text-base mb-4 text-center">Table of Contents</h2>
          <ul className="space-y-2 ">
            <li><a href="#about-department" className="text-blue-600 hover:underline sm:text-sm">About the Program</a></li>
            <li><a href="#salient-features" className="text-blue-600 hover:underline sm:text-sm">Salient Features</a></li>
            <li><a href="#curriculum-structure" className="text-blue-600 hover:underline sm:text-sm">Curriculum Structure</a></li>
            <li><a href="#eligibility-requirements" className="text-blue-600 hover:underline sm:text-sm">Eligibility & Admission</a></li>
            <li><a href="#tuition-fees" className="text-blue-600 hover:underline sm:text-sm">Tuition Fees</a></li>
          </ul>
          <hr className='mt-3 mb-3' />
          {/* Notices Section */}
          <h2 className="font-bold text-lg sm:text-base mt-6 mb-4 text-center">Recent Notices</h2>
          <ul className="space-y-2">
            {noticeError && <li className="text-red-600">{noticeError}</li>}
            {!noticeError && notices.length === 0 && <li>No notices available</li>}
            {notices.map((notice, index) => (
              <li key={index}>
                <Link href={`/notices/${notice.slug}`}>
                  <p className="text-green-600 hover:underline sm:text-sm">{notice.title}</p>
                </Link>
              </li>
            ))}
          </ul>
          <hr className='mt-3 mb-3' />
          <section id="faculty-members" className="mb-8   p-4 text-center jodit-content">
            <h5 className="text-2xl sm:text-xl font-semibold mb-4">Faculty Members</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 gap-6">
              {facultyMembers.slice(0, 3).map((member, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-md text-center bg-white">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="object-cover mx-auto mb-4 rounded-full"
                  />
                  <h3 className="font-semibold text-lg sm:text-base">{member.name}</h3>
                  <p className="text-gray-500 sm:text-sm">{member.designation}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Main Content Section */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 bg-white p-6 border rounded-lg shadow-md">
          {/* About the Department/Program */}
          <section id="about-department" className="mb-8 border rounded p-4 jodit-content">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">About the Program</h2>
            <div className="text-gray-700 sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: program.departmentInfo }} />
          </section>

          {/* Faculty Members Section */}
          <section id="faculty-members" className="mb-8 border rounded p-4 text-center">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4">Faculty Members</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {facultyMembers.map((member, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-md text-center bg-white">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="object-cover mx-auto mb-4 rounded-full"
                  />
                  <h3 className="font-semibold text-lg sm:text-base">{member.name}</h3>
                  <p className="text-gray-500 sm:text-sm">{member.designation}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Salient Features */}
          <section id="salient-features" className="mb-8 border rounded p-4 jodit-content">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">Salient Features of This Program</h2>
            <div className="text-gray-700 sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: program.salientFeatures }} />
          </section>

          {/* Curriculum Structure */}
          <section id="curriculum-structure" className="mb-8 border rounded p-4 jodit-content">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">Structure of This Program Curriculum</h2>
            <div className="text-gray-700 sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: program.curriculumStructure }} />
          </section>

          {/* Eligibility and Admission */}
          <section id="eligibility-requirements" className="mb-8 border rounded p-4 jodit-content">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">Eligibility and Admission Requirements</h2>
            <div className="text-gray-700 sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: program.eligibilityRequirements }} />
          </section>

          {/* Tuition Fees */}
          <section id="tuition-fees" className="mb-8 border rounded p-4 jodit-content">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">Tuition Fees</h2>
            <div className="text-gray-700 sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: program.tuitionFees }} />
          </section>

          {/* Message from the Dean */}
          <section id="dean-message" className="mb-8 border rounded p-4">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">Message from the Dean of Faculty</h2>
            <div className="text-center">
              <Image src={program.deanImage} alt={program.deanName} width={128} height={128} className="w-32 h-32 object-cover mx-auto rounded-full mb-4" />
              <h3 className="font-semibold text-lg">Name: {program.deanName}</h3>
              <p className="text-gray-500">Message: {program.deanMessage}</p>
            </div>
          </section>

          {/* Message from the Head of Department */}
          <section id="head-message" className="mb-8 border rounded p-4">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">Message from the Head, Department</h2>
            <div className="text-center">
              <Image src={program.headImage} alt={program.headName} width={128} height={128} className="w-32 h-32 object-cover mx-auto rounded-full mb-4" />
              <h3 className="font-semibold text-lg">Name: {program.headName}</h3>
              <blockquote className="text-gray-500">Message: {program.headMessage}</blockquote>
            </div>
          </section>
        </div>

        {/* Custom Styles using styled-jsx for Jodit Editor output */}
        <style jsx>{`
          .jodit-content {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }

          .jodit-content p {
            margin-bottom: 1.2rem;
            font-size: 1rem;
          }

          .jodit-content h1 {
            font-size: 2rem;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 1rem;
          }

          .jodit-content h2 {
            font-size: 1.75rem;
            font-weight: bold;
            color: #34495e;
            margin-bottom: 1rem;
          }

          .jodit-content h4 {
            font-size: 1rem;
            font-weight: bold;
            color: #34495e;
            margin-bottom: 1rem;
          }

          .jodit-content strong {
            font-weight: bold;
            color: #e74c3c;
          }

          .jodit-content em {
            font-style: italic;
            color: #3498db;
          }

          .jodit-content a {
            color: #3498db;
            text-decoration: none;
          }

          .jodit-content a:hover {
            text-decoration: underline;
          }

          .jodit-content ul, .jodit-content ol {
            padding-left: 1.5rem;
            margin-bottom: 1.2rem;
          }

          .jodit-content li {
            margin-bottom: 0.5rem;
          }

          .jodit-content img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
          }

          @media (max-width: 768px) {
            .jodit-content h1 {
              font-size: 1.5rem;
            }

            .jodit-content h2 {
              font-size: 1.3rem;
            }

            .jodit-content h4 {
              font-size: 0.75rem;
            }
          }
        `}</style>
      </div>
    </>
  );
}
