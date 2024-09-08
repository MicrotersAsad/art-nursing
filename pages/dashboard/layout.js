import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import {
  FaTachometerAlt,
  FaBell,
  FaPhotoVideo,
  FaImage,
  FaBlog,
  FaFileAlt,
  FaUserShield,
  FaInfo,
  FaBookOpen,
  FaCogs,
  FaUserGraduate,
  FaBars,
  FaSearch,
  FaFileImport,
  FaUsers,
  FaPlus,
  FaMinus,
} from 'react-icons/fa';
import Image from 'next/image';
import logo from "../../public/img/logo (3).png";  // Add the logo path here

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Handles sidebar collapse
  const [menuOpen, setMenuOpen] = useState('');  // This stores the currently open menu

  const { user } = useAuth();
  console.log(user); 
  
  const router = useRouter();

  const toggleMenu = (menu) => {
    setMenuOpen(menuOpen === menu ? '' : menu);
  };

  const isActiveRoute = (route) => {
    return router.pathname === route;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Background Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black opacity-50 transition-opacity lg:hidden ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 ${
          isCollapsed ? 'w-20' : 'w-64'
        } overflow-y-auto bg-[#282a42] text-white shadow transition-all duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center mt-8">
          <Image src={logo} width={isCollapsed ? 40 : 80} height={isCollapsed ? 40 : 80} alt="Logo" />
       
        </div>
        <h6 className="font-bold text-center text-white">
                    Art Nursing College
                  </h6>

        <nav className="mt-10 text-white">
          {/* Dashboard */}
         
            <div className="mt-3">
            <p
                className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                  isActiveRoute('/dashboard/dashboard')
                    ? 'bg-gray-300 text-gray-700'
                    : 'hover:bg-gray-700 hover:text-white'
                }`}
              >
              <FaTachometerAlt className="mr-3 text-blue-500" />
              {!isCollapsed && <span>Dashboard</span>}
            </p>
          </div>

          {/* Notice Board */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === 'noticeBoard' ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
              onClick={() => toggleMenu('noticeBoard')}
            >
              <FaBell className="mr-3 text-pink-500" />
              {!isCollapsed && <span>Notice Board</span>}
              <span className="ml-auto">{menuOpen === 'noticeBoard' ? <FaMinus /> : <FaPlus />}</span>
            </p>
            {menuOpen === 'noticeBoard' && !isCollapsed && (
          <div className="ml-6">
          <Link href="/dashboard/all-notice" passHref>
            <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">
              All Notice
            </p>
          </Link>
          <Link href="/dashboard/add-notice" passHref>
            <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">
              Add New Notice
            </p>
          </Link>
        </div>
        
          
            )}
          </div>

          {/* Gallery */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === 'gallery' ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
              onClick={() => toggleMenu('gallery')}
            >
              <FaPhotoVideo className="mr-3 text-green-500" />
              {!isCollapsed && <span>Gallery</span>}
              <span className="ml-auto">{menuOpen === 'gallery' ? <FaMinus /> : <FaPlus />}</span>
            </p>
            {menuOpen === 'gallery' && !isCollapsed && (
              <div className="ml-6">
                <Link href="/dashboard/photo-gallery" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Photo Gallery</p>
                </Link>
                <Link href="/dashboard/video-gallery" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Video Gallery</p>
                </Link>
              </div>
            )}
          </div>

          {/* Banner Management */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === 'banner' ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
              onClick={() => toggleMenu('banner')}
            >
              <FaImage className="mr-3 text-purple-500" />
              {!isCollapsed && <span>Banner Management</span>}
              <span className="ml-auto">{menuOpen === 'banner' ? <FaMinus /> : <FaPlus />}</span>
            </p>
            {menuOpen === 'banner' && !isCollapsed && (
              <div className="ml-6">
                <Link href="/dashboard/banner" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Banner</p>
                </Link>
              </div>
            )}
          </div>

          {/* Blog */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === 'blog' ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
              onClick={() => toggleMenu('blog')}
            >
              <FaBlog className="mr-3 text-orange-500" />
              {!isCollapsed && <span>Blog</span>}
              <span className="ml-auto">{menuOpen === 'blog' ? <FaMinus /> : <FaPlus />}</span>
            </p>
            {menuOpen === 'blog' && !isCollapsed && (
              <div className="ml-6">
                <Link href="/dashboard/categories" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Categories</p>
                </Link>
                <Link href="/dashboard/all-posts" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">All Posts</p>
                </Link>
                <Link href="/dashboard/add-post" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Add New Post</p>
                </Link>
              </div>
            )}
          </div>

          {/* Pages */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === 'pages' ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
              onClick={() => toggleMenu('pages')}
            >
              <FaFileAlt className="mr-3 text-blue-500" />
              {!isCollapsed && <span>Pages</span>}
              <span className="ml-auto">{menuOpen === 'pages' ? <FaMinus /> : <FaPlus />}</span>
            </p>
            {menuOpen === 'pages' && !isCollapsed && (
              <div className="ml-6">
                <Link href="/dashboard/all-pages" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">All Pages</p>
                </Link>
                <Link href="/dashboard/add-page" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Add New Page</p>
                </Link>
              </div>
            )}
          </div>

          {/* Results */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                isActiveRoute('/dashboard/results') ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
            >
              <FaFileImport className="mr-3 text-red-500" />
              {!isCollapsed && <span>Results</span>}
            </p>
          </div>

          {/* About */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === 'about' ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
              onClick={() => toggleMenu('about')}
            >
              <FaInfo className="mr-3 text-red-500" />
              {!isCollapsed && <span>About</span>}
              <span className="ml-auto">{menuOpen === 'about' ? <FaMinus /> : <FaPlus />}</span>
            </p>
            {menuOpen === 'about' && !isCollapsed && (
              <div className="ml-6">
                <Link href="/dashboard/about" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">About Us</p>
                </Link>
                <Link href="/dashboard/governing" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Governing Body</p>
                </Link>
                <Link href="/dashboard/staff" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Staff Information</p>
                </Link>
                <Link href="/dashboard/teacher" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Teacher's Information</p>
                </Link>
                <Link href="/dashboard/achievements" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Achievements</p>
                </Link>
              </div>
            )}
          </div>

          {/* Manage Users */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === 'users' ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
              onClick={() => toggleMenu('users')}
            >
              <FaUsers className="mr-3 text-green-500" />
              {!isCollapsed && <span>Manage Users</span>}
              <span className="ml-auto">{menuOpen === 'users' ? <FaMinus /> : <FaPlus />}</span>
            </p>
            {menuOpen === 'users' && !isCollapsed && (
              <div className="ml-6">
                <Link href="/dashboard/admin-list" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Admin List</p>
                </Link>
                <Link href="/dashboard/add-admin" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Add New Admin</p>
                </Link>
              </div>
            )}
          </div>

          {/* Admission */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === 'admission' ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
              onClick={() => toggleMenu('admission')}
            >
              <FaBookOpen className="mr-3 text-purple-500" />
              {!isCollapsed && <span>Admission</span>}
              <span className="ml-auto">{menuOpen === 'admission' ? <FaMinus /> : <FaPlus />}</span>
            </p>
            {menuOpen === 'admission' && !isCollapsed && (
              <div className="ml-6">
                <Link href="/dashboard/admission-requirements" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Admission Requirements</p>
                </Link>
                <Link href="/dashboard/tuition-fees" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Tuition Fees</p>
                </Link>
                <Link href="/dashboard/admission-form" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Admission Form</p>
                </Link>
              </div>
            )}
          </div>

          {/* Program */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === 'program' ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
              onClick={() => toggleMenu('program')}
            >
              <FaUserGraduate className="mr-3 text-blue-500" />
              {!isCollapsed && <span>Program</span>}
              <span className="ml-auto">{menuOpen === 'program' ? <FaMinus /> : <FaPlus />}</span>
            </p>
            {menuOpen === 'program' && !isCollapsed && (
              <div className="ml-6">
                <Link href="/dashboard/program-1" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Program Name 1</p>
                </Link>
                <Link href="/dashboard/program-2" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Program Name 2</p>
                </Link>
                <Link href="/dashboard/program-3" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Program Name 3</p>
                </Link>
              </div>
            )}
          </div>

          {/* Appearance */}
          <div className="mt-3">
            <p
              className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === 'appearance' ? 'bg-gray-300 text-gray-700' : 'hover:bg-gray-300 hover:text-white'
              }`}
              onClick={() => toggleMenu('appearance')}
            >
              <FaCogs className="mr-3 text-red-500" />
              {!isCollapsed && <span>Appearance</span>}
              <span className="ml-auto">{menuOpen === 'appearance' ? <FaMinus /> : <FaPlus />}</span>
            </p>
            {menuOpen === 'appearance' && !isCollapsed && (
              <div className="ml-6">
                <Link href="/dashboard/theme-settings" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Theme Settings</p>
                </Link>
                <Link href="/dashboard/contact-page" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Contact Page</p>
                </Link>
                <Link href="/dashboard/all-contact" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">All Contact</p>
                </Link>
                <Link href="/dashboard/smtp-settings" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">SMTP Settings</p>
                </Link>
                <Link href="/dashboard/comments" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Comments</p>
                </Link>
                <Link href="/dashboard/media-upload" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Media Upload</p>
                </Link>
                <Link href="/dashboard/menu-management" passHref>
                  <p className="relative py-2 px-6 cursor-pointer text-white hover:bg-gray-600 hover:text-white before:content-['\2022'] before:absolute before:left-0 before:text-white before:text-xs before:mt-1.5">Menu Management</p>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-gray-200">
           {/* Sidebar Collapse Button */}
           <button
            className="ml-3 text-gray-500 focus:outline-none"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <FaBars className="w-6 h-6" />
          </button>

          {/* Sidebar toggle for mobile */}
          <button
            className="text-gray-500 focus:outline-none lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="w-6 h-6" />
          </button>
<div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
              placeholder="Search"
            />
            <FaSearch className="absolute top-3 right-3 text-gray-400" />
          </div>
          <Image src={user?.profileImage} width={64} height={64} className='rounded-full border'/>
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
              placeholder="Search"
            />
            <FaSearch className="absolute top-3 right-3 text-gray-400" />
          </div>

         
         
          {/* Profile Image */}


        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
