// WhyChooseUs.jsx
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const points = [
  "Simple",
  "Modern UI",
  "Free",
  "Built for Students",
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 px-6 md:px-16 bg-gradient-to-br from-blue-50 to-indigo-100 lg:mx-10 lg:my-10 rounded-2xl shadow-lg  ">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Why Choose Us? 💡
        </h2>
        <p className="text-lg text-gray-600">
          We built this app keeping students in mind – easy, modern, and useful.
        </p>
      </div>

      <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {points.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl shadow hover:shadow-md transition"
          >
            <FaCheckCircle className="text-[#7700cf] text-xl flex-shrink-0" />
            <span className="text-gray-800 font-medium text-lg">{point}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
