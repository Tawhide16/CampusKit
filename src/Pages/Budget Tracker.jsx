import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit, FaMoneyBillWave, FaWallet, FaChartLine, FaPiggyBank } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Local storage functions
const getBudgetData = () => {
  const data = localStorage.getItem("budgetData");
  return data ? JSON.parse(data) : { transactions: [], categories: [] };
};

const saveBudgetData = (data) => {
  localStorage.setItem("budgetData", JSON.stringify(data));
};

// Default categories
const defaultCategories = [
  { id: 1, name: "Food", type: "expense", color: "#FF8042" },
  { id: 2, name: "Transport", type: "expense", color: "#00C49F" },
  { id: 3, name: "Entertainment", type: "expense", color: "#FFBB28" },
  { id: 4, name: "Shopping", type: "expense", color: "#0088FE" },
  { id: 5, name: "Salary", type: "income", color: "#00C49F" },
  { id: 6, name: "Freelance", type: "income", color: "#0088FE" },
  { id: 7, name: "Gifts", type: "income", color: "#FFBB28" },
];

// Custom chart components
const BarChart = ({ data, width = 400, height = 300 }) => {
  const maxValue = Math.max(...data.map(item => Math.max(item.income, item.expense)));
  const barWidth = (width - 80) / data.length;
  
  return (
    <svg width={width} height={height} className="mx-auto">
      {/* Y-axis */}
      <line x1="40" y1="20" x2="40" y2={height - 30} stroke="#ccc" />
      
      {/* X-axis */}
      <line x1="40" y1={height - 30} x2={width - 20} y2={height - 30} stroke="#ccc" />
      
      {/* Y-axis labels */}
      {[0, maxValue / 2, maxValue].map((value, i) => (
        <g key={i}>
          <text x="35" y={height - 30 - (value / maxValue) * (height - 80)} 
                textAnchor="end" dy="0.35em" fontSize="12">
            {value}
          </text>
          <line x1="40" x2={width - 20} 
                y1={height - 30 - (value / maxValue) * (height - 80)} 
                y2={height - 30 - (value / maxValue) * (height - 80)} 
                stroke="#eee" />
        </g>
      ))}
      
      {/* Bars */}
      {data.map((item, i) => (
        <g key={i} transform={`translate(${40 + (i * barWidth) + (barWidth / 4)}, 0)`}>
          {/* Income bar */}
          <rect y={height - 30 - (item.income / maxValue) * (height - 80)} 
                width={barWidth / 2} 
                height={(item.income / maxValue) * (height - 80)} 
                fill="#00C49F" />
          
          {/* Expense bar */}
          <rect x={barWidth / 2} 
                y={height - 30 - (item.expense / maxValue) * (height - 80)} 
                width={barWidth / 2} 
                height={(item.expense / maxValue) * (height - 80)} 
                fill="#FF8042" />
          
          {/* Month label */}
          <text x={barWidth / 2} y={height - 10} textAnchor="middle" fontSize="12">
            {item.month.split('-')[1]}
          </text>
        </g>
      ))}
      
      {/* Legend */}
      <g transform={`translate(${width / 2}, ${height - 10})`}>
        <rect x="-60" y="-130" width="10" height="10" fill="#00C49F" />
        <text x="-45" y="-120" fontSize="12">Income</text>
        <rect x="10" y="-130" width="10" height="10" fill="#FF8042" />
        <text x="25" y="-120" fontSize="12">Expense</text>
      </g>
    </svg>
  );
};

