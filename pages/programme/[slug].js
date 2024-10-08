import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '../../components/PageHeader';
import ClipLoader from 'react-spinners/ClipLoader'; // For loading spinner

export default function ProgrammeDetails({ program, notices, error }) {

  
  if (error) {
    return <div className="flex justify-center items-center h-screen">Error: {error}</div>;
  }

  if (!program) {
    return <div className="flex justify-center items-center h-screen"><ClipLoader size={150} color={"#3498db"} /></div>;
  }

  return (
    <>
      <PageHeader
        title="Programme"
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: `${program.name}` }
        ]}
      />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar Section */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 bg-gray-50 p-4">
          <h2 className="font-bold text-lg sm:text-base mb-4 text-center">Table of Contents</h2>
          <ul className="space-y-2 ms-2">
            <li><Link href="#about-department"><span className="text-green-600 hover:underline sm:text-sm">About the Program</span></Link></li>
            <li><Link href="#salient-features"><span className="text-green-600 hover:underline sm:text-sm">Salient Features</span></Link></li>
            <li><Link href="#curriculum-structure"><span className="text-green-600 hover:underline sm:text-sm">Curriculum Structure</span></Link></li>
            <li><Link href="#eligibility-requirements"><span className="text-green-600 hover:underline sm:text-sm">Eligibility & Admission</span></Link></li>
            <li><Link href="#tuition-fees"><span className="text-green-600 hover:underline sm:text-sm">Tuition Fees</span></Link></li>
          </ul>
          <hr className='mt-3 mb-3' />

          {/* Notices Section */}
          <h2 className="font-bold text-lg sm:text-base mt-6 mb-4 text-center">Recent Notices</h2>
          <ul className="space-y-2 ms-2">
            {notices.length === 0 ? <li>No notices available</li> : notices.map((notice, index) => (
              <li key={index}>
                <Link href={`/notices/${notice.slug}`}>
                  <p className="text-green-600 hover:underline sm:text-sm">{notice.title}</p>
                </Link>
              </li>
            ))}
          </ul>
          <hr className='mt-3 mb-3' />
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
              {program?.facultyMembers?.map((member, index) => (
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

          {/* Salient Features Section */}
          <section id="salient-features" className="mb-8 border rounded p-4 jodit-content">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">Salient Features of This Program</h2>
            <div className="text-gray-700 sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: program.salientFeatures }} />
          </section>

          {/* Curriculum Structure Section */}
          <section id="curriculum-structure" className="mb-8 border rounded p-4 jodit-content">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">Structure of This Program Curriculum</h2>
            <div className="text-gray-700 sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: program.curriculumStructure }} />
          </section>

          {/* Eligibility and Admission Section */}
          <section id="eligibility-requirements" className="mb-8 border rounded p-4 jodit-content">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">Eligibility and Admission Requirements</h2>
            <div className="text-gray-700 sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: program.eligibilityRequirements }} />
          </section>

          {/* Tuition Fees Section */}
          <section id="tuition-fees" className="mb-8 border rounded p-4 jodit-content">
            <h2 className="text-2xl sm:text-xl font-semibold mb-4 text-center">Tuition Fees</h2>
            <div className="text-gray-700 sm:text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: program.tuitionFees }} />
          </section>
        </div>
      </div>

      {/* Styling for Jodit Editor Content */}
      <style jsx global>{`
        .jodit-content {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }

        .jodit-content p {
          margin-bottom: 1.2rem;
          font-size: 1rem;
        }

        .jodit-content h2 {
          font-size: 1.75rem;
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
        a span .span{
        color:#3b82f6!important
        }
        @media (max-width: 768px) {
          .jodit-content h2 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  );
}

// Fetching data server-side using req.headers to construct the base URL
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const { req } = context;
  let program = null;
  let notices = [];
  let error = null;

  try {
    // Determine protocol (http or https) based on req.headers
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host;

    // Fetch program details
    const programResponse = await fetch(`${protocol}://${host}/api/programme/${slug}`, {
    
    });

    if (!programResponse.ok) {
      throw new Error('Failed to fetch program details');
    }
    program = await programResponse.json();


    // Fetch notices
    const noticeResponse = await fetch(`${protocol}://${host}/api/notice`, {
     
    });

    if (!noticeResponse.ok) {
      throw new Error('Failed to fetch notices');
    }
    notices = await noticeResponse.json();
  } catch (err) {
    error = err.message;
  }

  return {
    props: {
      program:program.data,
      notices: notices.slice(0, 5), // Only the first 5 notices
      error,
    },
  };
}
