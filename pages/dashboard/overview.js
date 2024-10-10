import React, { useEffect, useState } from 'react';
import Layout from './layout';
import { useAuth } from '../../contexts/AuthContext';
import { FaBell, FaPhotoVideo, FaUserGraduate, FaBlog, FaUsers, FaFileAlt, FaClipboardList } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Link from 'next/link';

const Dashboard = () => {
  const { user } = useAuth();
  const [noticeCount, setNoticeCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);
  const [noticeChartData, setNoticeChartData] = useState(null);
  const [blogChartData, setBlogChartData] = useState(null);

  useEffect(() => {
    if (user?.role === 'super admin') {
      fetchNoticeCount();
      fetchImageCount();
      fetchTeacherCount();
      fetchArticleCount();
      fetchUserCount();
      fetchBlogCount();
      fetchPageCount();
      fetchProgramCount();
      fetchNoticeChartData();
      fetchBlogChartData();
    }
  }, [user]);

  const fetchNoticeCount = async () => {
    try {
      const response = await fetch('/api/notice');
      const data = await response.json();
      setNoticeCount(data.length || 0);
    } catch (error) {
      console.error('Error fetching notice count:', error);
    }
  };

  const fetchImageCount = async () => {
    try {
      const response = await fetch('/api/photo-gallery');
      const data = await response.json();
      setImageCount(data.length || 0);
    } catch (error) {
      console.error('Error fetching image count:', error);
    }
  };

  const fetchTeacherCount = async () => {
    try {
      const response = await fetch('/api/teacher');
      const data = await response.json();
      setTeacherCount(data.length || 0);
    } catch (error) {
      console.error('Error fetching teacher count:', error);
    }
  };

  const fetchArticleCount = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setArticleCount(data.length || 0);
    } catch (error) {
      console.error('Error fetching article count:', error);
    }
  };

  const fetchUserCount = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUserCount(data.length || 0);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  const fetchBlogCount = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setBlogCount(data.length || 0);
    } catch (error) {
      console.error('Error fetching blog count:', error);
    }
  };

  const fetchPageCount = async () => {
    try {
      const response = await fetch('/api/pages');
      const data = await response.json();
      setPageCount(data.length || 0);
    } catch (error) {
      console.error('Error fetching page count:', error);
    }
  };

  const fetchProgramCount = async () => {
    try {
      const response = await fetch('/api/program');
      const data = await response.json();
      setProgramCount(data.length || 0);
    } catch (error) {
      console.error('Error fetching program count:', error);
    }
  };

  const fetchNoticeChartData = async () => {
    try {
      const response = await fetch('/api/notice-daily');
      const data = await response.json();
      setNoticeChartData({
        labels: data?.length > 0 ? data.map(item => item.date) : ["No Data"],
        datasets: [
          {
            label: 'Total Notices Per Day',
            data: data?.length > 0 ? data.map(item => item.count) : [0],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching notice chart data:', error);
    }
  };

  const fetchBlogChartData = async () => {
    try {
      const response = await fetch('/api/blog-daily');
      const data = await response.json();
      setBlogChartData({
        labels: data?.length > 0 ? data.map(item => item.date) : ["No Data"],
        datasets: [
          {
            label: 'Total Blogs Per Day',
            data: data?.length > 0 ? data.map(item => item.count) : [0],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching blog chart data:', error);
    }
  };


  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-8">Hi, {user?.username}</h1>
      {(user?.role === 'admin' || user?.role === 'super admin') && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Link href="addnotice">
           <div className="border border-blue-500 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center">
                <FaBell className="text-blue-500 text-4xl mr-4" />
                <div>
                  <h2 className="text-lg text-black font-semibold">Total Notices</h2>
                  <p className="text-3xl text-black font-bold">{noticeCount}</p>
                </div>
              </div>
              <FaBell className="text-blue-500" />
            </div></Link>
           <Link href="photo-gallery">
           
           <div className="border border-green-500 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center">
                <FaPhotoVideo className="text-green-500 text-4xl mr-4" />
                <div>
                  <h2 className="text-lg font-semibold text-black">Total Images</h2>
                  <p className="text-3xl font-bold text-black">{imageCount}</p>
                </div>
              </div>
              <FaPhotoVideo className="text-green-500" />
            </div>
           </Link>
            <Link href="teacher">
            <div className="border border-red-500 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center">
                <FaUserGraduate className="text-red-500 text-4xl mr-4" />
                <div>
                  <h2 className="text-lg font-semibold text-black">Total Teachers</h2>
                  <p className="text-3xl font-bold text-black">{teacherCount}</p>
                </div>
              </div>
              <FaUserGraduate className="text-red-500" />
            </div></Link>
           <Link href="all-blogs">
           <div className="border border-orange-500 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center">
                <FaBlog className="text-orange-500 text-4xl mr-4" />
                <div>
                  <h2 className="text-lg font-semibold text-black">Total Articles</h2>
                  <p className="text-3xl font-bold text-black">{articleCount}</p>
                </div>
              </div>
              <FaBlog className="text-orange-500" />
            </div>
           </Link>
            <Link href="#">
            <div className="border border-purple-500 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center">
                <FaUsers className="text-purple-500 text-4xl mr-4" />
                <div>
                  <h2 className="text-lg font-semibold text-black">Total Users</h2>
                  <p className="text-3xl font-bold text-black">{userCount}</p>
                </div>
              </div>
              <FaUsers className="text-purple-500" />
            </div>
            </Link>
            <div className="border border-teal-500 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center">
                <FaBlog className="text-teal-500 text-4xl mr-4" />
                <div>
                  <h2 className="text-lg font-semibold text-black">Total Blogs</h2>
                  <p className="text-3xl font-bold text-black">{blogCount}</p>
                </div>
              </div>
              <FaBlog className="text-teal-500" />
            </div>
            <div className="border border-yellow-500 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center">
                <FaFileAlt className="text-yellow-500 text-4xl mr-4" />
                <div>
                  <h2 className="text-lg font-semibold text-black">Total Pages</h2>
                  <p className="text-3xl font-bold text-black">{pageCount}</p>
                </div>
              </div>
              <FaFileAlt className="text-yellow-500" />
            </div>
            <div className="border border-pink-500 rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center">
                <FaClipboardList className="text-pink-500 text-4xl mr-4" />
                <div>
                  <h2 className="text-lg font-semibold text-black">Total Programs</h2>
                  <p className="text-3xl font-bold text-black">{programCount}</p>
                </div>
              </div>
              <FaClipboardList className="text-pink-500" />
            </div>
          </div>

          {/* Charts Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 border border-blue-500 rounded-lg">
              <h2 className="text-lg font-semibold text-black mb-4">Total Notices Per Day</h2>
              {noticeChartData ? (
                <Line data={noticeChartData} options={{ responsive: true }} />
              ) : (
                <p>No data available</p>
              )}
            </div>
            <div className="p-6 border border-teal-500 rounded-lg">
              <h2 className="text-lg font-semibold text-black mb-4">Total Blogs Per Day</h2>
              {blogChartData ? (
                <Line data={blogChartData} options={{ responsive: true }} />
              ) : (
                <p>No data available</p>
              )}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
