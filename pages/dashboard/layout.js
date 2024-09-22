
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
  FaPlus,
  FaMinus,
  FaSignOutAlt,
  FaClipboardList,
  FaCircle, 
  FaUser,
  FaArrowLeft
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
  className={`fixed inset-y-0 left-0 z-40 transform transition-all duration-300 bg-[#282a42] text-white shadow-lg ${isCollapsed ? 'w-24' : 'w-64'} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 overflow-auto h-screen`} /* Added 'overflow-auto' and 'h-screen' */
  onMouseEnter={() => isCollapsed && setIsCollapsed(false)} 
  onMouseLeave={() => isCollapsed && setIsCollapsed(true)}
>
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

        <nav className="mt-10 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 text-white">
          {/* Dashboard */}
          <div className="mt-3">
            <Link
              href="/dashboard/overview"
              passHref
              className={`flex items-center text-white py-2 px-6 cursor-pointer rounded-md ${
                isActiveRoute("/dashboard/overview")
                  ? "bg-gray-500 text-gray-700"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
            >
              <FaTachometerAlt className="mr-3 text-blue-500" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </div>

          {/* Notice Board */}
          <div className="mt-3">
            <p
              className={`flex items-center  py-2 text-white px-6 cursor-pointer rounded-md ${
                isActiveRoute("/dashboard/all-notice") ||
                isActiveRoute("/dashboard/addnotice")
                  ? "bg-gray-500 text-gray-700"
                  : menuOpen === "notice"
                  ? "bg-gray-500 text-gray-700"
                  : "hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => toggleMenu("notice")}
            >
              <FaBell className="mr-3 text-green-500" />
              {!isCollapsed && <span>Notice</span>}
              {!isCollapsed && (
                <span className="ml-auto">
                  {menuOpen === "notice" ? <FaMinus /> : <FaPlus />}
                </span>
              )}
            </p>

            {(menuOpen === "notice" ||
              isActiveRoute("/dashboard/all-notice") ||
              isActiveRoute("/dashboard/addnotice")) &&
              !isCollapsed && (
                <div className="ml-6">
                  <Link href="/dashboard/all-notice" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/all-notice")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      All Notice
                    </p>
                  </Link>
                  <Link href="/dashboard/addnotice" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/addnotice")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Add Notice
                    </p>
                  </Link>
                </div>
              )}
          </div>

          {/* Gallery */}
          <div className="mt-3">
            <p
              className={`flex items-center text-white py-2 px-6 cursor-pointer rounded-md ${
                isActiveRoute("/dashboard/photo-gallery") ||
                isActiveRoute("/dashboard/video-gallery")
                  ? "bg-gray-500 text-gray-700"
                  : menuOpen === "gallery"
                  ? "bg-gray-500 text-gray-700"
                  : "hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => toggleMenu("gallery")}
            >
              <FaPhotoVideo className="mr-3 text-green-500" />
              {!isCollapsed && <span>Gallery</span>}
              {!isCollapsed && (
                <span className="ml-auto">
                  {menuOpen === "gallery" ? <FaMinus /> : <FaPlus />}
                </span>
              )}
            </p>

            {(menuOpen === "gallery" ||
              isActiveRoute("/dashboard/photo-gallery") ||
              isActiveRoute("/dashboard/video-gallery")) &&
              !isCollapsed && (
                <div className="ml-6">
                  <Link href="/dashboard/photo-gallery" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/photo-gallery")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Photo Gallery
                    </p>
                  </Link>
                  <Link href="/dashboard/video-gallery" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/video-gallery")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Video Gallery
                    </p>
                  </Link>
                </div>
              )}
          </div>
{/* Banner Management */}
<div className="mt-3">
            <p
              className={`flex items-center text-white py-2 px-6 cursor-pointer rounded-md ${
                isActiveRoute("/dashboard/banner")
                  ? "bg-gray-500 text-gray-700"
                  : menuOpen === "banner"
                  ? "bg-gray-500 text-gray-700"
                  : "hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => toggleMenu("banner")}
            >
              <FaPhotoVideo className="mr-3 text-green-500" />
              {!isCollapsed && <span>Banner Management</span>}
              {!isCollapsed && (
                <span className="ml-auto">
                  {menuOpen === "banner" ? <FaMinus /> : <FaPlus />}
                </span>
              )}
            </p>

            {(menuOpen === "banner" || isActiveRoute("/dashboard/banner")) &&
              !isCollapsed && (
                <div className="ml-6">
                  <Link href="/dashboard/banner" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/banner")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                       Banners
                    </p>
                  </Link>
                </div>
              )}
          </div>
          {/* Blog */}
          <div className="mt-3">
            <p
              className={`flex items-center text-white py-2 px-6 cursor-pointer rounded-md ${
                isActiveRoute("/dashboard/categories") ||
                isActiveRoute("/dashboard/all-blogs") ||
                isActiveRoute("/dashboard/blogs")
                  ? "bg-gray-500 text-gray-700"
                  : menuOpen === "blog"
                  ? "bg-gray-500 text-gray-700"
                  : "hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => toggleMenu("blog")}
            >
              <FaBlog className="mr-3 text-orange-500" />
              {!isCollapsed && <span>Blog</span>}
              {!isCollapsed && (
                <span className="ml-auto">
                  {menuOpen === "blog" ? <FaMinus /> : <FaPlus />}
                </span>
              )}
            </p>

            {(menuOpen === "blog" ||
              isActiveRoute("/dashboard/categories") ||
              isActiveRoute("/dashboard/all-blogs") ||
              isActiveRoute("/dashboard/blogs")) &&
              !isCollapsed && (
                <div className="ml-6">
                  <Link href="/dashboard/categories" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/categories")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Categories
                    </p>
                  </Link>
                  <Link href="/dashboard/all-blogs" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/all-blogs")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      All Posts
                    </p>
                  </Link>
                  <Link href="/dashboard/blogs" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/blogs")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Add Post
                    </p>
                  </Link>
                </div>
              )}
          </div>

          {/* Pages */}
          <div className="mt-3">
            <p
              className={`flex items-center text-white py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === "pages"
                  ? "bg-gray-500 text-gray-700"
                  : "hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => toggleMenu("pages")}
            >
              <FaFileAlt className="mr-3 text-blue-500" />
              {!isCollapsed && <span>Pages</span>}
              {!isCollapsed && (
                <span className="ml-auto">
                  {menuOpen === "pages" ? <FaMinus /> : <FaPlus />}
                </span>
              )}
            </p>

            {(menuOpen === "pages" ||
              isActiveRoute("/dashboard/all-pages") ||
              isActiveRoute("/dashboard/add-page")) &&
              !isCollapsed && (
                <div className="ml-6">
                  <Link href="/dashboard/all-pages" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/all-pages")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      All Pages
                    </p>
                  </Link>
                  <Link href="/dashboard/add-page" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/add-page")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Add New Page
                    </p>
                  </Link>
                </div>
              )}
          </div>

          {/* Manage Users */}
          <div className="mt-3">
            <p
              className={`flex items-center text-white py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === "users"
                  ? "bg-gray-500 text-gray-700"
                  : "hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => toggleMenu("users")}
            >
              <FaUsers className="mr-3 text-green-500" />
              {!isCollapsed && <span>Manage Users</span>}
              {!isCollapsed && (
                <span className="ml-auto">
                  {menuOpen === "users" ? <FaMinus /> : <FaPlus />}
                </span>
              )}
            </p>

            {(menuOpen === "users" ||
              isActiveRoute("/dashboard/admin-list") ||
              isActiveRoute("/dashboard/add-admin")) &&
              !isCollapsed && (
                <div className="ml-6">
                  <Link href="/dashboard/admin-list" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/admin-list")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Admin List
                    </p>
                  </Link>
                  <Link href="/dashboard/add-admin" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/add-admin")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Add Admin
                    </p>
                  </Link>
                </div>
              )}
          </div>
  {/* Program */}
  <div className="mt-3">
            <p
              className={`flex items-center text-white py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === "program"
                  ? "bg-gray-500 text-gray-700"
                  : "hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => toggleMenu("program")}
            >
              <FaUserGraduate className="mr-3 text-blue-500" />
              {!isCollapsed && <span>Program</span>}
              {!isCollapsed && (
                <span className="ml-auto">
                  {menuOpen === "program" ? <FaMinus /> : <FaPlus />}
                </span>
              )}
            </p>

            {(menuOpen === "program" ||
              isActiveRoute("/dashboard/add-programme") ||
              isActiveRoute("/dashboard/program-2") ||
              isActiveRoute("/dashboard/program-3")) &&
              !isCollapsed && (
                <div className="ml-6">
                  <Link href="/dashboard/add-programme" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/add-programme")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Add Programme
                    </p>
                  </Link>
                  <Link href="/dashboard/program-2" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/program-2")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Program 2
                    </p>
                  </Link>
                  <Link href="/dashboard/program-3" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/program-3")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Program 3
                    </p>
                  </Link>
                </div>
              )}
          </div>

          {/* About */}
          <div className="mt-3">
            <p
              className={`flex items-center text-white py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === "about"
                  ? "bg-gray-500 text-gray-700"
                  : "hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => toggleMenu("about")}
            >
              <FaUserGraduate className="mr-3 text-blue-500" />
              {!isCollapsed && <span>About</span>}
              {!isCollapsed && (
                <span className="ml-auto">
                  {menuOpen === "about" ? <FaMinus /> : <FaPlus />}
                </span>
              )}
            </p>

            {(menuOpen === "about" ||
              isActiveRoute("/dashboard/about-us") ||
              isActiveRoute("/dashboard/governing") ||
              isActiveRoute("/dashboard/staff") ||
              isActiveRoute("/dashboard/teacher") ||
              isActiveRoute("/dashboard/achievement")) &&
              !isCollapsed && (
                <div className="ml-6">
                  <Link href="/dashboard/about-us" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/about-us")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      About Us
                    </p>
                  </Link>
                  <Link href="/dashboard/governing" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/governing")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Governing Body
                    </p>
                  </Link>
                  <Link href="/dashboard/staff" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/staff")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Staff Information
                    </p>
                  </Link>
                  <Link href="/dashboard/teacher" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/teacher")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Teacher Information
                    </p>
                  </Link>
                  <Link href="/dashboard/achievement" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/achievement")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Achievement
                    </p>
                  </Link>
                </div>
              )}
          </div>

          {/* Appearance */}
          <div className="mt-3">
            <p
              className={`flex items-center text-white py-2 px-6 cursor-pointer rounded-md ${
                menuOpen === "appearance"
                  ? "bg-gray-500 text-gray-700"
                  : "hover:bg-gray-500 hover:text-white"
              }`}
              onClick={() => toggleMenu("appearance")}
            >
              <FaCogs className="mr-3 text-red-500" />
              {!isCollapsed && <span>Appearance</span>}
              {!isCollapsed && (
                <span className="ml-auto">
                  {menuOpen === "appearance" ? <FaMinus /> : <FaPlus />}
                </span>
              )}
            </p>

            {(menuOpen === "appearance" ||
              isActiveRoute("/dashboard/setting") ||
              isActiveRoute("/dashboard/fotter-management") ||
              isActiveRoute("/dashboard/contact") ||
              isActiveRoute("/dashboard/allcontact") ||
              isActiveRoute("/dashboard/smtp") ||
              isActiveRoute("/dashboard/comment") ||
              isActiveRoute("/dashboard/media") ||
              isActiveRoute("/dashboard/all-menu") ||
              isActiveRoute("/dashboard/add-menu")) &&
              !isCollapsed && (
                <div className="ml-6">
                  <Link href="/dashboard/setting" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/setting")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Settings
                    </p>
                  </Link>
                  <Link href="/dashboard/fotter-management" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/fotter-management")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Footer
                    </p>
                  </Link>
                  <Link href="/dashboard/contact" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/contact")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Contact
                    </p>
                  </Link>
                  <Link href="/dashboard/allcontact" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/allcontact")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      All Contact
                    </p>
                  </Link>
                  <Link href="/dashboard/smtp" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/smtp")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      SMTP
                    </p>
                  </Link>
                  <Link href="/dashboard/comment" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/comment")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Comments
                    </p>
                  </Link>
                  <Link href="/dashboard/media" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/media")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Media
                    </p>
                  </Link>
                  <Link href="/dashboard/all-menu" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/all-menu")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      All Menu
                    </p>
                  </Link>
                  <Link href="/dashboard/add-menu" passHref>
                    <p
                      className={`relative flex items-center text-white py-2 px-6 cursor-pointer ${
                        isActiveRoute("/dashboard/add-menu")
                          ? "text-blue-400"
                          : "hover:bg-gray-600 hover:text-white"
                      }`}
                    >
                      <FaCircle className="mr-2 text-xs" />
                      Menu
                    </p>
                  </Link>
                </div>
              )}
          </div>

          {/* Logout */}
          <div className="mt-3">
            <p
              className="flex items-center text-white py-2 px-6 cursor-pointer rounded-md hover:bg-gray-500 hover:text-white"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="mr-3 text-red-500" />
              {!isCollapsed && <span>Logout</span>}
            </p>
          </div>
        </nav>
      </div>

    {/* Main content area */}
<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
  {/* Top Bar */}
  <header className="flex justify-between items-center px-4 py-2 bg-white border-b-4 border-gray-200">
    {/* Sidebar Collapse Button for Desktop */}
    <button
      className="ml-3 text-gray-500 focus:outline-none hidden lg:block"
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <FaBars className="w-6 h-6" />
    </button>

    {/* Sidebar toggle for Mobile */}
    <button
      className="text-gray-500 focus:outline-none lg:hidden"
      onClick={() => setSidebarOpen(true)}
    >
      <FaBars className="w-6 h-6" />
    </button>

    {/* Search Input for Desktop */}
    <div className="relative w-50 hidden lg:block">
      <input
        type="text"
        className="w-full px-4 py-2 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
        placeholder="Search"
      />
      <FaSearch className="absolute top-3 right-3 text-gray-400" />
    </div>
    <button
        className="flex items-center text-white space-x-2 mt-4 text-blue-600 hover:text-blue-800 mb-4"
        onClick={() => router.push('/')}
      >
        <FaArrowLeft className="w-4 h-4" />
        <span>Back to Website</span>
      </button>
    {/* Profile & Notification */}
    <div className="relative ms-5">
      <div
        onClick={() => setProfileDropdown(!profileDropdown)}
        className="cursor-pointer flex items-center text-white"
      >
        {/* Profile Image */}
        {user?.profileImage ? (
          <Image
            src={getProfileImagePath(user?.profileImage)}
            width={40}
            height={40}
            className="rounded-full border"
            alt="Profile Image"
            unoptimized
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center text-white justify-center">
            <span className="text-gray-500 font-bold text-xl">
              {user?.userName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {profileDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
          <div className="px-4 py-2 flex items-center text-white">
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
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center text-white justify-center">
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
            <button className="flex items-center text-white w-full px-4 py-2 text-gray-800 hover:bg-gray-100">
              <FaUser className="mr-3" />
              Profile
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center text-white w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            <FaSignOutAlt className="mr-3" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  </header>

  {/* Main content */}
  <main className="flex-1 overflow-y-auto bg-gray-100">
    <div className="container mx-auto px-6 py-8">
      {/* Back button */}
    

      {children}
    </div>
  </main>
</div>

    </div>
  );
});
export default Layout;