const PieChart = ({ data, width = 300, height = 300 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let startAngle = 0;
  
  return (
    <svg width={width} height={height} className="mx-auto">
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {data.map((item, i) => {
          const angle = (item.value / total) * 360;
          const endAngle = startAngle + angle;
          
          // Convert angles to radians
          const startAngleRad = (startAngle - 90) * (Math.PI / 180);
          const endAngleRad = (endAngle - 90) * (Math.PI / 180);
          
          // Calculate coordinates for arc
          const innerRadius = 0;
          const outerRadius = 100;
          
          const x1 = innerRadius * Math.cos(startAngleRad);
          const y1 = innerRadius * Math.sin(startAngleRad);
          const x2 = outerRadius * Math.cos(startAngleRad);
          const y2 = outerRadius * Math.sin(startAngleRad);
          
          const x3 = outerRadius * Math.cos(endAngleRad);
          const y3 = outerRadius * Math.sin(endAngleRad);
          const x4 = innerRadius * Math.cos(endAngleRad);
          const y4 = innerRadius * Math.sin(endAngleRad);
          
          const largeArcFlag = angle > 180 ? 1 : 0;
          
          const pathData = [
            `M ${x1} ${y1}`,
            `L ${x2} ${y2}`,
            `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}`,
            `L ${x4} ${y4}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}`,
            'Z'
          ].join(' ');
          
          const sliceElement = (
            <path
              key={i}
              d={pathData}
              fill={item.color}
              stroke="#fff"
              strokeWidth="1"
            />
          );
          
          startAngle = endAngle;
          return sliceElement;
        })}
      </g>
      
      {/* Legend */}
      <g transform="translate(160, 20)">
        {data.map((item, i) => (
          <g key={i} transform={`translate(0, ${i * 20})`}>
            <rect width="10" height="10" fill={item.color} />
            <text x="15" y="10" fontSize="12">
              {item.name} ({((item.value / total) * 100).toFixed(0)}%)
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

const BudgetTracker = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [editId, setEditId] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("expense");
  const [activeChart, setActiveChart] = useState("bar");
  const [timeRange, setTimeRange] = useState("month");

  // Load data from localStorage
  useEffect(() => {
    const data = getBudgetData();
    if (data.transactions) setTransactions(data.transactions);
    if (data.categories && data.categories.length > 0) {
      setCategories(data.categories);
    } else {
      setCategories(defaultCategories);
      saveBudgetData({ transactions: [], categories: defaultCategories });
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    saveBudgetData({ transactions, categories });
  }, [transactions, categories]);

  // Add or update transaction
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount || !category) return;

    if (editId) {
      // Update existing transaction
      setTransactions(transactions.map(t =>
        t.id === editId ? { ...t, title, amount: parseFloat(amount), type, category, date } : t
      ));
      setEditId(null);
    } else {
      // Add new transaction
      const newTransaction = {
        id: Date.now(),
        title,
        amount: parseFloat(amount),
        type,
        category,
        date
      };
      setTransactions([...transactions, newTransaction]);
    }

    // Reset form
    setTitle("");
    setAmount("");
    setCategory("");
  };

  // Delete transaction
  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  // Edit transaction
  const handleEdit = (transaction) => {
    setTitle(transaction.title);
    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category);
    setDate(transaction.date);
    setEditId(transaction.id);
  };

  // Add new category
  const addCategory = () => {
    if (!newCategory) return;
    
    const newCat = {
      id: Date.now(),
      name: newCategory,
      type: newCategoryType,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
    
    setCategories([...categories, newCat]);
    setNewCategory("");
  };

  // Delete category
  const deleteCategory = (id) => {
    if (transactions.some(t => t.category === categories.find(c => c.id === id)?.name)) {
      alert("Cannot delete a category that has transactions");
      return;
    }
    setCategories(categories.filter(c => c.id !== id));
  };

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Prepare data for charts
  const categoryData = categories
    .filter(cat => cat.type === "expense")
    .map(cat => {
      const total = transactions
        .filter(t => t.type === "expense" && t.category === cat.name)
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        name: cat.name,
        value: total,
        color: cat.color
      };
    })
    .filter(item => item.value > 0);

  const monthlyData = () => {
    const months = {};
    transactions.forEach(t => {
      const month = t.date.substring(0, 7); // YYYY-MM format
      if (!months[month]) months[month] = { income: 0, expense: 0, month };
      
      if (t.type === "income") {
        months[month].income += t.amount;
      } else {
        months[month].expense += t.amount;
      }
    });
    
    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month));
  };

  // Filter transactions by time range
  const filteredTransactions = transactions.filter(transaction => {
    if (timeRange === "all") return true;
    
    const transactionDate = new Date(transaction.date);
    const now = new Date();
    const differenceMs = now - transactionDate;
    const daysDifference = differenceMs / (1000 * 60 * 60 * 24);
    
    if (timeRange === "week") return daysDifference <= 7;
    if (timeRange === "month") return daysDifference <= 30;
    if (timeRange === "year") return daysDifference <= 365;
    
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-6 text-[#7700cf] flex items-center justify-center"
      >
        <FaWallet className="mr-2" /> Budget Tracker
      </motion.h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500"
        >
          <h3 className="text-lg font-semibold text-gray-700">Income</h3>
          <p className="text-2xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 rounded-xl shadow-md border-l-4 border-red-500"
        >
          <h3 className="text-lg font-semibold text-gray-700">Expenses</h3>
          <p className="text-2xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow-md border-l-4 border-[#7700cf]"
        >
          <h3 className="text-lg font-semibold text-gray-700">Balance</h3>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${balance.toFixed(2)}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form and Categories */}
        <div className="lg:col-span-1 space-y-6">
          {/* Transaction Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 rounded-xl shadow-md"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#7700cf] flex items-center">
              <FaPlus className="mr-2" /> {editId ? "Edit Transaction" : "Add Transaction"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                min="0"
                step="0.01"
                required
              />
              
              <div className="flex space-x-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="expense"
                    checked={type === "expense"}
                    onChange={() => setType("expense")}
                    className="mr-2"
                  />
                  Expense
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="income"
                    checked={type === "income"}
                    onChange={() => setType("income")}
                    className="mr-2"
                  />
                  Income
                </label>
              </div>
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories
                  .filter(cat => cat.type === type)
                  .map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                }
              </select>
              
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
              
              <button
                type="submit"
                className="w-full bg-[#7700cf] hover:bg-[#5e00a8] text-white p-3 rounded-lg  transition-colors shadow-md"
              >
                {editId ? "Update Transaction" : "Add Transaction"}
              </button>
              
              {editId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditId(null);
                    setTitle("");
                    setAmount("");
                    setCategory("");
                    setDate(new Date().toISOString().split('T')[0]);
                  }}
                  className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </motion.div>

          {/* Category Management */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-4 rounded-xl shadow-md"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#7700cf] flex items-center">
              <FaPiggyBank className="mr-2" /> Manage Categories
            </h2>
            
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                placeholder="New Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
              <select
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <button
                onClick={addCategory}
                className="bg-[#7700cf] hover:bg-[#5e00a8] text-white p-2 rounded-lg "
              >
                <FaPlus />
              </button>
            </div>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span>{cat.name}</span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded ${cat.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {cat.type}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Charts and Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Controls */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-4 rounded-xl shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#7700cf] flex items-center">
                <FaChartLine className="mr-2" /> Financial Overview
              </h2>
              
              <div className="flex space-x-2">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </select>
                
                <div className="flex bg-gray-200 rounded-lg p-1">
                  <button
                    onClick={() => setActiveChart("bar")}
                    className={`px-3 py-1 rounded ${activeChart === "bar" ? "bg-[#7700cf] text-white" : ""}`}
                  >
                    Bar
                  </button>
                  <button
                    onClick={() => setActiveChart("pie")}
                    className={`px-3 py-1 rounded ${activeChart === "pie" ? "bg-[#7700cf] text-white" : ""}`}
                  >
                    Pie
                  </button>
                </div>
              </div>
            </div>
            
            <div className="h-80 flex items-center justify-center">
              {activeChart === "bar" ? (
                <BarChart data={monthlyData()} width={500} height={300} />
              ) : (
                <PieChart data={categoryData} width={500} height={300} />
              )}
            </div>
          </motion.div>

          {/* Transactions List */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-4 rounded-xl shadow-md"
          >
            <h2 className="text-xl font-semibold mb-3 text-[#7700cf]">Recent Transactions</h2>
            
            <div className="overflow-y-auto max-h-80">
              <AnimatePresence>
                {filteredTransactions.length === 0 ? (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-4 text-gray-500"
                  >
                    No transactions found. Add your first transaction!
                  </motion.p>
                ) : (
                  filteredTransactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex justify-between items-center p-3 border-b border-gray-200"
                      >
                        <div>
                          <h3 className="font-medium">{transaction.title}</h3>
                          <p className="text-sm text-gray-500">
                            {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <p className={`font-semibold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </p>
                          
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="text-[#7700cf] hover:text-[#7700cf]"
                          >
                            <FaEdit />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </motion.div>
                    ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;