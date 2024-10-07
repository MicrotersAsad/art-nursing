import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaFacebook, FaYoutube, FaPhoneAlt, FaEnvelope, FaInfoCircle, FaGraduationCap, FaBook, FaNewspaper, } from 'react-icons/fa';
import Link from 'next/link';

// Icon mapping object for dynamic links (adjust based on your API data)
const iconMapping = {
  AboutUs: FaInfoCircle,
  Brochure: FaBook,
  News: FaNewspaper,
  OurFaculty: FaGraduationCap,
};

const Footer = () => {
  const [footerData, setFooterData] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/footer');
        if (response.ok) {
          const data = await response.json();
          setFooterData(data || {});
     
          
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchSettings();
  }, []);

  if (!footerData) {
    return null; // Return nothing if the data hasn't been loaded yet
  }

  return (
    <footer className="bg-[#00254c] text-white py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        {/* Column 1 - Logo and Description */}
        <div>
          {footerData.logoUrl && (
            <Image
              src={footerData.logoUrl}
              alt="Art Nursing College"
              width={80}
              height={80}
              className="h-20 w-20 mb-4"
            />
          )}
          <p className="text-pink-500 text-lg mb-4 font-bold">Art Nursing College</p>
          <p className="text-gray-300">
            Art Nursing College (ANC) is the Supreme Private Nursing College in Comilla District of Bangladesh.
          </p>

          {/* Social Icons - Assuming only Facebook and YouTube */}
          <div className="flex space-x-4 mt-4">
            {footerData.socialLinks?.facebook && (
              <Link href={footerData.socialLinks.facebook} className="text-white bg-blue-600 p-2 rounded-full">
                <FaFacebook />
              </Link>
            )}
            {footerData.socialLinks?.youtube && (
              <Link href={footerData.socialLinks.youtube} className="text-white bg-red-600 p-2 rounded-full">
                <FaYoutube />
              </Link>
            )}
          </div>
        </div>

        {/* Column 2 - Featured Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Featured Links</h3>
          <ul className="space-y-2">
            {footerData.featuredLinks?.map((link, index) => {
              if (!link.name || !link.url) return null; // Check for valid links
              const Icon = iconMapping[link.name.replace(/\s+/g, '')] || FaInfoCircle; // Map name to icons
              return (
                <li key={index} className="flex items-center">
                  <Icon className="mr-2" />
                  <Link href={link.url} className="text-gray-300 hover:text-pink-500">
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 3 - Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {footerData.quickLinks?.map((link, index) => {
              if (!link.name || !link.url) return null; // Check for valid links
              return (
                <li key={index} className="flex items-center">
                  <FaGraduationCap className="mr-2" />
                  <Link href={link.url} className="text-gray-300 hover:text-pink-500">
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 4 - Contact Information */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Information</h3>
          <p className="text-gray-300 mb-4">{footerData.contactInfo?.address}</p>
          <ul className="space-y-2">
            {footerData.contactInfo?.phone1 && (
              <li className="flex items-center">
                <FaPhoneAlt className="mr-2" />
                <Link href={`tel:${footerData.contactInfo.phone1}`} className="text-gray-300 hover:text-pink-500">
                  {footerData.contactInfo.phone1}
                </Link>
              </li>
            )}
            {footerData.contactInfo?.phone2 && (
              <li className="flex items-center">
                <FaPhoneAlt className="mr-2" />
                <Link href={`tel:${footerData.contactInfo.phone2}`} className="text-gray-300 hover:text-pink-500">
                  {footerData.contactInfo.phone2}
                </Link>
              </li>
            )}
            {footerData.contactInfo?.phone3 && (
              <li className="flex items-center">
                <FaPhoneAlt className="mr-2" />
                <Link href={`tel:${footerData.contactInfo.phone3}`} className="text-gray-300 hover:text-pink-500">
                  {footerData.contactInfo.phone3}
                </Link>
              </li>
            )}
           {footerData.contactInfo?.phone3 && (
              <li className="flex items-center">
                <FaEnvelope className="mr-2" />
                <Link href={`mailto:${footerData.contactInfo.email}`} className="text-sm text-gray-300 hover:text-pink-500 break-all">
  {footerData.contactInfo.email}
</Link>

              </li>
            )}

          </ul>
        </div>

        {/* Column 5 - Approved By Section */}
        <div>
  <h3 className="text-xl font-bold mb-4">Approved By</h3>
  <div className="grid grid-cols-3 gap-4">
    {footerData.approvedBy?.map((approved, index) => (
      <div key={index} className="flex items-center justify-center">
        {approved.logoUrl && (
          <Image
            src={approved.logoUrl}
            alt="Approved logo"
            width={100}
            height={50}
            className="h-14 w-auto"
          />
        )}
      </div>
    ))}
  </div>
</div>


      </div>

      {/* Bottom Section - Copyright */}
      <div className="mt-10 border-t border-gray-600 pt-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            {footerData.copyrightText} Developed by{" "}
            <Link target="_blank" href="https://microters.com/" className="text-pink-500 hover:underline">
              Microters
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
