import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { FaAngleDown, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menus, setMenus] = useState([]); // Store dynamic menu data from API
  const [settings, setSettings] = useState(null); // Store dynamic settings from API
  const [isLoading, setIsLoading] = useState(false); // Loading state for API
  const { user } = useAuth(); // Get the user object from AuthContext
  const router = useRouter();

  // Fetch dynamic menu data from API
  const fetchMenuData = async () => {
    setIsLoading(true); // Set loading state
    try {
      const response = await fetch('/api/menus'); // Fetch menus from API
      const data = await response.json();
      setMenus(data); // Set the menus data
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
    setIsLoading(false); // Stop loading
  };

  // Fetch dynamic settings from API
  const fetchSettingsData = async () => {
    setIsLoading(true); // Set loading state
    try {
      const response = await fetch('/api/settings'); // Fetch settings from API
      const data = await response.json();
      setSettings(data); // Set the settings data
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
    setIsLoading(false); // Stop loading
  };

  useEffect(() => {
    fetchMenuData(); // Fetch menus on mount
    fetchSettingsData(); // Fetch settings on mount
  }, []);

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
              {/* Show dynamic phone number from API or default value */}
              {settings?.topHeading?.mobileNo || '+8802222291453'}
            </span>
            <span className="flex items-center whitespace-nowrap">
              <FaEnvelope className="text-[#F4A139] me-2" />
              {/* Show dynamic email from API or default value */}
              {settings?.topHeading?.email || 'artnursingcollege@gmail.com'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="relative bg-cover bg-center" style={{ backgroundImage: `url(${settings?.headerImageUrl || 'https://artncedubd.com/uploads/untitled-design.png'})` }}>
        <div className="bg-opacity-90 py-4 px-4 md:px-8">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              {/* Dynamic Logo */}
              <Image
                src={settings?.logoUrl || '/img/default-logo.png'}
                alt="Logo"
                width={150}
                height={80}
                className="header-logo"
              />
            </div>

            {/* Mobile Menu Toggle */}
            <button className="block md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="bg-opacity-90 bg-[#004080]">
          <div className="max-w-7xl mx-auto">
            <nav className={`md:flex items-center text-white text-lg ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
              {/* Render dynamic menus */}
              {menus?.map((menu) => (
                <div key={menu._id} className="relative group">
                  {menu.submenus && menu.submenus.length > 0 ? (
                    <div>
                      <button onClick={() => handleDropdown(menu._id)} className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r">
                        {menu.title} <FaAngleDown className="ml-2" />
                      </button>
                      <div className={`absolute z-10 ${openDropdown === menu._id ? 'block' : 'hidden'} md:group-hover:block text-white shadow-lg rounded py-2 w-48 left-0 top-full bg-[#004080]`}>
                        {menu.submenus.map((submenu) => (
                          <Link key={submenu.title} href={submenu.link || '#'}>
                            <span className="block px-4 py-2 hover:bg-[#F4A139] text-white border-b">{submenu.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link href={menu.link || '#'}>
                      <span className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r">{menu.title}</span>
                    </Link>
                  )}
                </div>
              ))}

              {/* Other static links */}
              <Link href="/notices">
                <span className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r">Notice Board</span>
              </Link>
              <Link href="/results">
                <span className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r">Results</span>
              </Link>
              <Link href="/blog">
                <span className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r">Blog</span>
              </Link>
              <Link href="/contact">
                <span className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all">Contact Us</span>
              </Link>

              {/* Conditionally render Dashboard link for super admin */}
              {user?.role === 'super admin' && (
                <Link href="/dashboard/overview">
                  <span className="hover:bg-[#F4A139] px-6 py-2 flex items-center focus:outline-none transition-all md:border-r md:border-l">Dashboard</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Loader */}
      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-gray-800">
          <div className="loader">Loading...</div>
        </div>
      )}
    </header>
  );
};

export default Header;
