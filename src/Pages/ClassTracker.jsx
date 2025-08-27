import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaBell, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { getSchedules, saveSchedules } from "../utils/localStorage";

const ClassTracker = () => {
  const [schedules, setSchedules] = useState([]);
  const [className, setClassName] = useState("");
  const [time, setTime] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [notification, setNotification] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Load data from localStorage on initial render
  useEffect(() => {
    setSchedules(getSchedules());
  }, []);

  // Save to localStorage whenever schedules change
  useEffect(() => {
    saveSchedules(schedules);
  }, [schedules]);

  // Show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!className.trim() || !time) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    if (editIndex !== null) {
      // Edit existing schedule
      const updated = [...schedules];
      updated[editIndex] = { className: className.trim(), time };
      setSchedules(updated);
      setEditIndex(null);
      showNotification("Class updated successfully!");
    } else {
      // Add new schedule
      setSchedules([...schedules, { className: className.trim(), time }]);
      showNotification("Class added successfully!");
    }

    setClassName("");
    setTime("");
  };

  // Handle delete
  const handleDelete = (index) => {
    const updated = schedules.filter((_, i) => i !== index);
    setSchedules(updated);
    showNotification("Class deleted successfully!");
  };

  // Handle edit
  const handleEdit = (index) => {
    setClassName(schedules[index].className);
    setTime(schedules[index].time);
    setEditIndex(index);
  };

  // Filter schedules based on search and filter
  const filteredSchedules = schedules
    .filter((schedule) => {
      if (filter === "upcoming") {
        const now = new Date();
        const [hours, minutes] = schedule.time.split(":");
        const scheduleTime = new Date();
        scheduleTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return scheduleTime > now;
      }
      return true;
    })
    .filter((schedule) =>
      schedule.className.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
    setFilter("all");
  };

  return (
    <div className="max-w-lg mx-auto p-4  bg-gradient-to-br from-blue-50 to-indigo-50 my-10 rounded-2xl">
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`p-3 mb-4 rounded-lg shadow-lg ${
              notification.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaBell className="mr-2" />
                {notification.message}
              </div>
              <button onClick={() => setNotification(null)}>
                <FaTimes />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-6 text-indigo-800 flex items-center justify-center"
      >
        <span className="mr-2">📅</span> Class Schedule Tracker
      </motion.h1>

      {/* Search and Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-3 text-gray-500"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-2 rounded-lg ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            All Classes
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`flex-1 py-2 rounded-lg ${
              filter === "upcoming"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Upcoming
          </button>
        </div>
      </motion.div>

      {/* Add/Edit Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-3 text-indigo-700">
          {editIndex !== null ? "Edit Class" : "Add New Class"}
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <div className="flex items-center">
            <label className="mr-3 text-gray-700">Time:</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            <FaPlus /> {editIndex !== null ? "Update Class" : "Add Class"}
          </button>
          {editIndex !== null && (
            <button
              type="button"
              onClick={() => {
                setEditIndex(null);
                setClassName("");
                setTime("");
              }}
              className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </motion.form>

      {/* Class List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-indigo-700">
          Your Classes ({filteredSchedules.length})
        </h2>
        
        <AnimatePresence>
          {filteredSchedules.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-10 bg-white rounded-xl shadow"
            >
              <p className="text-gray-500">
                {schedules.length === 0 
                  ? "No classes scheduled yet. Add your first class above!" 
                  : "No classes match your search/filter."}
              </p>
            </motion.div>
          ) : (
            filteredSchedules.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white shadow-md rounded-xl p-4 mb-3 border-l-4 border-indigo-500"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-indigo-800">
                      {item.className}
                    </h3>
                    <div className="flex items-center mt-1 text-gray-600">
                      <span className="mr-2">⏰</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(
                        schedules.findIndex(s => 
                          s.className === item.className && s.time === item.time
                        )
                      )}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(
                        schedules.findIndex(s => 
                          s.className === item.className && s.time === item.time
                        )
                      )}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClassTracker;