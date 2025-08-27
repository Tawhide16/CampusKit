import React from 'react';
import HeroSection from './HeroSection';
import FeaturePreview from './FeaturePreview';
import WhyChooseUs from './WhyChooseUs';

const Home = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <FeaturePreview></FeaturePreview>
            <WhyChooseUs></WhyChooseUs>
        </div>
    );
};

export default Home;