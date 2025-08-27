import React from "react";
import { motion } from "framer-motion";
import { FaBook, FaTasks, FaChartLine, FaPlus } from "react-icons/fa";

function Dashboard({ goals }) {
  // Calculate total stats
  const totalGoals = goals.length;
  const totalTasks = goals.reduce((acc, g) => acc + g.tasks.length, 0);
  const completedTasks = goals.reduce(
    (acc, g) => acc + g.tasks.filter(t => t.done).length,
    0
  );
  const overallProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center gap-2"
        >
          <FaBook className="text-indigo-500 text-3xl" />
          <span className="text-gray-500 text-sm">Total Goals</span>
          <span className="font-bold text-xl">{totalGoals}</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center gap-2"
        >
          <FaTasks className="text-green-500 text-3xl" />
          <span className="text-gray-500 text-sm">Total Tasks</span>
          <span className="font-bold text-xl">{totalTasks}</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center gap-2"
        >
          <FaCheck className="text-blue-500 text-3xl" />
          <span className="text-gray-500 text-sm">Completed Tasks</span>
          <span className="font-bold text-xl">{completedTasks}</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center gap-2"
        >
          <FaChartLine className="text-purple-500 text-3xl" />
          <span className="text-gray-500 text-sm">Overall Progress</span>
          <span className="font-bold text-xl">{overallProgress}%</span>
        </motion.div>
      </div>

      {/* Quick Action Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium"
          >
            <FaPlus /> Add New Goal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium"
          >
            View All Tasks
          </motion.button>
        </div>
      </div>

      {/* Optional: Recent Goals */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Goals</h2>
        <ul className="space-y-3">
          {goals.slice(-5).map(goal => (
            <li key={goal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-700">{goal.title}</span>
              <span className="text-sm text-gray-500">
                {goal.tasks.filter(t => t.done).length}/{goal.tasks.length} tasks done
              </span>
            </li>
          ))}
          {goals.length === 0 && (
            <li className="text-gray-500 text-center py-4">No goals yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
