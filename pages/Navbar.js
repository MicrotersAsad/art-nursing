import { useState } from 'react';
import Image from 'next/image';
import { FaAngleDown } from 'react-icons/fa'; // Import arrow icon from react-icons
import logo from "../public/img/logo (3).png"; // Ensure this is your logo path
import Link from 'next/link';


const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(""); // Keep track of which dropdown is open
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu

  // Function to handle opening a dropdown and closing others
  const handleDropdown = (menu) => {
    if (openDropdown === menu) {
      setOpenDropdown(""); // Close if it's already open
    } else {
      setOpenDropdown(menu); // Open the selected menu
    }
  };

  return (
    <header>
      {/* Top Bar */}
      <div className="bg-[#004080] text-white flex justify-between items-center px-4 py-2 text-sm">
        <div className="flex items-center space-x-4 max-w-7xl mx-auto">
          <span className="flex items-center whitespace-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89-5.26a2 2 0 012.22 0L21 8m-9 6v6m-6 0h12a2 2 0 002-2V10a2 2 0 00-2-2h-5.5m-8.5 0h12M9 21h6"
              />
            </svg>
            +8802222291453
          </span>
          <span className="flex items-center whitespace-nowrap">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12V7a4 4 0 10-8 0v5a4 4 0 104 0v-5"
              />
            </svg>
            info@fiu.edu.bd
          </span>
         
        </div>
      </div>

      {/* Main Header */}
      <div className="relative bg-cover bg-center">
        <div className="bg-opacity-90 bg-[#004080] py-4 px-4 md:px-8 header-background">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Image
                src={logo}
                alt="FIU Logo"
                width={150}
                height={150}
                className="header-logo"
              />
              <div>
                <Link href="/">
                  <h1 className="text-3xl font-bold text-[#004080]">
                    Art Nursing College
                  </h1>
                </Link>
                <p className="text-sm text-black">Start Here Succeed Here</p>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="block md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="bg-opacity-90 bg-[#004080]">
          <nav className={`md:flex justify-center items-center space-x-6 text-white text-lg max-w-7xl mx-auto ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            {/* About FIU Dropdown */}
            <div className="relative flex items-center whitespace-nowrap">
  <button
    onClick={() => handleDropdown("aboutFiu")}
    className="hover:bg-[#F4A139] md:border-l md:border-r border-white px-4 py-2 flex items-center focus:outline-none transition-all"
  >
    About FIU <FaAngleDown className="ml-2" />
  </button>
  {openDropdown === "aboutFiu" && (
    <div className="absolute z-10 text-white shadow-lg rounded py-2 w-48 left-0 top-full bg-[#004080]">
     <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139] text-white">About Us</Link>
     <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139] text-white">Board of Trustees</Link>
     <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139] text-white">Syndicate</Link>
    </div>
  )}
</div>


            {/* Administration Dropdown */}
            <div className="relative flex items-center whitespace-nowrap">
              <button
                onClick={() => handleDropdown("administration")}
                className="hover:bg-[#F4A139] md:border-l md:border-r border-white px-4 py-2 flex items-center focus:outline-none transition-all"
              >
                Administration <FaAngleDown className="ml-2" />
              </button>
              {openDropdown === "administration" && (
               <div className="absolute z-10  text-white shadow-lg rounded  py-2 w-64  left-0 top-full bg-[#004080]"> {/* Adjusted position */}
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Office of Vice Chancellor</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Office of Treasurer</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Office of Registrar</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Controller of Examinations</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Office of Librarian</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Office of Public Relations</Link>
                </div>
              )}
            </div>

            {/* Academics Dropdown */}
            <div className="relative flex items-center whitespace-nowrap">
              <button
                onClick={() => handleDropdown("academics")}
                className="hover:bg-[#F4A139] md:border-l md:border-r border-white px-4 py-2 flex items-center focus:outline-none transition-all"
              >
                Academics <FaAngleDown className="ml-2" />
              </button>
              {openDropdown === "academics" && (
                 <div className="absolute z-10  text-white shadow-lg rounded  py-2 w-60  left-0 top-full bg-[#004080]"> {/* Adjusted position */}
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Faculty of Business</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Faculty of Engineering</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Faculty of Law</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Faculty of Science</Link>
                </div>
              )}
            </div>

            {/* Admission Dropdown */}
            <div className="relative flex items-center whitespace-nowrap">
              <button
                onClick={() => handleDropdown("admission")}
                className="hover:bg-[#F4A139] md:border-l md:border-r border-white px-4 py-2 flex items-center focus:outline-none transition-all"
              >
                Admission <FaAngleDown className="ml-2" />
              </button>
              {openDropdown === "admission" && (
                <div className="absolute z-10  text-white shadow-lg rounded  py-2 w-60 left-0 top-full bg-[#004080]"> {/* Adjusted position */}
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Admission Requirements</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Tuition Fees</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Admission Form</Link>
                </div>
              )}
            </div>

            {/* FIU Wings Dropdown */}
            <div className="relative flex items-center whitespace-nowrap">
              <button
                onClick={() => handleDropdown("fiuWings")}
                className="hover:bg-[#F4A139] md:border-l md:border-r border-white px-4 py-2 flex items-center focus:outline-none transition-all"
              >
                FIU Wings <FaAngleDown className="ml-2" />
              </button>
              {openDropdown === "fiuWings" && (
               <div className="absolute z-10  text-white shadow-lg rounded  py-2 w-64  left-0 top-full bg-[#004080]"> {/* Adjusted position */}
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Subcategory 1</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Subcategory 2</Link>
                 <Link href="#" className="block px-4 py-2 hover:bg-[#F4A139]  text-white">Subcategory 3</Link>
                </div>
              )}
            </div>

           <Link href="#" className="hover:bg-[#F4A139] md:border-l md:border-r border-white px-4 py-2 whitespace-nowrap">Career</Link>
           <Link href="#" className="hover:bg-[#F4A139] md:border-l md:border-r border-white px-4 py-2 whitespace-nowrap">Contact Us</Link>
           <Link href="#" className="hover:bg-[#F4A139] md:border-l md:border-r border-white px-4 py-2 whitespace-nowrap">Web-Mail</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
