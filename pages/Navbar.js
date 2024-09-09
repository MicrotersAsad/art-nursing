import { useState } from 'react';
import Image from 'next/image';
import { FaAngleDown, FaEnvelope, FaPhone, FaRegArrowAltCircleRight, FaRegTimesCircle, FaThumbsUp } from 'react-icons/fa'; // Import arrow icon from react-icons
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

  return  (
    <header className="border-b-4 border-[#F4A139]">
      {/* Top Bar */}
      <div className="bg-[#004080] text-white">
        <div className="flex justify-between items-center px-4 py-2 max-w-7xl mx-auto text-sm">
          <div className="flex items-center space-x-4">
            <span className="flex items-center whitespace-nowrap">
              <FaPhone className='text-[#F4A139] me-2'/>
              +8802222291453
            </span>
            <span className="flex items-center whitespace-nowrap">
            <FaEnvelope className='text-[#F4A139] me-2'/>
              info@fiu.edu.bd
            </span>
            <span className="flex items-center whitespace-nowrap">
            <FaRegArrowAltCircleRight  className='text-[#F4A139] me-2'/>
              <Link href="#" className='text-white'>Online Certificate Verification</Link>
            </span>
          </div>
        </div>
      </div>


   

      {/* Main Header */}
      <div className="relative bg-cover bg-center">
        <div className="bg-opacity-90 bg-[#004080] py-4 px-4 md:px-8">
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
                  <h1 className="text-3xl font-bold text-white">
                    Art Nursing College
                  </h1>
                </Link>
                <p className="text-sm text-gray-200">Start Here Succeed Here</p>
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
          <div className="max-w-7xl mx-auto">
            <nav
              className={`md:flex justify-start items-center text-white text-lg ${isMenuOpen ? 'block' : 'hidden'} md:block`}
            >
 <Link
                href="#"
                className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
              >
                Home
              </Link>
              {/* About FIU Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleDropdown("aboutFiu")}
                  className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
                >
                  About <FaAngleDown className="ml-2" />
                </button>
                {openDropdown === "aboutFiu" && (
                  <div className="absolute z-10 text-white shadow-lg rounded py-2 w-48 left-0 top-full bg-[#004080]">
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                      About Us
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                      Governing Body
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                     Staff Information
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                     Teacher's Information
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                    Achievements
                    </Link>
                  </div>
                )}
              </div>

              {/* Admission Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleDropdown("admission")}
                  className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
                >
                  Admission <FaAngleDown className="ml-2" />
                </button>
                {openDropdown === "admission" && (
                  <div className="absolute z-10 text-white shadow-lg rounded py-2 w-60 left-0 top-full bg-[#004080]">
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                      Admission Requirements
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                      Tuition Fees
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                      Admission Form
                    </Link>
                  </div>
                )}
              </div>
              {/* Administration Dropdown */}
              {/* <div className="relative">
                <button
                  onClick={() => handleDropdown("administration")}
                  className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
                >
                  Administration <FaAngleDown className="ml-2" />
                </button>
                {openDropdown === "administration" && (
                  <div className="absolute z-10 text-white shadow-lg rounded py-2 w-64 left-0 top-full bg-[#004080]">
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white"
                    >
                      Office of Vice Chancellor
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white"
                    >
                      Office of Treasurer
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white"
                    >
                      Office of Registrar
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white"
                    >
                      Controller of Examinations
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white"
                    >
                      Office of Librarian
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white"
                    >
                      Office of Public Relations
                    </Link>
                  </div>
                )}
              </div> */}

              {/* Academics Dropdown */}
              <div className="relative">
                <button
                  onClick={() => handleDropdown("academics")}
                  className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
                >
                  Program & Courses <FaAngleDown className="ml-2" />
                </button>
                {openDropdown === "academics" && (
                  <div className="absolute z-10 text-white shadow-lg rounded py-2 w-60 left-0 top-full bg-[#004080]">
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                      Diploma in Nursing Science and Midwifery
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                       BSC in Nursing (Basic) - 4 Years
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                      BSC in Nursing (Post Basic) - 2 Years

                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white md:border-b"
                    >
                      Faculty of Science
                    </Link>
                  </div>
                )}
              </div>


              {/* FIU Wings Dropdown */}
              {/* <div className="relative">
                <button
                  onClick={() => handleDropdown("fiuWings")}
                  className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
                >
                  FIU Wings <FaAngleDown className="ml-2" />
                </button>
                {openDropdown === "fiuWings" && (
                  <div className="absolute z-10 text-white shadow-lg rounded py-2 w-64 left-0 top-full bg-[#004080]">
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white"
                    >
                      Subcategory 1
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white"
                    >
                      Subcategory 2
                    </Link>
                    <Link
                      href="#"
                      className="block px-4 py-2 hover:bg-[#F4A139] text-white"
                    >
                      Subcategory 3
                    </Link>
                  </div>
                )}
              </div> */}

              {/* Static Links */}
              <Link
                href="#"
                className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
              >
                Notice Board
              </Link>
              <Link
                href="/"
                className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
              >
                Results
              </Link>
              <Link
                href="#"
                className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
              >
                Blog
              </Link>
              <Link
                href="#"
                className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all"
              >
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </div>
     


    </header>
    
  );
};

export default Header;
