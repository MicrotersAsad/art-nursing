import React, { useEffect,useState  } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Modal from 'react-modal';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const Home = ({ appData }) => {
  useEffect(() => {
    // Initialize AOS for animations
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <Banner data={appData.bannerData} />

      {/* Info Section */}
      <InfoSection data={appData.heroArea} />

      {/* About Section */}
      <AboutSection data={appData.aboutSection} />

      {/* Courses Section */}
      <CoursesSection data={appData.ourCourses} />

      {/* Statistics Section */}
      <Statistics data={appData.counters} />

      {/* Notices and Blogs Section */}
      <NoticesAndBlogs notices={appData.notices} blogs={appData.blogs} />

      {/* Why Choose Section */}
      <WhyChooseANC data={appData.whyChooseANC} />

      {/* Photo Gallery Section */}
      <PhotoGallery data={appData.photos} />
    </div>
  );
};

// Banner Component
const Banner = ({ data }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <div className="banner-container">
      <Slider {...settings}>
        {data.map((slider, index) => (
          <div key={index} className="relative overflow-hidden h-[600px]">
            <div
              className="absolute inset-0 bg-cover bg-center z-0 brightness-[60%]"
              style={{ backgroundImage: `url(${slider.img})` }}
            ></div>
            <div className="relative z-10 flex flex-col justify-center max-w-7xl mx-auto h-full px-4">
              <h1 data-aos="fade-up" className="text-3xl md:text-5xl text-white font-bold mb-4 shadow-md">
                {slider.heading}
              </h1>
              <p data-aos="fade-up" className="text-lg md:text-xl text-white mb-6 shadow-md">
                {slider.subHeading}
              </p>
              {slider.buttonLink && slider.buttonText && (
                <Link href={slider.buttonLink} passHref>
                  <button className="bg-blue-600 text-white rounded px-5 py-3 hover:bg-blue-700 transition duration-300 ease-in-out">
                    {slider.buttonText}
                  </button>
                </Link>
              )}
            </div>
          </div>
        ))}
      </Slider>
      <style jsx>{`
        .slick-slide {
          height: 607px !important;
        }
      `}</style>
    </div>
  );
};

