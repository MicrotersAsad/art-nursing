
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; 
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight, FaFacebookF, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import PageHeader from '../../components/PageHeader';

const ProgrammeDetails = ({ program, notices, error }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => setLoading(true);
    const handleRouteChangeComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      <PageHeader
        title="Programme"
        breadcrumb={[
          { label: 'Home', link: '/' },
          { label: `${program.name}` }
        ]}
      />
      <div className="max-w-7xl mx-auto p-4">
        {loading && (
          <div className="flex justify-center items-center h-screen">
            <ClipLoader size={50} color={"#3498db"} loading={loading} />
          </div>
        )}

        {/* Responsive Layout for Main Section, Table of Contents, and Notices */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${loading ? 'hidden' : ''}`}>
          
          {/* Main Content Section */}
          <div className="order-2 md:order-1 md:col-span-2 p-3 rounded">
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
          {/* For Mobile Version */}
          <div className=" block md:hidden order-3 p-4  border rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Notices</h2>
        <ul className="space-y-4">
          {notices.slice(0, 5).map((notice, index) => (
            <li key={index} className="bg-white p-3 flex items-center border-b">
              <FaArrowRight className="text-blue-600 mr-2" />
              <div>
                <Link href={`/notices/${notice.slug}`}>
                  <p className="font-semibold text-blue-600 hover:underline">{notice.title}</p>
                </Link>
                <p className="text-sm text-gray-500">{notice.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
          {/* Sidebar for Desktop (Both Table of Contents and Notices in one column) */}
          <div className="order-1 md:order-2 md:col-span-1 space-y-6 relative">
      {/* Table of Contents (Sticky Sidebar for Desktop) */}
      <div className="p-4 border rounded-lg is-sticky">
        <h2 className="text-2xl font-bold mb-4 text-center">Table of Contents</h2>
        <ul className="space-y-4">
          <Link href="#about-department">
            <p className="font-semibold text-blue-600 hover:underline border-b p-3">
              <FaArrowRight className="inline-block mr-2" /> About the Program
            </p>
          </Link>
          <Link href="#salient-features">
            <p className="font-semibold text-blue-600 hover:underline pt-2 border-b p-3">
              <FaArrowRight className="inline-block mr-2" /> Salient Features
            </p>
          </Link>
          <Link href="#curriculum-structure">
            <p className="font-semibold text-blue-600 hover:underline pt-2 border-b p-3">
              <FaArrowRight className="inline-block mr-2" /> Curriculum Structure
            </p>
          </Link>
          <Link href="#eligibility-requirements">
            <p className="font-semibold text-blue-600 hover:underline pt-2 border-b p-3">
              <FaArrowRight className="inline-block mr-2" /> Eligibility & Admission
            </p>
          </Link>
          <Link href="#tuition-fees">
            <p className="font-semibold text-blue-600 hover:underline pt-2 border-b p-3">
              <FaArrowRight className="inline-block mr-2" /> Tuition Fees
            </p>
          </Link>
        </ul>
      </div>

      {/* Notices Section (Hidden on Mobile) */}
      <div className="hidden md:block p-4 border rounded-lg sticky top-20">
        <h2 className="text-2xl font-bold mb-4 text-center">Notices</h2>
        <ul className="space-y-4">
          {notices.slice(0, 5).map((notice, index) => (
            <li key={index} className="bg-white p-3 flex items-center border-b">
              <FaArrowRight className="text-blue-600 mr-2" />
              <div>
                <Link href={`/notices/${notice.slug}`}>
                  <p className="font-semibold text-blue-600 hover:underline">{notice.title}</p>
                </Link>
                <p className="text-sm text-gray-500">{notice.date}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
        </div>
      </div>
    </>
  );
};

// Fetching data server-side using req.headers to construct the base URL
export async function getServerSideProps(context) {
  const { slug } = context.params;
  const { req } = context;
  let program = null;
  let notices = [];
  let error = null;

  try {
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host;

    const programResponse = await fetch(`${protocol}://${host}/api/programme/${slug}`);
    if (!programResponse.ok) {
      throw new Error('Failed to fetch program details');
    }
    program = await programResponse.json();

    const noticeResponse = await fetch(`${protocol}://${host}/api/notice`);
    if (!noticeResponse.ok) {
      throw new Error('Failed to fetch notices');
    }
    notices = await noticeResponse.json();
  } catch (err) {
    error = err.message;
  }

  return {
    props: {
      program: program.data,
      notices: notices.slice(0, 5),
      error,
    },
  };
}

export default ProgrammeDetails;
