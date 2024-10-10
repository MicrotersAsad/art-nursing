import React, { useState, useEffect } from "react"; 
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaTachometerAlt,
  FaBell,
  FaPhotoVideo,
  FaBlog,
  FaFileAlt,
  FaBookOpen,
  FaCogs,
  FaUserGraduate,
  FaBars,
  FaSearch,
  FaUsers,
  FaCaretUp,
  FaCaretDown,
  FaSignOutAlt,
  FaClipboardList,
  FaCircle, 
  FaUser,
  FaArrowLeft,
  FaFirefoxBrowser,
  FaGlobe,
  FaWrench,
  FaArrowUp

} from "react-icons/fa";
import Image from "next/image";
import logo from "../../public/img/logo (3).png";

const Layout = React.memo(({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState("");
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const savedMenu = localStorage.getItem("activeMenu");
    if (savedMenu) setMenuOpen(savedMenu);
    const savedCollapsed = localStorage.getItem("isCollapsed");
    if (savedCollapsed) setIsCollapsed(savedCollapsed === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("isCollapsed", isCollapsed);
  }, [isCollapsed]);

  const toggleMenu = (menu) => {
    const newMenu = menuOpen === menu ? "" : menu;
    setMenuOpen(newMenu);
    localStorage.setItem("activeMenu", newMenu);
  };

  const isActiveRoute = (route) => router.pathname === route;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getProfileImagePath = (imagePath) => {
    return imagePath
      ? imagePath.startsWith("/uploads/")
        ? imagePath
        : `/uploads/profileImages/${imagePath}`
      : null;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 sidebar-test">
      {/* Background Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black opacity-50 transition-opacity lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
  className={`fixed inset-y-0 left-0 z-40 transform transition-all duration-300 bg-[#071251] text-white shadow-lg ${isCollapsed ? 'w-24' : 'w-72'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 h-full flex flex-col`}
  onMouseEnter={() => isCollapsed && setIsCollapsed(false)}
  onMouseLeave={() => isCollapsed && setIsCollapsed(true)}
  style={{ borderRight: '2px solid rgba(255, 255, 255, 0.2)' }}
>
<div className="sticky top-0 bg-[#071251] z-50 p-4">
        {/* Logo */}
        <div className="flex items-center text-white justify-center mt-8">
          <Image
            src={logo}
            width={isCollapsed ? 40 : 80}
            height={isCollapsed ? 40 : 80}
            alt="Logo"
          />
        </div>
        <h6 className="font-bold text-center text-white">
          Art Nursing College
        </h6>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
       
        <nav className="mt-4 text-white pr-2 pb-4">
          {/* Dashboard */}
          <div className="mt-3">
  <Link
    href="/dashboard/overview"
    passHref
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/overview")
        ? "bg-[#4634ff] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
  >
    <FaTachometerAlt className="mr-3 text-white" />
    {!isCollapsed && <span>Dashboard</span>}
  </Link>
</div>

{/* Notice Board */}
<div className="mt-3">
  <p
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/all-notice") || isActiveRoute("/dashboard/addnotice")
        ? "bg-[#4634ff] text-white"
        : menuOpen === "notice"
        ? "bg-[#6610f2] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
    onClick={() => toggleMenu("notice")}
  >
    <FaBell className="mr-3 text-white" />
    {!isCollapsed && <span>Notice</span>}
    {!isCollapsed && (
      <span className="ml-auto">
        {menuOpen === "notice" ? <FaCaretDown className="w-6 h-6" /> : <FaCaretUp className="w-6 h-6"  />}
      </span>
    )}
  </p>

  {/* Dropdown Content with Smooth Opening and Closing Animation */}
  <div
    className={`ml-6 mt-3 mb-3 overflow-hidden transform transition-all duration-700 ease-in-out origin-top ${
      (menuOpen === "notice" ||
        isActiveRoute("/dashboard/all-notice") ||
        isActiveRoute("/dashboard/addnotice")) && !isCollapsed
        ? 'max-h-screen opacity-100 scale-y-100'
        : 'max-h-0 opacity-0 scale-y-0'
    }`}
  >
    <Link href="/dashboard/all-notice"  passHref>
      <p
        className={`relative flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/all-notice")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        All Notice
      </p>
    </Link>
    <Link href="/dashboard/addnotice" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/addnotice")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Add Notice
      </p>
    </Link>
  </div>
</div>



{/* Result Board */}
<div className="mt-3">
  <p
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/all-result") || isActiveRoute("/dashboard/add-result")
        ? "bg-[#4634ff] text-white"
        : menuOpen === "result"
        ? "bg-[#6610f2] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
    onClick={() => toggleMenu("result")}
  >
    <FaBell className="mr-3 text-white" />
    {!isCollapsed && <span>Result</span>}
    {!isCollapsed && (
      <span className="ml-auto">
        {menuOpen === "result" ? <FaCaretDown className="w-6 h-6" /> : <FaCaretUp className="w-6 h-6" />}
      </span>
    )}
  </p>

  {/* Dropdown Content with Smooth Opening and Closing Animation */}
  <div
    className={`ml-6 mt-3 mb-3 overflow-hidden transform transition-all duration-700 ease-in-out origin-top ${
      (menuOpen === "result" ||
        isActiveRoute("/dashboard/all-result") ||
        isActiveRoute("/dashboard/add-result")) && !isCollapsed
        ? 'max-h-screen opacity-100 scale-y-100'
        : 'max-h-0 opacity-0 scale-y-0'
    }`}
  >
    <Link href="/dashboard/all-result" passHref>
      <p
        className={`relative flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/all-result")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        All Result
      </p>
    </Link>
    <Link href="/dashboard/add-result" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/add-result")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Add Result
      </p>
    </Link>
  </div>
</div>



{/* Gallery */}
<div className="mt-3">
  <p
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/photo-gallery") || isActiveRoute("/dashboard/video-gallery")
        ? "bg-[#4634ff] text-white"
        : menuOpen === "gallery"
        ? "bg-[#6610f2] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
    onClick={() => toggleMenu("gallery")}
  >
    <FaPhotoVideo className="mr-3 text-white" />
    {!isCollapsed && <span>Gallery</span>}
    {!isCollapsed && (
      <span className="ml-auto">
        {menuOpen === "gallery" ? <FaCaretDown className="w-6 h-6" /> : <FaCaretUp className="w-6 h-6" />}
      </span>
    )}
  </p>

  {/* Dropdown Content with Smooth Opening and Closing Animation */}
  <div
    className={`ml-6 mt-3 mb-3 overflow-hidden transform transition-all duration-700 ease-in-out origin-top ${
      (menuOpen === "gallery" ||
        isActiveRoute("/dashboard/photo-gallery") ||
        isActiveRoute("/dashboard/video-gallery")) && !isCollapsed
        ? 'max-h-screen opacity-100 scale-y-100'
        : 'max-h-0 opacity-0 scale-y-0'
    }`}
  >
    <Link href="/dashboard/photo-gallery" passHref>
      <p
        className={`relative flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/photo-gallery")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Photo Gallery
      </p>
    </Link>
    <Link href="/dashboard/video-gallery" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/video-gallery")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Video Gallery
      </p>
    </Link>
  </div>
</div>

{/* Banner Management */}
<div className="mt-3">
  <p
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/banner")
        ? "bg-[#4634ff] text-white"
        : menuOpen === "banner"
        ? "bg-[#6610f2] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
    onClick={() => toggleMenu("banner")}
  >
    <FaPhotoVideo className="mr-3 text-white" />
    {!isCollapsed && <span>Banner</span>}
    {!isCollapsed && (
      <span className="ml-auto">
        {menuOpen === "banner" ? <FaCaretDown className="w-6 h-6" /> : <FaCaretUp className="w-6 h-6" />}
      </span>
    )}
  </p>

  {/* Dropdown Content with Smooth Opening and Closing Animation */}
  <div
    className={`ml-6 mt-3 mb-3 overflow-hidden transform transition-all duration-700 ease-in-out origin-top ${
      (menuOpen === "banner" || isActiveRoute("/dashboard/banner")) && !isCollapsed
        ? 'max-h-screen opacity-100 scale-y-100'
        : 'max-h-0 opacity-0 scale-y-0'
    }`}
  >
    <Link href="/dashboard/banner" passHref>
      <p
        className={`relative flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/banner")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Banners
      </p>
    </Link>
  </div>
</div>


{/* Blog */}
<div className="mt-3">
  <p
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/categories") ||
      isActiveRoute("/dashboard/all-blogs") ||
      isActiveRoute("/dashboard/blogs")
        ? "bg-[#4634ff] text-white"
        : menuOpen === "blog"
        ? "bg-[#6610f2] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
    onClick={() => toggleMenu("blog")}
  >
    <FaBlog className="mr-3 text-orange-500" />
    {!isCollapsed && <span>Blog</span>}
    {!isCollapsed && (
      <span className="ml-auto">
        {menuOpen === "blog" ? <FaCaretDown className="w-6 h-6" /> : <FaCaretUp className="w-6 h-6" />}
      </span>
    )}
  </p>

  {/* Dropdown Content with Smooth Opening and Closing Animation */}
  <div
    className={`ml-6 mt-3 mb-3 overflow-hidden transform transition-all duration-700 ease-in-out origin-top ${
      (menuOpen === "blog" ||
        isActiveRoute("/dashboard/categories") ||
        isActiveRoute("/dashboard/all-blogs") ||
        isActiveRoute("/dashboard/blogs")) && !isCollapsed
        ? 'max-h-screen opacity-100 scale-y-100'
        : 'max-h-0 opacity-0 scale-y-0'
    }`}
  >
    <Link href="/dashboard/categories" passHref>
      <p
        className={`relative flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/categories")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Categories
      </p>
    </Link>
    <Link href="/dashboard/all-blogs" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/all-blogs")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        All Posts
      </p>
    </Link>
    <Link href="/dashboard/blogs" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/blogs")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Add Post
      </p>
    </Link>
  </div>
</div>



  {/* Pages */}
<div className="mt-3">
  <p
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/all-pages") || isActiveRoute("/dashboard/add-page")
        ? "bg-[#4634ff] text-white"
        : menuOpen === "pages"
        ? "bg-[#6610f2] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
    onClick={() => toggleMenu("pages")}
  >
    <FaFileAlt className="mr-3 text-blue-500" />
    {!isCollapsed && <span>Pages</span>}
    {!isCollapsed && (
      <span className="ml-auto">
        {menuOpen === "pages" ? <FaCaretDown className="w-6 h-6" /> : <FaCaretUp className="w-6 h-6" />}
      </span>
    )}
  </p>

  {/* Dropdown Content with Smooth Opening and Closing Animation */}
  <div
    className={`ml-6 mt-3 mb-3 overflow-hidden transform transition-all duration-700 ease-in-out origin-top ${
      (menuOpen === "pages" ||
        isActiveRoute("/dashboard/all-pages") ||
        isActiveRoute("/dashboard/add-page")) && !isCollapsed
        ? 'max-h-screen opacity-100 scale-y-100'
        : 'max-h-0 opacity-0 scale-y-0'
    }`}
  >
    <Link href="/dashboard/all-pages" passHref>
      <p
        className={`relative flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/all-pages")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        All Pages
      </p>
    </Link>
    <Link href="/dashboard/add-page" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/add-page")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Add New Page
      </p>
    </Link>
  </div>
</div>

{/* Manage Users */}
<div className="mt-3">
  <p
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/admin-list") || isActiveRoute("/dashboard/add-admin")
        ? "bg-[#4634ff] text-white"
        : menuOpen === "users"
        ? "bg-[#6610f2] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
    onClick={() => toggleMenu("users")}
  >
    <FaUsers className="mr-3 text-green-500" />
    {!isCollapsed && <span>Manage Users</span>}
    {!isCollapsed && (
      <span className="ml-auto">
        {menuOpen === "users" ? <FaCaretDown className="w-6 h-6" /> : <FaCaretUp className="w-6 h-6" />}
      </span>
    )}
  </p>

  {/* Dropdown Content with Smooth Opening and Closing Animation */}
  <div
    className={`ml-6 mt-3 mb-3 overflow-hidden transform transition-all duration-700 ease-in-out origin-top ${
      (menuOpen === "users" ||
        isActiveRoute("/dashboard/admin-list") ||
        isActiveRoute("/dashboard/add-admin")) && !isCollapsed
        ? 'max-h-screen opacity-100 scale-y-100'
        : 'max-h-0 opacity-0 scale-y-0'
    }`}
  >
    <Link href="/dashboard/admin-list" passHref>
      <p
        className={`relative flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/admin-list")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Admin List
      </p>
    </Link>
    <Link href="/dashboard/add-admin" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/add-admin")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Add Admin
      </p>
    </Link>
  </div>
</div>


{/* Program */}
<div className="mt-3">
  <p
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/add-programme") || isActiveRoute("/dashboard/program-2") || isActiveRoute("/dashboard/program-3")
        ? "bg-[#4634ff] text-white"
        : menuOpen === "program"
        ? "bg-[#6610f2] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
    onClick={() => toggleMenu("program")}
  >
    <FaUserGraduate className="mr-3 text-blue-500" />
    {!isCollapsed && <span>Program</span>}
    {!isCollapsed && (
      <span className="ml-auto">
        {menuOpen === "program" ? <FaCaretDown className="w-6 h-6" /> : <FaCaretUp className="w-6 h-6" />}
      </span>
    )}
  </p>

  {/* Dropdown Content with Smooth Opening and Closing Animation */}
  <div
    className={`ml-6 mt-3 mb-3 overflow-hidden transform transition-all duration-700 ease-in-out origin-top ${
      (menuOpen === "program" ||
        isActiveRoute("/dashboard/add-programme") ||
        isActiveRoute("/dashboard/program-2") ||
        isActiveRoute("/dashboard/program-3")) && !isCollapsed
        ? 'max-h-screen opacity-100 scale-y-100'
        : 'max-h-0 opacity-0 scale-y-0'
    }`}
  >
    <Link href="/dashboard/add-programme" passHref>
      <p
        className={`relative flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/add-programme")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Add Programme
      </p>
    </Link>
    <Link href="/dashboard/program-2" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/program-2")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Program 2
      </p>
    </Link>
    <Link href="/dashboard/program-3" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/program-3")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Program 3
      </p>
    </Link>
  </div>
</div>



 {/* About */}
<div className="mt-3">
  <p
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/about-us") || isActiveRoute("/dashboard/governing") || isActiveRoute("/dashboard/staff") || isActiveRoute("/dashboard/teacher") || isActiveRoute("/dashboard/achievement")
        ? "bg-[#4634ff] text-white"
        : menuOpen === "about"
        ? "bg-[#6610f2] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
    onClick={() => toggleMenu("about")}
  >
    <FaUserGraduate className="mr-3 text-blue-500" />
    {!isCollapsed && <span>About</span>}
    {!isCollapsed && (
      <span className="ml-auto">
        {menuOpen === "about" ? <FaCaretDown className="w-6 h-6" /> : <FaCaretUp className="w-6 h-6" />}
      </span>
    )}
  </p>

  {/* Dropdown Content with Smooth Opening and Closing Animation */}
  <div
    className={`ml-6 mt-3 mb-3 overflow-hidden transform transition-all duration-700 ease-in-out origin-top ${
      (menuOpen === "about" ||
        isActiveRoute("/dashboard/about-us") ||
        isActiveRoute("/dashboard/governing") ||
        isActiveRoute("/dashboard/staff") ||
        isActiveRoute("/dashboard/teacher") ||
        isActiveRoute("/dashboard/achievement")) && !isCollapsed
        ? 'max-h-screen opacity-100 scale-y-100'
        : 'max-h-0 opacity-0 scale-y-0'
    }`}
  >
    <Link href="/dashboard/about-us" passHref>
      <p
        className={`relative flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/about-us")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        About Us
      </p>
    </Link>
    <Link href="/dashboard/governing" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/governing")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Governing Body
      </p>
    </Link>
    <Link href="/dashboard/staff" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/staff")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Staff Information
      </p>
    </Link>
    <Link href="/dashboard/teacher" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/teacher")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Teacher Information
      </p>
    </Link>
    <Link href="/dashboard/achievement" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/achievement")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Achievement
      </p>
    </Link>
  </div>
</div>


{/* Appearance */}
<div className="mt-3">
  <p
    className={`flex items-center py-2 text-white text-sm px-6 cursor-pointer rounded-md ${
      isActiveRoute("/dashboard/setting") ||
      isActiveRoute("/dashboard/fotter-management") ||
      isActiveRoute("/dashboard/contact") ||
      isActiveRoute("/dashboard/allcontact") ||
      isActiveRoute("/dashboard/smtp") ||
      isActiveRoute("/dashboard/comment") ||
      isActiveRoute("/dashboard/media") ||
      isActiveRoute("/dashboard/all-menu") ||
      isActiveRoute("/dashboard/add-menu")
        ? "bg-[#4634ff] text-white"
        : menuOpen === "appearance"
        ? "bg-[#6610f2] text-white"
        : "hover:bg-[#6610f2] hover:text-white"
    }`}
    onClick={() => toggleMenu("appearance")}
  >
    <FaCogs className="mr-3 text-red-500" />
    {!isCollapsed && <span>Appearance</span>}
    {!isCollapsed && (
      <span className="ml-auto">
        {menuOpen === "appearance" ? <FaCaretDown className="w-6 h-6" /> : <FaCaretUp className="w-6 h-6" />}
      </span>
    )}
  </p>

  {/* Dropdown Content with Smooth Opening and Closing Animation */}
  <div
    className={`ml-6 mt-3 mb-3 overflow-hidden transform transition-all duration-700 ease-in-out origin-top ${
      (menuOpen === "appearance" ||
        isActiveRoute("/dashboard/setting") ||
        isActiveRoute("/dashboard/fotter-management") ||
        isActiveRoute("/dashboard/contact") ||
        isActiveRoute("/dashboard/allcontact") ||
        isActiveRoute("/dashboard/smtp") ||
        isActiveRoute("/dashboard/comment") ||
        isActiveRoute("/dashboard/media") ||
        isActiveRoute("/dashboard/all-menu") ||
        isActiveRoute("/dashboard/add-menu")) && !isCollapsed
        ? 'max-h-screen opacity-100 scale-y-100'
        : 'max-h-0 opacity-0 scale-y-0'
    }`}
  >
    <Link href="/dashboard/setting" passHref>
      <p
        className={`relative flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/setting")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Settings
      </p>
    </Link>
    <Link href="/dashboard/fotter-management" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/fotter-management")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Footer
      </p>
    </Link>
    <Link href="/dashboard/contact" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/contact")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Contact
      </p>
    </Link>
    <Link href="/dashboard/allcontact" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/allcontact")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        All Contact
      </p>
    </Link>
    <Link href="/dashboard/smtp" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/smtp")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        SMTP
      </p>
    </Link>
    <Link href="/dashboard/comment" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/comment")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Comments
      </p>
    </Link>
    <Link href="/dashboard/media" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/media")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Media
      </p>
    </Link>
    <Link href="/dashboard/all-menu" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/all-menu")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        All Menu
      </p>
    </Link>
    <Link href="/dashboard/add-menu" passHref>
      <p
        className={`relative mt-3 flex items-center text-white text-sm py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/add-menu")
            ? "bg-[#6610f2] text-white"
            : "hover:bg-[#6610f2] hover:text-white"
        }`}
      >
        <FaCircle className="mr-2 text-xs" />
        Menu
      </p>
    </Link>
  </div>
</div>


        
         
        </nav>
        </div>
        {/* Bottom Fixed Section */}
        <div className="bg-[#071251] p-4 text-center">
    <p className="text-white font-bold">ART NURSING V1.0</p>
  </div>
      </div>

    {/* Main content area */}
    <div className="flex h-screen overflow-hidden bg-gray-100 sidebar-test w-full">
      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex justify-between items-center p-4 bg-[#071251] border-b border-gray-200">
  {/* Sidebar Collapse Button for Desktop */}
  <div className="flex items-center space-x-4">
    <button
      className="ml-3 text-white focus:outline-none hidden lg:block"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <FaBars className="w-6 h-6" />
    </button>

    {/* Sidebar toggle for Mobile */}
    <button
      className="text-white focus:outline-none lg:hidden"
      onClick={() => setSidebarOpen(true)}
    >
      <FaBars className="w-6 h-6" />
    </button>

    {/* Search Input for Desktop */}
    <div className="relative hidden lg:block w-64">
      <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white text-lg" />
      <input
        type="text"
        className="w-full pl-10 py-2 rounded-lg bg-transparent border border-[#4b4ba5] text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-300 ease-in-out hover:border-[#6a6aff]"
        placeholder="Search here..."
      />
    </div>
  </div>

  {/* Action Icons and Profile */}
  <div className="flex items-center space-x-4">
    {/* Action Icons */}
    <button className="flex items-center text-white" onClick={() => router.push("/")}>
      <FaGlobe className="w-5 h-5" />
    </button>
    {/* <button
      className="flex items-center text-white relative"
      onClick={() => router.push("/dashboard/notifications")}
    >
      <FaBell className="w-5 h-5" />
      <span className="absolute -top-1 -right-1 bg-orange-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">9+</span>
    </button> */}
    <button
      className="flex items-center text-white"
      onClick={() => router.push("/dashboard/setting")}
    >
      <FaWrench className="w-5 h-5" />
    </button>

    {/* Profile */}
    <div className="relative">
      <div
        onClick={() => setProfileDropdown(!profileDropdown)}
        className="cursor-pointer flex items-center space-x-2"
      >
        {user?.profileImage ? (
          <Image
            src={getProfileImagePath(user?.profileImage)}
            width={30}
            height={30}
            className="rounded-full border"
            alt="Profile Image"
            unoptimized
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#6610f2] flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.userName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <p className="text-white text-sm font-semibold"> {user?.username}</p>
        {profileDropdown ? <FaCaretUp className="text-white" /> : <FaCaretDown className="text-white" />}
      </div>

      {profileDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
          <div className="px-4 py-2 flex items-center">
            {user?.profileImage ? (
              <Image
                src={getProfileImagePath(user?.profileImage)}
                width={30}
                height={30}
                className="rounded-full border"
                alt="Profile Image"
                unoptimized
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[#6610f2] flex items-center justify-center">
                <span className="text-gray-500 font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="ml-3">
              <p className="font-semibold text-blue-500">
                {user?.username || "Username"}
              </p>
              <p className="text-gray-500 text-sm">
                {user?.role || "Role"}
              </p>
            </div>
          </div>
          <hr />
          <Link href="/profile" passHref>
            <button className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
              <FaUser className="mr-3" />
              Profile
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            <FaSignOutAlt className="mr-3" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  </div>
</header>


        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>

    </div>
  );
});
export default Layout;

