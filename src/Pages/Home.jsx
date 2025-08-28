import React from 'react';
import HeroSection from './HeroSection';
import FeaturePreview from './FeaturePreview';
import WhyChooseUs from './WhyChooseUs';
import FAQ from './FAQ';

const Home = () => {
    return (
        <div>
            <HeroSection></HeroSection>
            <FeaturePreview></FeaturePreview>
            <FAQ></FAQ>
            <WhyChooseUs></WhyChooseUs>
        </div>
    );
};

export default Home;