import { useState, useEffect } from "react";
import Layout from "./layout";
import Link from "next/link";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [formData, setFormData] = useState({
    img: null,
    heading: "",
    subHeading: "",
    buttonText: "",
    buttonLink: "",
  });

  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  // Fetch all sliders on component mount
  useEffect(() => {
    fetchSliders(); // Call fetch function on component mount
  }, []);

  // Function to fetch all sliders
  const fetchSliders = async () => {
    try {
      const response = await fetch("/api/banner");
      if (!response.ok) {
        throw new Error("Failed to fetch sliders");
      }
      const data = await response.json();
      setSliders(data);
    } catch (error) {
      console.error("Error fetching sliders:", error);
      setSliders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      img: e.target.files[0],
    }));
  };

  const resetForm = () => {
    setFormData({
      img: null,
      heading: "",
      subHeading: "",
      buttonText: "",
      buttonLink: "",
    });
    setEditId(null);
    setExistingImage("");
  };

// After adding slider, refetch all sliders
const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataObj = new FormData();
  if (formData.img) {
    formDataObj.append("img", formData.img);
  }
  formDataObj.append("heading", formData.heading);
  formDataObj.append("subHeading", formData.subHeading);
  formDataObj.append("buttonText", formData.buttonText);
  formDataObj.append("buttonLink", formData.buttonLink);

  try {
    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/banner?id=${editId}` : "/api/banner";

    const response = await fetch(url, {
      method,
      body: formDataObj,
    });

    if (response.ok) {
      const result = await response.json();

      if (editId) {
        setSliders((prevSliders) =>
          prevSliders.map((slider) =>
            slider._id === editId ? result.slider : slider
          )
        );
        toast.success("Slider updated successfully!");
      } else {
        setSliders((prevSliders) => [...prevSliders, result.slider]);
        toast.success("Slider uploaded successfully!");
      }

      resetForm();
    } else {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to upload slider.");
    }
  } catch (error) {
    console.error("Error uploading slider:", error);
    toast.error("An unexpected error occurred. Please try again.");
  }
};


const handleEdit = (slider) => {
  setFormData({
    img: null, // Reset the img field to null for a new upload if desired
    heading: slider.heading,
    subHeading: slider.subHeading,
    buttonText: slider.buttonText,
    buttonLink: slider.buttonLink,
  });
  setEditId(slider._id); // Ensure that _id is being correctly set
  setExistingImage(slider.img); // Store the existing image
};

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/banner?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSliders((prevSliders) =>
          prevSliders.filter((slider) => slider._id !== id)
        );
        toast.success("Slider deleted successfully!");
      } else {
        const errorText = await response.text();
        console.error("Error deleting slider:", errorText);
        toast.error("Failed to delete slider.");
      }
    } catch (error) {
      console.error("Error deleting slider:", error);
      toast.error("Failed to delete slider.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <ToastContainer />
      <div className="min-h-screen bg-gradient-to-r py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white shadow-2xl p-8 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {editId ? "Edit Slider" : "Upload New Slider"}
          </h1>

          {/* Form for slider upload */}
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-md">
            <div>
              <label className="block text-md font-semibold text-gray-800 mb-1">
                Upload Image
              </label>
              {existingImage && !formData.img && (
                <div className="mb-4">
                  <Image
                    src={
                      existingImage.startsWith("/uploads")
                        ? existingImage
                        : `/uploads/${existingImage}`
                    }
                    alt="Current Slider"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-gray-500 mt-1">Current Image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
              />
              <small className="text-xs text-gray-500 mt-1 block">
                Please upload a high-quality image (JPG, PNG). Leave blank to
                keep the existing image.
              </small>
            </div>

            {/* Rest of the input fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-1">
                  Heading
                </label>
                <input
                  type="text"
                  name="heading"
                  value={formData.heading}
                  onChange={handleInputChange}
                  className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
                  placeholder="Enter heading"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-semibold text-gray-800 mb-1">
                  Sub-Heading
                </label>
                <input
                  type="text"
                  name="subHeading"
                  value={formData.subHeading}
                  onChange={handleInputChange}
                  className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
                  placeholder="Enter sub-heading"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
                  placeholder="Enter button text"
                  required
                />
              </div>

              <div>
                <label className="block text-md font-semibold text-gray-800 mb-1">
                  Button Link
                </label>
                <input
                  type="text"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleInputChange}
                  className="mt-2 block w-full text-sm border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-lg transition duration-300 ease-in-out"
                  placeholder="Enter button link"
                  required
                />
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                type="submit"
                className="inline-block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                {editId ? "Update Slider" : "Upload Slider"}
              </button>
            </div>
          </form>

          {/* Display the existing sliders in a table */}
          <h2 className="text-2xl font-bold mt-12 mb-4 text-gray-800 text-center">
            Existing Sliders
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Heading
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Subheading
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Button Text
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Button URL
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sliders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-600">
                      No sliders available
                    </td>
                  </tr>
                ) : (
                  sliders.map((slider, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-100 transition duration-200"
                    >
                      <td className="px-6 py-4">
                        {slider.img ? (
                          <Image
                            src={
                              slider.img.startsWith("/uploads")
                                ? slider.img
                                : `/uploads/${slider.img}`
                            }
                            alt={slider.heading}
                            width={64}
                            height={64}
                            className="w-20 h-20 object-cover rounded shadow-sm"
                          />
                        ) : (
                          <p>No image</p>
                        )}
                      </td>
                      <td className="px-6 py-4">{slider.heading}</td>
                      <td className="px-6 py-4">{slider.subHeading}</td>
                      <td className="px-6 py-4">{slider.buttonText}</td>
                      <td className="px-6 py-4">
                        {slider.buttonLink ? (
                          <Link href={slider.buttonLink} passHref>
                            <p className="text-indigo-500 hover:underline">
                              {slider.buttonLink}
                            </p>
                          </Link>
                        ) : (
                          <span className="text-gray-500">
                            No link available
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 flex space-x-2">
                        <button
                          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition duration-200"
                          onClick={() => handleEdit(slider)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
                          onClick={() => handleDelete(slider._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
