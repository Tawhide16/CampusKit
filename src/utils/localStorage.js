// utils/localStorage.js

const STORAGE_KEY = "classSchedules";

// সব schedule load করার জন্য
export const getSchedules = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// নতুন schedule save করার জন্য
export const saveSchedules = (schedules) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
};