// Info Section Component
const InfoSection = ({ data }) => (
  <div className="w-full">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" data-aos="fade-up">
      {Array.isArray(data) && data.length > 0 ? (
        data.map((hero, index) => (
          <div key={index} className={`p-6 ${index % 2 === 0 ? 'bg-[#0d1128]' : 'bg-blue-800'} text-white`}>
            <div className="flex justify-center m-4">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12l9-5-9-5-9 5z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-center mb-3">{hero.title || 'No Title'}</h3>
            <p className="text-center text-gray-300">{hero.description || 'No description available.'}</p>
            <div className="flex justify-center m-4">
              <Link href={hero.buttonLink || '/'} passHref>
                <span className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                  {hero.buttonText || 'Learn More'}
                </span>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p>No hero sections available</p>
      )}
    </div>
  </div>
);

// About Section Component
const AboutSection = ({ data }) => (
  <div className="max-w-7xl mx-auto bg-white py-12 px-4 md:px-10">
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
      <div className="lg:w-1/2 text-left" data-aos="fade-right">
        <h2 className="text-3xl font-bold mb-4">{data.headline || 'About Art Nursing College'}</h2>
        <p className="text-gray-700 mb-6">{data.description || 'A brief description.'}</p>
        <Link href="/about">
          <span className="inline-block px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition duration-300">
            Know More
          </span>
        </Link>
      </div>
      <div className="lg:w-1/2" data-aos="fade-left">
        <Image src={data.aboutImageUrl || '/default-about-image.png'} alt="Art Nursing College Campus" width={500} height={300} />
      </div>
    </div>
  </div>
);

// Courses Section Component
const CoursesSection = ({ data }) => (
  <div className="max-w-7xl mx-auto py-12">
    <h2 className="text-3xl font-bold text-center mb-8">Our Courses</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {data.length > 0 ? (
        data.map((course, index) => (
          <div key={index} className="bg-blue-900 text-white p-6 rounded-lg text-center pt-14 pb-14" data-aos="fade-up" data-aos-delay={index * 50}>
            <div className="mb-4">
              <Image src={course.iconUrl || '/default-course-icon.png'} alt={course.heading} width={48} height={48} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{course.heading}</h3>
            <p>{course.description}</p>
            <Link href={course.buttonLink || '#'}>
              <p className="mt-4 inline-block px-6 py-2 bg-[#F4A139] text-blue-900 font-semibold rounded-md">{course.buttonText || 'Read More'}</p>
            </Link>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-700">No courses available at the moment.</p>
      )}
    </div>
  </div>
);

// Statistics Component
const Statistics = ({ data }) => (
  <div className="pt-5 pb-5 bg-gray-100 flex flex-col justify-center items-center px-4">
    <h1 className="text-3xl font-extrabold text-gray-800 mb-16 text-center" data-aos="fade-up">
      Our Community Statistics
    </h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 w-full max-w-7xl">
      {data.map((counter, index) => (
        <div key={index} data-aos="fade-up" className="p-12 bg-white shadow-2xl rounded-2xl w-full mx-auto max-w-lg">
          <h2 className="text-4xl font-bold mb-6 text-gray-700 text-center">{counter.headline}</h2>
          <div className="text-center">
            <span className="text-7xl font-extrabold text-blue-600">{counter.counter}+</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Notices and Blogs Component


const NoticesAndBlogs = ({ notices, blogs }) => {
  const [searchTermNotices, setSearchTermNotices] = useState('');
  const [searchTermBlogs, setSearchTermBlogs] = useState('');
  const [visibleNotices, setVisibleNotices] = useState(5); // Number of notices initially visible
  const [visibleBlogs, setVisibleBlogs] = useState(5); // Number of blogs initially visible

  // Handle search functionality for notices
  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchTermNotices.toLowerCase())
  );

  // Handle search functionality for blogs
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTermBlogs.toLowerCase())
  );

  return (
    <div className="w-full bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notices Section */}
        <div className="bg-white p-6 shadow-md rounded-lg" data-aos="fade-right">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Notices</h2>
          <input
            type="text"
            placeholder="Search notices..."
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            value={searchTermNotices}
            onChange={e => setSearchTermNotices(e.target.value)}
          />
          {filteredNotices.length === 0 ? (
            <div className="text-center py-4 text-gray-600">No notices available.</div>
          ) : (
            <div className="overflow-x-auto">
              <div className="max-h-48 overflow-y-auto">
                {filteredNotices.slice(0, visibleNotices).map((notice) => (
                  <div key={notice._id} className="flex items-center mb-4">
                    {/* Date Box */}
                    <div className="flex flex-col items-center justify-center text-white rounded-md overflow-hidden w-20 h-20">
                      <div className="bg-blue-900 w-full text-center py-1 text-3xl font-bold">
                        {new Date(notice.date).getDate()}
                      </div>
                      <div className="bg-blue-500 w-full text-center py-1 text-xs">
                        {new Date(notice.date).toLocaleString('default', { month: 'short' })}-{new Date(notice.date).getFullYear()}
                      </div>
                    </div>
                    {/* Notice Title */}
                    <div className="ml-4">
                      <Link
                        href={`notices/${notice?.slug}`}
                        className="text-blue-600 hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                         <span   className="text-blue-600 hover:underline font-medium">{notice.title}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Blogs Section */}
        <div className="bg-white p-6 shadow-md rounded-lg" data-aos="fade-left">
          <h2 className="text-xl font-semibold mb-4">Latest Blogs</h2>
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full mb-4 p-2 border border-gray-300 rounded-md"
            value={searchTermBlogs}
            onChange={e => setSearchTermBlogs(e.target.value)}
          />
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-4 text-gray-600">No blogs available.</div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {filteredBlogs.slice(0, visibleBlogs).map((blog) => (
                <div key={blog._id} className="flex items-center mb-4">
                  {/* Date Box */}
                  <div className="flex flex-col items-center justify-center text-white rounded-md overflow-hidden w-16 h-16">
                    <div className="bg-blue-900 w-full text-center py-1 text-xl font-bold">
                      {new Date(blog.date).getDate()}
                    </div>
                    <div className="bg-blue-500 w-full text-center py-1 text-xs">
                      {new Date(blog.date).toLocaleString('default', { month: 'short' })}-{new Date(blog.date).getFullYear()}
                    </div>
                  </div>
                  {/* Blog Title */}
                  <div className="ml-4">
                    <Link
                      href={`/blogs/${blog.id}`}
                      className="text-blue-600 hover:underline font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span   className="text-blue-600 hover:underline font-medium">{blog.title}</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



// Why Choose ANC Component
const WhyChooseANC = ({ data }) => (
  <div className="w-full bg-gray-200 py-12">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Why Choose ANC</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <div key={index} className={`bg-white p-10 rounded-lg shadow-md flex items-center ${index % 2 === 0 ? 'bg-[#0d1128]' : 'bg-blue-800'} text-black`} data-aos={index % 2 === 0 ? 'fade-right' : 'fade-left'}>
            <div className="mr-4">
              <Image src={item?.iconUrl} alt="Logo" width={128} height={128} className="icon-logo" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">{item.heading}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Photo Gallery Component
const PhotoGallery = ({ data }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalIndex, setModalIndex] = useState(0); // Track index for modal slider

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const openModal = (image, index) => {
    setSelectedImage(image);
    setModalIndex(index);
    setModalIsOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling when modal is closed
  };

  const modalSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    initialSlide: modalIndex, // Start from clicked image
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setModalIndex(current), // Update index when slide changes
  };

  return (
    <div>
      {/* Main gallery slider */}
      <Slider {...settings}>
        {data.map((photo, index) => (
          <div key={index} onClick={() => openModal(photo.img, index)}>
            <Image width={100} height={100} src={photo.img} alt={`Photo ${index}`} style={{ width: '100%', height: '400px', objectFit: 'cover', cursor: 'pointer' }} />
          </div>
        ))}
      </Slider>

      {/* Modal to display the clicked image with slider */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        shouldCloseOnOverlayClick={false} // Prevent modal from closing on overlay click
        style={{
          overlay: { zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.8)' },
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '90%',
            maxHeight: '90vh', // Use full height of viewport
            padding: 0, // Remove padding to fit content
            overflow: 'hidden', // Hide overflow
          },
        }}
      >
        {data.length > 0 && (
          <div>
            <Slider {...modalSettings}>
              {data.map((photo, index) => (
                <div key={index}>
                  <Zoom>
                    <Image width={100} height={100} src={photo.img} alt={`Modal Image ${index}`} style={{ width: '100%', height: 'auto', maxHeight: '90vh', objectFit: 'contain' }} />
                  </Zoom>
                </div>
              ))}
            </Slider>

            {/* Close button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'red',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Fetching data server-side
export async function getServerSideProps({ req }) {
  try {
    const protocol = req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.headers.host;

    // Fetch banner data from /api/banner
    const bannerResponse = await fetch(`${protocol}://${host}/api/banner`);
    const bannerData = await bannerResponse.json();

    // Fetch setting data from /api/setting
    const settingResponse = await fetch(`${protocol}://${host}/api/setting`);
    const settingData = await settingResponse.json();

    // Fetch photo gallery data from /api/photo-gallery
    const photoGalleryResponse = await fetch(`${protocol}://${host}/api/photo-gallery`);
    const photoGalleryData = await photoGalleryResponse.json();

    // Fetch notices data from /api/notices
    const noticesResponse = await fetch(`${protocol}://${host}/api/notice`);
    const noticesData = await noticesResponse.json();

    // Fetch blogs data from /api/blog
    const blogsResponse = await fetch(`${protocol}://${host}/api/blogs`);
    const blogsData = await blogsResponse.json();

    return {
      props: {
        appData: {
          bannerData: bannerData || [],
          aboutSection: settingData.aboutSection || {},
          ourCourses: settingData.ourCourses || [],
          heroArea: settingData.heroArea || [],
          counters: settingData.counters || [],
          notices: noticesData || [],
          blogs: blogsData || [],
          whyChooseANC: settingData.whyChooseANC || [],
          photos: photoGalleryData || [],
        },
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        appData: {
          bannerData: [],
          aboutSection: {},
          ourCourses: [],
          heroArea: [],
          counters: [],
          notices: [],
          blogs: [],
          whyChooseANC: [],
          photos: [],
        },
      },
    };
  }
}

export default Home;
