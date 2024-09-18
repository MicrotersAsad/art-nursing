import { useState, useEffect } from 'react';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import Layout from './layout';

export default function FooterForm() {
  const [logo, setLogo] = useState(null);
  const [socialLinks, setSocialLinks] = useState({ facebook: '', youtube: '' });
  const [featuredLinks, setFeaturedLinks] = useState([{ name: '', url: '' }]);
  const [quickLinks, setQuickLinks] = useState([{ name: '', url: '' }]);
  const [contactInfo, setContactInfo] = useState({
    address: '',
    phone1: '',
    phone2: '',
    phone3: '',
    email: '',
  });
  const [copyrightText, setCopyrightText] = useState('');
  const [message, setMessage] = useState('');

  // Fetch existing data on component mount
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const res = await fetch('/api/footer'); // Replace with your actual API endpoint
        const data = await res.json();
        
        // Populate the form with existing data
        if (res.ok && data) {
          setLogo(data.logoUrl || null);
          setSocialLinks(data.socialLinks || { facebook: '', youtube: '' });
          setFeaturedLinks(data.featuredLinks?.length ? data.featuredLinks : [{ name: '', url: '' }]);
          setQuickLinks(data.quickLinks?.length ? data.quickLinks : [{ name: '', url: '' }]);
          setContactInfo(data.contactInfo || { address: '', phone1: '', phone2: '', phone3: '', email: '' });
          setCopyrightText(data.copyrightText || '');
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
      }
    };

    fetchFooterData();
  }, []);

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSocialLinksChange = (e) => {
    setSocialLinks({
      ...socialLinks,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddFeaturedLink = () => {
    setFeaturedLinks([...featuredLinks, { name: '', url: '' }]);
  };

  const handleAddQuickLink = () => {
    setQuickLinks([...quickLinks, { name: '', url: '' }]);
  };

  const handleFeaturedLinkChange = (index, field, value) => {
    const newLinks = [...featuredLinks];
    newLinks[index][field] = value;
    setFeaturedLinks(newLinks);
  };

  const handleQuickLinkChange = (index, field, value) => {
    const newLinks = [...quickLinks];
    newLinks[index][field] = value;
    setQuickLinks(newLinks);
  };

  const handleContactInfoChange = (e) => {
    setContactInfo({
      ...contactInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('socialLinks', JSON.stringify(socialLinks));
    formData.append('featuredLinks', JSON.stringify(featuredLinks));
    formData.append('quickLinks', JSON.stringify(quickLinks));
    formData.append('contactInfo', JSON.stringify(contactInfo));
    formData.append('copyrightText', copyrightText);

    const res = await fetch('/api/footer', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Footer updated successfully!');
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Update Footer</h1>
        
        {/* Logo */}
        <div className="mb-4 border rounded p-3">
          <label className="block text-sm font-medium text-gray-700">Upload Logo</label>
          {logo && typeof logo === 'string' && (
            <img src={logo} alt="Current Logo" className="h-16 w-auto mb-4" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="mt-2 p-2 border rounded w-full"
          />
        </div>

        {/* Social Links */}
        <div className="mb-6 border rounded p-3">
          <h3 className="text-lg font-semibold mb-4">Social Links</h3>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
              <input
                type="text"
                name="facebook"
                placeholder="Facebook URL"
                value={socialLinks.facebook}
                onChange={handleSocialLinksChange}
                className="mt-2 p-2 border rounded w-full"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
              <input
                type="text"
                name="youtube"
                placeholder="YouTube URL"
                value={socialLinks.youtube}
                onChange={handleSocialLinksChange}
                className="mt-2 p-2 border rounded w-full"
              />
            </div>
          </div>
        </div>

        {/* Featured Links */}
        <div className="mb-6 border rounded p-3">
  <h3 className="text-lg font-semibold mb-4">Featured Links</h3>
  {featuredLinks.map((link, index) => (
    <div key={index} className="flex items-center space-x-4 mb-2">
      {/* Serial Number */}
      <span className="font-bold">{index + 1}.</span>

      {/* Link Name Input */}
      <input
        type="text"
        placeholder="Link Name"
        value={link.name}
        onChange={(e) => handleFeaturedLinkChange(index, 'name', e.target.value)}
        className="p-2 border rounded w-1/2"
      />

      {/* Link URL Input */}
      <input
        type="text"
        placeholder="Link URL"
        value={link.url}
        onChange={(e) => handleFeaturedLinkChange(index, 'url', e.target.value)}
        className="p-2 border rounded w-1/2"
      />

      {/* Remove Button */}
      {featuredLinks.length > 1 && (
        <button
          type="button"
          onClick={() => setFeaturedLinks(featuredLinks.filter((_, i) => i !== index))}
          className="text-red-500 hover:text-red-700"
        >
          <FaMinusCircle />
        </button>
      )}
    </div>
  ))}

  {/* Add Button */}
  {featuredLinks.length < 6 && (
    <button
      type="button"
      onClick={handleAddFeaturedLink}
      className="text-blue-500 hover:text-blue-700"
    >
      <FaPlusCircle /> Add Featured Link
    </button>
  )}
</div>

{/* Quick Links */}
<div className="mb-6 border rounded p-3">
  <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
  {quickLinks.map((link, index) => (
    <div key={index} className="flex items-center space-x-4 mb-2">
      {/* Serial Number */}
      <span className="font-bold">{index + 1}.</span>

      {/* Link Name Input */}
      <input
        type="text"
        placeholder="Link Name"
        value={link.name}
        onChange={(e) => handleQuickLinkChange(index, 'name', e.target.value)}
        className="p-2 border rounded w-1/2"
      />

      {/* Link URL Input */}
      <input
        type="text"
        placeholder="Link URL"
        value={link.url}
        onChange={(e) => handleQuickLinkChange(index, 'url', e.target.value)}
        className="p-2 border rounded w-1/2"
      />

      {/* Remove Button */}
      {quickLinks.length > 1 && (
        <button
          type="button"
          onClick={() => setQuickLinks(quickLinks.filter((_, i) => i !== index))}
          className="text-red-500 hover:text-red-700"
        >
          <FaMinusCircle />
        </button>
      )}
    </div>
  ))}

  {/* Add Button */}
  {quickLinks.length < 6 && (
    <button
      type="button"
      onClick={handleAddQuickLink}
      className="text-blue-500 hover:text-blue-700"
    >
      <FaPlusCircle /> Add Quick Link
    </button>
  )}
</div>


        {/* Contact Info */}
        <div className="mb-6 border rounded p-3">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={contactInfo.address}
            onChange={handleContactInfoChange}
            className="mt-2 p-2 border rounded w-full"
          />
          <div className="flex space-x-4 mt-4">
            <input
              type="text"
              name="phone1"
              placeholder="Primary Phone"
              value={contactInfo.phone1}
              onChange={handleContactInfoChange}
              className="p-2 border rounded w-1/3"
            />
            <input
              type="text"
              name="phone2"
              placeholder="Alternate Phone"
              value={contactInfo.phone2}
              onChange={handleContactInfoChange}
              className="p-2 border rounded w-1/3"
            />
            <input
              type="text"
              name="phone3"
              placeholder="Alternate Phone"
              value={contactInfo.phone3}
              onChange={handleContactInfoChange}
              className="p-2 border rounded w-1/3"
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={contactInfo.email}
            onChange={handleContactInfoChange}
            className="mt-4 p-2 border rounded w-full"
          />
        </div>

        {/* Copyright Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Copyright Text</h3>
          <input
            type="text"
            placeholder="© 2024 Art Nursing College. All rights reserved."
            value={copyrightText}
            onChange={(e) => setCopyrightText(e.target.value)}
            className="p-2 border rounded w-full"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Save Footer
        </button>

        {message && <p className="mt-4 text-center text-green-500">{message}</p>}
      </div>
    </Layout>
  );
}
