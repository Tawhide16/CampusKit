// FeaturePreview.jsx
import React from "react";
import { FaCalendarAlt, FaMoneyBillWave, FaBookOpen, FaPenFancy } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    id: 1,
    icon: <FaCalendarAlt className="text-4xl text-[#7700cf]" />,
    title: "Class Tracker",
    description: "Keep track of all your classes, schedules, and assignments in one place.",
  },
  {
    id: 2,
    icon: <FaMoneyBillWave className="text-4xl text-[#7700cf]" />,
    title: "Budget Tracker",
    description: "Manage your student budget and expenses smartly and stress-free.",
  },
  {
    id: 3,
    icon: <FaBookOpen className="text-4xl text-[#7700cf]" />,
    title: "Exam Q&A",
    description: "Prepare better with quick Q&A and organized exam study materials.",
  },
  {
    id: 4,
    icon: <FaPenFancy className="text-4xl text-[#7700cf]" />,
    title: "Study Planner",
    description: "Plan your study sessions effectively and never miss your goals.",
  },
];

const FeaturePreview = () => {
  return (
    <section id="features" className="py-20 px-6 md:px-16 bg-gradient-to-br from-blue-50 to-indigo-100 lg:mx-10 lg:my-10 rounded-2xl shadow-lg">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
          Explore Our Features 
        </h2>
        <p className="text-lg text-gray-600">
          Tools that make student life easier, smarter & more organized.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-transform"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 mb-6 text-sm">{feature.description}</p>
            <button className="bg-[#7700cf] hover:bg-[#5d00a1] text-white px-5 py-2 rounded-full shadow-md transition">
              Explore
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturePreview;
