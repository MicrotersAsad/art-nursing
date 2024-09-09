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
  FaCircle 
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
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Background Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black opacity-50 transition-opacity lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 transform ${
          isCollapsed ? "w-20" : "w-64"
        } overflow-y-auto bg-[#282a42] text-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
        style={{
          minWidth: isCollapsed ? "80px" : "256px",
          maxWidth: "256px",
          width: isCollapsed ? "80px" : "256px",
        }}
        onMouseEnter={() => isCollapsed && setIsCollapsed(false)} // Expands on hover only if collapsed
        onMouseLeave={() => isCollapsed && setIsCollapsed(true)} // Collapses when not hovered and initially collapsed
      >
        {/* Logo */}
        <div className="flex items-center justify-center mt-8">
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

        <nav className="mt-10">
    {/* Dashboard */}
    <div className="mt-3">
      <Link
        href="/dashboard/dashboard"
        passHref
        className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/dashboard")
            ? "bg-gray-300 text-gray-700"
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
        className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/all-notice") ||
          isActiveRoute("/dashboard/addnotice")
            ? "bg-gray-300 text-gray-700"
            : menuOpen === "notice"
            ? "bg-gray-300 text-gray-700"
            : "hover:bg-gray-300 hover:text-white"
        }`}
        onClick={() => toggleMenu("notice")}
      >
        <FaPhotoVideo className="mr-3 text-green-500" />
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
        className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/photo-gallery") ||
          isActiveRoute("/dashboard/video-gallery")
            ? "bg-gray-300 text-gray-700"
            : menuOpen === "gallery"
            ? "bg-gray-300 text-gray-700"
            : "hover:bg-gray-300 hover:text-white"
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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

    {/* Blog */}
    <div className="mt-3">
      <p
        className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/categories") ||
          isActiveRoute("/dashboard/all-blogs") ||
          isActiveRoute("/dashboard/blogs")
            ? "bg-gray-300 text-gray-700"
            : menuOpen === "blog"
            ? "bg-gray-300 text-gray-700"
            : "hover:bg-gray-300 hover:text-white"
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
        className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
          menuOpen === "pages"
            ? "bg-gray-300 text-gray-700"
            : "hover:bg-gray-300 hover:text-white"
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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

    {/* Result */}
    <div className="mt-3">
      <Link
        href="/dashboard/result"
        passHref
        className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
          isActiveRoute("/dashboard/result")
            ? "bg-gray-300 text-gray-700"
            : "hover:bg-gray-700 hover:text-white"
        }`}
      >
        <FaClipboardList className="mr-3 text-blue-500" />
        {!isCollapsed && <span>Result</span>}
      </Link>
    </div>

    {/* Manage Users */}
    <div className="mt-3">
      <p
        className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
          menuOpen === "users"
            ? "bg-gray-300 text-gray-700"
            : "hover:bg-gray-300 hover:text-white"
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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

    {/* Admission */}
    <div className="mt-3">
      <p
        className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
          menuOpen === "admission"
            ? "bg-gray-300 text-gray-700"
            : "hover:bg-gray-300 hover:text-white"
        }`}
        onClick={() => toggleMenu("admission")}
      >
        <FaBookOpen className="mr-3 text-purple-500" />
        {!isCollapsed && <span>Admission</span>}
        {!isCollapsed && (
          <span className="ml-auto">
            {menuOpen === "admission" ? <FaMinus /> : <FaPlus />}
          </span>
        )}
      </p>

      {(menuOpen === "admission" ||
        isActiveRoute("/dashboard/admission-requirements") ||
        isActiveRoute("/dashboard/tuition-fees") ||
        isActiveRoute("/dashboard/admission-form")) &&
        !isCollapsed && (
          <div className="ml-6">
            <Link href="/dashboard/admission-requirements" passHref>
              <p
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
                  isActiveRoute("/dashboard/admission-requirements")
                    ? "text-blue-400"
                    : "hover:bg-gray-600 hover:text-white"
                }`}
              >
                <FaCircle className="mr-2 text-xs" />
                Admission Info
              </p>
            </Link>
            <Link href="/dashboard/tuition-fees" passHref>
              <p
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
                  isActiveRoute("/dashboard/tuition-fees")
                    ? "text-blue-400"
                    : "hover:bg-gray-600 hover:text-white"
                }`}
              >
                <FaCircle className="mr-2 text-xs" />
                Tuition Fees
              </p>
            </Link>
            <Link href="/dashboard/admission-form" passHref>
              <p
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
                  isActiveRoute("/dashboard/admission-form")
                    ? "text-blue-400"
                    : "hover:bg-gray-600 hover:text-white"
                }`}
              >
                <FaCircle className="mr-2 text-xs" />
                Admission Form
              </p>
            </Link>
          </div>
        )}
    </div>

    {/* Program */}
    <div className="mt-3">
      <p
        className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
          menuOpen === "program"
            ? "bg-gray-300 text-gray-700"
            : "hover:bg-gray-300 hover:text-white"
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
        isActiveRoute("/dashboard/program-1") ||
        isActiveRoute("/dashboard/program-2") ||
        isActiveRoute("/dashboard/program-3")) &&
        !isCollapsed && (
          <div className="ml-6">
            <Link href="/dashboard/program-1" passHref>
              <p
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
                  isActiveRoute("/dashboard/program-1")
                    ? "text-blue-400"
                    : "hover:bg-gray-600 hover:text-white"
                }`}
              >
                <FaCircle className="mr-2 text-xs" />
                Program 1
              </p>
            </Link>
            <Link href="/dashboard/program-2" passHref>
              <p
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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

    {/* Appearance */}
    <div className="mt-3">
      <p
        className={`flex items-center py-2 px-6 cursor-pointer rounded-md ${
          menuOpen === "appearance"
            ? "bg-gray-300 text-gray-700"
            : "hover:bg-gray-300 hover:text-white"
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
        isActiveRoute("/dashboard/theme-settings") ||
        isActiveRoute("/dashboard/contact") ||
        isActiveRoute("/dashboard/allcontact") ||
        isActiveRoute("/dashboard/smtp") ||
        isActiveRoute("/dashboard/comments") ||
        isActiveRoute("/dashboard/media") ||
        isActiveRoute("/dashboard/menu-management")) &&
        !isCollapsed && (
          <div className="ml-6">
            <Link href="/dashboard/theme-settings" passHref>
              <p
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
                  isActiveRoute("/dashboard/theme-settings")
                    ? "text-blue-400"
                    : "hover:bg-gray-600 hover:text-white"
                }`}
              >
                <FaCircle className="mr-2 text-xs" />
                Settings
              </p>
            </Link>
            <Link href="/dashboard/contact" passHref>
              <p
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
                  isActiveRoute("/dashboard/smtp")
                    ? "text-blue-400"
                    : "hover:bg-gray-600 hover:text-white"
                }`}
              >
                <FaCircle className="mr-2 text-xs" />
                SMTP
              </p>
            </Link>
            <Link href="/dashboard/comments" passHref>
              <p
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
                  isActiveRoute("/dashboard/comments")
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
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
                  isActiveRoute("/dashboard/media")
                    ? "text-blue-400"
                    : "hover:bg-gray-600 hover:text-white"
                }`}
              >
                <FaCircle className="mr-2 text-xs" />
                Media
              </p>
            </Link>
            <Link href="/dashboard/menu-management" passHref>
              <p
                className={`relative flex items-center py-2 px-6 cursor-pointer ${
                  isActiveRoute("/dashboard/menu-management")
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
        className="flex items-center py-2 px-6 cursor-pointer rounded-md hover:bg-gray-300 hover:text-white"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="mr-3 text-red-500" />
        {!isCollapsed && <span>Logout</span>}
      </p>
    </div>
  </nav>
      </div>

      
      {/* Main content area */}
      {/* Main content area */}
<div className="flex-1 flex flex-col overflow-hidden">
  {/* Top Bar */}
  <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-gray-200">
    {/* Sidebar Collapse Button for Desktop (hidden on mobile) */}
    <button
      className="ml-3 text-gray-500 focus:outline-none hidden lg:block" // Hidden on mobile, shown on larger screens
      onClick={() => setIsCollapsed(!isCollapsed)}
    >
      <FaBars className="w-6 h-6" />
    </button>

    {/* Sidebar toggle for Mobile (hidden on desktop) */}
    <button
      className="text-gray-500 focus:outline-none lg:hidden" // Shown only on mobile, hidden on larger screens
      onClick={() => setSidebarOpen(true)}
    >
      <FaBars className="w-6 h-6" />
    </button>
    

      
      {/* Search Input for Mobile (hidden on desktop) */}
    <div className="relative block lg:hidden"> {/* Shown only on mobile */}
      <input
        type="text"
        className="w-full px-4 py-2 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
        placeholder="Search"
      />
      <FaSearch className="absolute top-3 right-3 text-gray-400" />
    </div>
    {/* Search Input for Desktop (hidden on mobile) */}
    <div className="relative hidden lg:block"> {/* Hidden on mobile */}
      <input
        type="text"
        className="w-full px-4 py-2 rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 text-sm"
        placeholder="Search"
      />
      <FaSearch className="absolute top-3 right-3 text-gray-400" />
    </div>
   <div>
   <div className="relative">
   {user?.profileImage ? (
        <div onClick={() => setProfileDropdown(!profileDropdown)} className="cursor-pointer">
          <Image
            src={getProfileImagePath(user.profileImage)} // Ensure correct image path is used
            width={64}
            height={64}
            className="rounded-full border"
            alt="Profile Image"
            unoptimized
          />
        </div>
      ) : (
        <p>No Profile Image</p>
      )}

      {profileDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
          >
            <FaSignOutAlt className="inline mr-2" />
            Logout
          </button>
        </div>
      )}
   </div>
    </div>

    {/* Profile Image and Dropdown */}
    <div className="relative">
      
    </div>
  </header>

  {/* Main content */}
  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
    <div className="container mx-auto px-6 py-8">{children}</div>
  </main>
</div>

    </div>
 );
});
export default Layout;
