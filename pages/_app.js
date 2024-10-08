import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import { ClipLoader } from 'react-spinners';
import { FaArrowUp } from 'react-icons/fa';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isDashboard = router.pathname.startsWith('/dashboard'); 
  const isLoginPage = router.pathname === '/login'; 

  return (
    <>
      <Head>
        <title>Art Nursing College</title>
        <meta name="description" content="Welcome to Art Nursing College, a world-class institution offering excellence in nursing education, practice, and research." />
        <meta name="keywords" content="Nursing, Art Nursing College, nursing education, healthcare, nursing practice" />
        <meta name="author" content="Art Nursing College Team" />
      </Head>

      <AuthProvider>
        {!isDashboard && <Navbar />}
        <AuthGuard isDashboard={isDashboard} isLoginPage={isLoginPage}>
          <div className={isDashboard ? 'dashboard-container' : 'site-container'}>
            <Component {...pageProps} />
            <BackToTopButton />
          </div>
        </AuthGuard>
        {!isDashboard && <Footer />}
      </AuthProvider>
    </>
  );
}

const AuthGuard = ({ children, isDashboard, isLoginPage }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (user && isLoginPage) {
      router.push('/dashboard/overview');
      return;
    }

    if (!user && isDashboard) {
      router.push('/login');
      return;
    }
  }, [loading, user, isDashboard, isLoginPage, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={80} color={"#36D7B7"} loading={loading} />
      </div>
    );
  }

  return children;
};

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default MyApp;
