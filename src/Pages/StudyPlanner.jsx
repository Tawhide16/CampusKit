import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlus, FaCheck, FaTrash, FaBook, 
  FaTasks, FaChartLine, FaPen 
} from "react-icons/fa";

function StudyPlanner() {
  const [goals, setGoals] = useState([]);
  const [goalTitle, setGoalTitle] = useState("");
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [editingGoalTitle, setEditingGoalTitle] = useState("");
  const [taskTexts, setTaskTexts] = useState({}); // store task input per goal

  const addGoal = () => {
    if (!goalTitle.trim()) return;
    setGoals([...goals, { id: uuidv4(), title: goalTitle, tasks: [] }]);
    setGoalTitle("");
  };

  const addTask = (goalId, taskText) => {
    if (!taskText.trim()) return;
    setGoals(goals.map(g => g.id === goalId 
      ? { ...g, tasks: [...g.tasks, { id: uuidv4(), text: taskText, done: false }] } 
      : g
    ));
    setTaskTexts(prev => ({ ...prev, [goalId]: "" })); // clear input
  };

  const handleTaskInput = (goalId, value) => {
    setTaskTexts(prev => ({ ...prev, [goalId]: value }));
  };

  const toggleTask = (goalId, taskId) => {
    setGoals(goals.map(g => g.id === goalId
      ? { ...g, tasks: g.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) }
      : g
    ));
  };

  const deleteTask = (goalId, taskId) => {
    setGoals(goals.map(g => g.id === goalId
      ? { ...g, tasks: g.tasks.filter(t => t.id !== taskId) }
      : g
    ));
  };

  const deleteGoal = (goalId) => {
    setGoals(goals.filter(g => g.id !== goalId));
  };

  const startEditingGoal = (goalId, title) => {
    setEditingGoalId(goalId);
    setEditingGoalTitle(title);
  };

  const saveEditedGoal = (goalId) => {
    setGoals(goals.map(g => g.id === goalId
      ? { ...g, title: editingGoalTitle }
      : g
    ));
    setEditingGoalId(null);
    setEditingGoalTitle("");
  };

  const cancelEditingGoal = () => {
    setEditingGoalId(null);
    setEditingGoalTitle("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-indigo-800 flex items-center justify-center gap-2">
            <FaBook className="text-indigo-600" /> Study Planner
          </h1>
          <p className="text-gray-600 mt-2">Organize your learning goals and track progress</p>
        </motion.div>
        
        {/* Add Goal Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input 
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter a learning goal (e.g., 'Learn React')" 
                value={goalTitle} 
                onChange={(e) => setGoalTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addGoal()}
              />
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-3 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium"
              onClick={addGoal}
            >
              <FaPlus className="text-sm" /> Add Goal
            </motion.button>
          </div>
        </motion.div>

        {/* Goals List */}
        <div className="space-y-6">
          <AnimatePresence>
            {goals.map((goal) => {
              const completed = goal.tasks.filter(t => t.done).length;
              const total = goal.tasks.length;
              const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

              return (
                <motion.div 
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-lg overflow-hidden"
                >
                  {/* Goal Header */}
                  <div className="flex justify-between items-start mb-4">
                    {editingGoalId === goal.id ? (
                      <div className="flex-1 flex gap-2">
                        <input 
                          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={editingGoalTitle} 
                          onChange={(e) => setEditingGoalTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEditedGoal(goal.id)}
                        />
                        <button 
                          className="px-3 py-2 bg-green-500 text-white rounded-lg"
                          onClick={() => saveEditedGoal(goal.id)}
                        >
                          <FaCheck />
                        </button>
                        <button 
                          className="px-3 py-2 bg-gray-500 text-white rounded-lg"
                          onClick={cancelEditingGoal}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="font-semibold text-xl text-indigo-800 flex items-center gap-2">
                          <FaTasks className="text-indigo-600" /> {goal.title}
                        </h2>
                        <div className="flex gap-2">
                          <button 
                            className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full"
                            onClick={() => startEditingGoal(goal.id, goal.title)}
                          >
                            <FaPen size={14} />
                          </button>
                          <button 
                            className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                            onClick={() => deleteGoal(goal.id)}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Progress Section */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <FaChartLine className="text-indigo-500" /> Progress
                      </span>
                      <span className="text-sm text-gray-600">{completed}/{total} completed ({progress}%)</span>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      />
                    </div>
                  </div>

                  {/* Add Task Input */}
                  <div className="flex flex-col sm:flex-row gap-2 mb-6">
                    <input 
                      className="flex-1 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="Add a task to complete this goal" 
                      value={taskTexts[goal.id] || ""} 
                      onChange={(e) => handleTaskInput(goal.id, e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask(goal.id, taskTexts[goal.id] || "")}
                    />
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-3 bg-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium"
                      onClick={() => addTask(goal.id, taskTexts[goal.id] || "")}
                    >
                      <FaPlus className="text-sm" /> Add Task
                    </motion.button>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-3">
                    <AnimatePresence>
                      {goal.tasks.map((task) => (
                        <motion.div 
                          key={task.id}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div whileTap={{ scale: 0.9 }}>
                              <input 
                                type="checkbox" 
                                checked={task.done} 
                                onChange={() => toggleTask(goal.id, task.id)} 
                                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                id={`task-${task.id}`}
                              />
                            </motion.div>
                            <label 
                              htmlFor={`task-${task.id}`} 
                              className={`cursor-pointer ${task.done ? "line-through text-gray-400" : "text-gray-700"}`}
                            >
                              {task.text}
                            </label>
                          </div>
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                            onClick={() => deleteTask(goal.id, task.id)}
                          >
                            <FaTrash size={14} />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    {goal.tasks.length === 0 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-6 text-gray-500"
                      >
                        No tasks yet. Add your first task to get started!
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {goals.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12 bg-white rounded-2xl shadow-lg"
            >
              <FaBook className="text-4xl text-indigo-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-600">No study goals yet</h3>
              <p className="text-gray-500 mt-2">Add your first learning goal to get started!</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudyPlanner;
