import React from 'react';
import Banner from './banner';
import InfoSection from './InfoSection';
import CoursesSection from './Course';
import WhyChooseVNC from './WhyChooseVNC';
import NoticesAndBlogs from './NoticesAndBlogs';
import PhotoGallery from './Gallery';
import AboutSection from './AboutUs';
import CountdownTimer from './CountdownTimer';

const MainPage = () => {
    return (
        <div>
            <Banner/>
            <InfoSection/>
            <AboutSection/>
            <CountdownTimer/>
        
      <CoursesSection/>
      <WhyChooseVNC/>
      <NoticesAndBlogs/>
      <PhotoGallery/>
        </div>
    );
};

export default MainPage;