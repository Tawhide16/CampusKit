// HeroSection.jsx
import React from "react";
import Lottie from "lottie-react";
import studentAnimation from "../assets/students.json"; // Your lottie JSON file

const HeroSection = () => {
  const scrollToFeatures = () => {
    const element = document.getElementById("features");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className=" lg:h-[60vh] bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white px-6 sm:px-10 md:px-16 lg:px-24 flex flex-col lg:flex-row items-center justify-center lg:mx-10 lg:my-10 rounded-2xl shadow-lg">
      
      {/* Left Side: Title + Subtext + CTA */}
      <div className="lg:w-1/2 text-center lg:text-left space-y-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Organize Your Student Life Like a Pro 
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl opacity-90 font-light">
          Class, Budget, Exam & Study Planner – সব একসাথে এক অ্যাপে।
        </p>
        <button
          onClick={scrollToFeatures}
          className="bg-[#7700cf] hover:bg-[#5d00a1] text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full shadow-xl transition-all duration-300"
        >
          Get Started
        </button>
      </div>

      {/* Right Side: Lottie Animation */}
      <div className="lg:w-1/2 flex justify-center mt-8 lg:mt-0">
        <Lottie 
          animationData={studentAnimation} 
          loop={true} 
          className="w-56 sm:w-72 md:w-[350px] lg:w-[420px] drop-shadow-lg" 
        />
      </div>

    </section>
  );
};

export default HeroSection;
