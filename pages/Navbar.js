import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaAngleDown, FaEnvelope, FaPhoneAlt, FaRegArrowAltCircleRight } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menus, setMenus] = useState([]); // Store dynamic menu data
  const [settings, setSettings] = useState(null); // Store dynamic settings
  const router = useRouter();

  // Fetch dynamic menu data from the API
  const fetchMenuData = async () => {
    try {
      const response = await fetch('/api/menus');
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  // Fetch dynamic header settings from the API
  const fetchSettingsData = async () => {
    try {
      const response = await fetch('/api/setting');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    fetchMenuData(); // Fetch dynamic menu data
    fetchSettingsData(); // Fetch dynamic settings data
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setOpenDropdown(null); 
      setIsMenuOpen(false); 
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const handleDropdown = (menuId) => {
    setOpenDropdown(openDropdown === menuId ? null : menuId);
  };

  return (
    <header className="border-b-4 border-[#F4A139]">
      {/* Top Bar */}
      <div className="bg-[#004080] text-white">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 py-2 max-w-7xl mx-auto text-sm">
          <div className="flex flex-col md:flex-row items-center space-x-4">
            <span className="flex items-center whitespace-nowrap">
              <FaPhoneAlt className="text-[#F4A139] me-2" />
              {settings?.topHeading?.mobileNo || '+8802222291453'}
            </span>
            <span className="flex items-center whitespace-nowrap">
              <FaEnvelope className="text-[#F4A139] me-2" />
              {settings?.topHeading?.email || 'info@art.edu.bd'}
            </span>
            <span className="flex items-center mt-1 md:mt-0 whitespace-nowrap">
              <FaRegArrowAltCircleRight className="text-[#F4A139] me-2" />
              <Link href="#" className="text-white">
                Online Certificate Verification
              </Link>
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
                src={settings?.logoUrl || '/img/default-logo.png'} // Use dynamic logo URL
                alt="Logo"
                width={150}
                height={80}
                className="header-logo"
              />
             
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
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-opacity-90 bg-[#004080]">
          <div className="max-w-7xl mx-auto">
            <nav
              className={`md:flex items-center text-white text-lg ${isMenuOpen ? 'block' : 'hidden'} md:block`}
            >
              {/* Dynamic Menus */}
              {menus?.map((menu) => (
                <div key={menu._id} className="relative group">
                  {menu.submenus && menu.submenus.length > 0 ? (
                    <div>
                      <button
                        onClick={() => handleDropdown(menu._id)}
                        className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
                      >
                        {menu.title} <FaAngleDown className="ml-2" />
                      </button>
                      {/* Dropdown */}
                      <div
                        className={`absolute z-10 ${
                          openDropdown === menu._id ? 'block' : 'hidden'
                        } md:group-hover:block text-white shadow-lg rounded py-2 w-48 left-0 top-full bg-[#004080]`}
                      >
                        {menu.submenus.map((submenu) => (
                          <Link
                            key={submenu.title}
                            href={submenu.link || '#'}
                            className="block px-4 py-2 hover:bg-[#F4A139] text-white border-b"
                          >
                            {submenu.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={menu.link || '#'}
                      className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
                    >
                      {menu.title}
                    </Link>
                  )}
                </div>
              ))}

              {/* Static Links */}
              <Link
                href="/notices"
                className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
              >
                Notice Board
              </Link>
              <Link
                href="/results"
                className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
              >
                Results
              </Link>
              <Link
                href="/blog"
                className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r"
              >
                Blog
              </Link>
              <Link
                href="/contact"
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
