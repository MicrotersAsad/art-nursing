import React from 'react';
import Banner from './banner';
import InfoSection from './InfoSection';
import CoursesSection from './Course';
import WhyChooseVNC from './WhyChooseVNC';
import NoticesAndBlogs from './NoticesAndBlogs';
import PhotoGallery from './Gallery';
import AboutSection from './AboutUs';

const MainPage = () => {
    return (
        <div>
            <Banner/>
            <InfoSection/>
            <AboutSection/>
        
      <CoursesSection/>
      <WhyChooseVNC/>
      <NoticesAndBlogs/>
      <PhotoGallery/>
        </div>
    );
};

export default MainPage;