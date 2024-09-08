import React, { useState, useEffect } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaImage, FaKey, FaUser } from "react-icons/fa";
import Image from "next/image";
import signup from "../public/singup.svg";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";
import { useAuth } from "../contexts/AuthContext";

function Register() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role is user
    profileImage: null,
    adminAnswer: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");



  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 100 * 1024) {
      toast.error("Profile image size should be less than 100 KB");
      event.target.value = "";
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      profileImage: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("profileImage", formData.profileImage);
    if (formData.role === "admin") {
      formDataToSend.append("adminAnswer", formData.adminAnswer);
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }
      const result = await response.json();
      console.log(result);
      toast.success("Registration successful! Please check your email to verify.");
      setShowVerification(true);
    } catch (error) {
      console.error("Registration failed:", error);
      toast.error(error.message || "Registration failed");
      setError(error.message || "Registration failed");
    }
  };

  const handleVerification = async (event) => {
    event.preventDefault();
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code.");
      return;
    }

    try {
      const response = await fetch("/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Verification successful:", data);
        toast.success("Email verified successfully!");
        setShowVerification(false);
        setSuccess("Email verified successfully! You can now login.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to verify email");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error(error.message || "Verification failed");
      setError(error.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-5 pb-5">
      <Head>
      <title>Register an Account on YtubeTools</title>
            <meta name="description" content='Register an Account on YtubeTools' />
            <meta property="og:url" content='https://ytubetools.com/register'/>
           
      </Head>
      <ToastContainer />
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl">
        {/* Illustration Section */}
        <div className="hidden md:block md:w-1/2">
          <Image 
            src={signup}
            alt="Illustration"
            className="w-full h-auto"
          /> 
        </div>
        {/* Form Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full md:w-1/2">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6 text-center">Sign Up</h2>
          {!showVerification ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-600 mb-2">
                  <FaUser className="inline-block text-red-500 mr-2" /> Name:
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-600 mb-2">
                  <FaEnvelope className="inline-block text-red-500 mr-2" /> Email:
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-gray-600 mb-2">
                  <FaKey className="inline-block text-red-500 mr-2" /> Password:
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="absolute right-3 top-10 pt-4 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="mb-4 relative">
                <label htmlFor="confirmPassword" className="block text-gray-600 mb-2">
                  <FaKey className="inline-block text-red-500 mr-2" /> Confirm Password:
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="absolute right-3 top-10 pt-4 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              
              
              <div className="mb-6">
                <label htmlFor="profileImage" className="block text-gray-600 mb-2">
                  <FaImage className="inline-block text-red-500 mr-2" /> Profile Image:
                </label>
                <input
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  type="file"
                  id="profileImage"
                  name="profileImage"
                  onChange={handleFileChange}
                  required
                />
                <small className="text-muted">Profile image size should be less than 100 KB</small>
              </div>
              <div className="flex justify-center mb-6">
                <button
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
                  type="submit"
                  disabled={!formData.profileImage} // Disable the button if profileImage is not set
                >
                  Register
                </button>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Already have an account? <Link href="/login" className="text-red-500">Login</Link></p>
              </div>
              {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
            </form>
          ) : (
            <form onSubmit={handleVerification}>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Verify Email</h2>
              <input
                className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
              <div className="flex justify-center mb-6">
                <button className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200" type="submit">
                  Verify Email
                </button>
              </div>
              {success && <div className="alert alert-success mt-3" role="alert">{success}</div>}
              {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
