import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "./layout";

const AdminHomepage = () => {
  const router = useRouter();

  const [settings, setSettings] = useState({
    topHeading: {
      mobileNo: "",
      email: "",
      quickButtonText: "",
      quickButtonLink: "",
    },
    logoUrl: "",
    faviconUrl: "",
    heroArea: [
      {
        title: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        iconUrl: "",
      },
    ],
    aboutSection: {
      headline: "",
      description: "",
      aboutImageUrl: "", // Image URL for About Us section
      buttonText: "",
      buttonLink: "",
    },
    counters: [],
    ourCourses: [
      {
        iconUrl: "",
        heading: "",
        description: "",
        buttonText: "",
        buttonLink: "",
      },
    ],
    whyChooseANC: [{ iconUrl: "", heading: "", description: "" }],
  });

  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [aboutImageFile, setAboutImageFile] = useState(null); // State for the About Us image file
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/setting");
        if (response.ok) {
          const data = await response.json();
          setSettings((prev) => ({
            ...prev,
            ...data,
            counters: Array.isArray(data.counters) ? data.counters : [],
          }));
        }
      } catch (error) {
        console.error("Error fetching homepage settings:", error);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e, section, index, field) => {
    const updatedSettings = { ...settings };
    if (section === "heroArea" || section === "ourCourses" || section === "whyChooseANC") {
      updatedSettings[section][index][field] = e.target.value;
    } else if (section === "topHeading" || section === "aboutSection") {
      updatedSettings[section][field] = e.target.value;
    } else {
      updatedSettings[section] = e.target.value;
    }
    setSettings(updatedSettings);
  };


  const addSection = (section, limit) => {
    if (settings[section].length < limit) {
      setSettings((prev) => ({
        ...prev,
        [section]: [
          ...prev[section],
          {
            iconUrl: "",
            heading: "",
            description: "",
            buttonText: "",
            buttonLink: "",
          },
        ],
      }));
    }
  };

  const removeSection = (section, index) => {
    if (settings[section].length > 1) {
      setSettings((prev) => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formData = new FormData();
    formData.append("topHeading", JSON.stringify(settings.topHeading));
    formData.append("aboutSection", JSON.stringify(settings.aboutSection));
    formData.append("counters", JSON.stringify(settings.counters));
    formData.append("heroArea", JSON.stringify(settings.heroArea));
    formData.append("ourCourses", JSON.stringify(settings.ourCourses));
    formData.append("whyChooseANC", JSON.stringify(settings.whyChooseANC));
  
    // Only append logo if a new one is uploaded
    if (logoFile) {
      formData.append("logo", logoFile);
    } else {
      formData.append("logoUrl", settings.logoUrl); // Retain current logo
    }
  
    // Only append favicon if a new one is uploaded
    if (faviconFile) {
      formData.append("favicon", faviconFile);
    } else {
      formData.append("faviconUrl", settings.faviconUrl); // Retain current favicon
    }
  
    // Only append about image if a new one is uploaded
    if (aboutImageFile) {
      formData.append("aboutImage", aboutImageFile);
    } else {
      formData.append("aboutImageUrl", settings.aboutSection.aboutImageUrl); // Retain current About image
    }
  
    try {
      const response = await fetch("/api/setting", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        alert("Homepage settings updated successfully");
        router.reload();
      } else {
        alert("Failed to update settings");
      }
    } catch (error) {
      console.error("Failed to update homepage settings:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.name === "logo") setLogoFile(e.target.files[0]);
    if (e.target.name === "favicon") setFaviconFile(e.target.files[0]);
    if (e.target.name === "aboutImage") setAboutImageFile(e.target.files[0]); // File input for About Us image
  };
  
  return (
    <Layout>
      <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Homepage Settings</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Top Heading */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Top Heading</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="mobileNo"
                className="border p-2 rounded w-full"
                value={settings.topHeading.mobileNo}
                onChange={(e) => handleInputChange(e, "topHeading", null, "mobileNo")}
                placeholder="Mobile No"
              />
              <input
                type="text"
                name="email"
                className="border p-2 rounded w-full"
                value={settings.topHeading.email}
                onChange={(e) => handleInputChange(e, "topHeading", null, "email")}
                placeholder="Email"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                name="quickButtonText"
                className="border p-2 rounded w-full"
                value={settings.topHeading.quickButtonText}
                onChange={(e) => handleInputChange(e, "topHeading", null, "quickButtonText")}
                placeholder="Quick Button Text"
              />
              <input
                type="text"
                name="quickButtonLink"
                className="border p-2 rounded w-full"
                value={settings.topHeading.quickButtonLink}
                onChange={(e) => handleInputChange(e, "topHeading", null, "quickButtonLink")}
                placeholder="Quick Button Link"
              />
            </div>
          </div>

        {/* Logo Upload */}
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Logo Upload</h2>
            {settings.logoUrl && (
              <div className="mb-4">
                <p className="text-gray-700">Current Logo:</p>
                <img src={settings.logoUrl} alt="Logo" className="h-20 w-auto" />
              </div>
            )}
            <input
              type="file"
              name="logo"
              className="border p-2 rounded w-full"
              onChange={handleFileChange}
            />
          </div>

          {/* Favicon Upload */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Favicon Upload</h2>
            {settings.faviconUrl && (
              <div className="mb-4">
                <p className="text-gray-700">Current Favicon:</p>
                <img src={settings.faviconUrl} alt="Favicon" className="h-10 w-auto" />
              </div>
            )}
            <input
              type="file"
              name="favicon"
              className="border p-2 rounded w-full"
              onChange={handleFileChange}
            />
          </div>

          {/* Hero Area */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Hero Area</h2>
            {settings.heroArea.map((hero, index) => (
              <div key={index} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name={`heroTitle_${index}`}
                    className="border p-2 rounded w-full"
                    value={hero.title}
                    onChange={(e) => handleInputChange(e, "heroArea", index, "title")}
                    placeholder="Hero Title"
                  />
                  <textarea
                    type="text"
                    name={`heroDescription_${index}`}
                    className="border p-2 rounded w-full"
                    value={hero.description}
                    onChange={(e) => handleInputChange(e, "heroArea", index, "description")}
                    placeholder="Hero Description"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input
                    type="text"
                    name={`heroButtonText_${index}`}
                    className="border p-2 rounded w-full"
                    value={hero.buttonText}
                    onChange={(e) => handleInputChange(e, "heroArea", index, "buttonText")}
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    name={`heroButtonLink_${index}`}
                    className="border p-2 rounded w-full"
                    value={hero.buttonLink}
                    onChange={(e) => handleInputChange(e, "heroArea", index, "buttonLink")}
                    placeholder="Button Link"
                  />
                </div>
                <input
                  type="text"
                  name={`heroIcon_${index}`}
                  className="border p-2 rounded w-full mt-4"
                  value={hero.iconUrl}
                  onChange={(e) => handleInputChange(e, "heroArea", index, "iconUrl")}
                  placeholder="Hero Icon URL"
                />
                <button
                  type="button"
                  className="text-red-500 mt-2"
                  onClick={() => removeSection("heroArea", index)}
                >
                  Remove Hero Section
                </button>
              </div>
            ))}
            {settings.heroArea.length < 4 && (
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                onClick={() => addSection("heroArea", 4)}
              >
                Add Hero Section
              </button>
            )}
          </div>
          {/* About Us Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">About Us Section</h2>
            <input
              type="text"
              name="headline"
              className="border p-2 rounded w-full"
              value={settings.aboutSection.headline}
              onChange={(e) => handleInputChange(e, "aboutSection", null, "headline")}
              placeholder="About Section Headline"
            />
            <textarea
              name="description"
              className="border p-2 rounded w-full mt-4"
              value={settings.aboutSection.description}
              onChange={(e) => handleInputChange(e, "aboutSection", null, "description")}
              placeholder="About Section Description"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                name="aboutButtonText"
                className="border p-2 rounded w-full"
                value={settings.aboutSection.buttonText}
                onChange={(e) => handleInputChange(e, "aboutSection", null, "buttonText")}
                placeholder="About Button Text"
              />
              <input
                type="text"
                name="aboutButtonLink"
                className="border p-2 rounded w-full"
                value={settings.aboutSection.buttonLink}
                onChange={(e) => handleInputChange(e, "aboutSection", null, "buttonLink")}
                placeholder="About Button Link"
              />
            </div>
            {settings.aboutSection.aboutImageUrl && (
              <div className="mt-4">
                <p className="text-gray-700">Current About Us Image:</p>
                <img src={settings.aboutSection.aboutImageUrl} alt="About Us" className="h-20 w-auto" />
              </div>
            )}
            <input
              type="file"
              name="aboutImage"
              className="border p-2 rounded w-full mt-4"
              onChange={handleFileChange}
            />
          </div>


          {/* Counter Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Counters</h2>
            {settings.counters.length > 0 ? (
              settings.counters.map((counter, index) => (
                <div key={index} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name={`counterHeadline_${index}`}
                      className="border p-2 rounded w-full"
                      value={counter.headline || ""}
                      onChange={(e) => {
                        const updatedCounters = [...settings.counters];
                        updatedCounters[index].headline = e.target.value;
                        setSettings((prev) => ({
                          ...prev,
                          counters: updatedCounters,
                        }));
                      }}
                      placeholder="Counter Headline"
                    />
                    <input
                      type="number"
                      name={`counterValue_${index}`}
                      className="border p-2 rounded w-full"
                      value={counter.counter || ""}
                      onChange={(e) => {
                        const updatedCounters = [...settings.counters];
                        updatedCounters[index].counter = e.target.value;
                        setSettings((prev) => ({
                          ...prev,
                          counters: updatedCounters,
                        }));
                      }}
                      placeholder="Counter Value"
                    />
                  </div>
                  <button
                    type="button"
                    className="text-red-500 mt-2"
                    onClick={() => removeSection("counters", index)}
                  >
                    Remove Counter
                  </button>
                </div>
              ))
            ) : (
              <p>No counters available. Please add one.</p>
            )}

            {/* Button to Add Counter */}
            {settings.counters.length < 3 && (
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                onClick={() => {
                  const updatedCounters = [...settings.counters, { headline: "", counter: "" }];
                  setSettings((prev) => ({
                    ...prev,
                    counters: updatedCounters,
                  }));
                }}
              >
                Add Counter
              </button>
            )}
          </div>

          {/* Our Courses */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Our Courses</h2>
            {settings.ourCourses.map((course, index) => (
              <div key={index} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name={`courseHeading_${index}`}
                    className="border p-2 rounded w-full"
                    value={course.heading}
                    onChange={(e) => handleInputChange(e, "ourCourses", index, "heading")}
                    placeholder="Course Heading"
                  />
                  <textarea
                    type="text"
                    name={`courseDescription_${index}`}
                    className="border p-2 rounded w-full"
                    value={course.description}
                    onChange={(e) => handleInputChange(e, "ourCourses", index, "description")}
                    placeholder="Course Description"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input
                    type="text"
                    name={`courseButtonText_${index}`}
                    className="border p-2 rounded w-full"
                    value={course.buttonText}
                    onChange={(e) => handleInputChange(e, "ourCourses", index, "buttonText")}
                    placeholder="Button Text"
                  />
                  <input
                    type="text"
                    name={`courseButtonLink_${index}`}
                    className="border p-2 rounded w-full"
                    value={course.buttonLink}
                    onChange={(e) => handleInputChange(e, "ourCourses", index, "buttonLink")}
                    placeholder="Button Link"
                  />
                </div>
                <input
                  type="text"
                  name={`courseIcon_${index}`}
                  className="border p-2 rounded w-full mt-4"
                  value={course.iconUrl}
                  onChange={(e) => handleInputChange(e, "ourCourses", index, "iconUrl")}
                  placeholder="Course Icon URL"
                />
                <button
                  type="button"
                  className="text-red-500 mt-2"
                  onClick={() => removeSection("ourCourses", index)}
                >
                  Remove Course
                </button>
              </div>
            ))}
            {settings.ourCourses.length < 3 && (
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                onClick={() => addSection("ourCourses", 3)}
              >
                Add Course
              </button>
            )}
          </div>

          {/* Why Choose ANC */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Why Choose ANC</h2>
            {settings.whyChooseANC.map((why, index) => (
              <div key={index} className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name={`whyHeading_${index}`}
                    className="border p-2 rounded w-full"
                    value={why.heading}
                    onChange={(e) => handleInputChange(e, "whyChooseANC", index, "heading")}
                    placeholder="Why Choose ANC Heading"
                  />
                  <textarea
                    type="text"
                    name={`whyDescription_${index}`}
                    className="border p-2 rounded w-full"
                    value={why.description}
                    onChange={(e) => handleInputChange(e, "whyChooseANC", index, "description")}
                    placeholder="Why Choose ANC Description"
                  />
                </div>
                <input
                  type="text"
                  name={`whyIcon_${index}`}
                  className="border p-2 rounded w-full mt-4"
                  value={why.iconUrl}
                  onChange={(e) => handleInputChange(e, "whyChooseANC", index, "iconUrl")}
                  placeholder="Why Choose ANC Icon URL"
                />
                <button
                  type="button"
                  className="text-red-500 mt-2"
                  onClick={() => removeSection("whyChooseANC", index)}
                >
                  Remove Why Choose ANC Section
                </button>
              </div>
            ))}
            {settings.whyChooseANC.length < 6 && (
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                onClick={() => addSection("whyChooseANC", 6)}
              >
                Add Why Choose ANC Section
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AdminHomepage;
