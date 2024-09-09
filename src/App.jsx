import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import SignUpPage from "./components/SignUpPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "long", // e.g., "Monday"
      year: "numeric", // e.g., "2024"
      month: "long", // e.g., "September"
      day: "numeric", // e.g., "4"
    });
  };

  const formatTime = (time) => {
    return time.toLocaleString("en-US", {
      hour: "2-digit", // e.g., "09 AM"
      minute: "2-digit", // e.g., "00"
      second: "2-digit", // e.g., "00"
    });
  };

  return (
    <Router>
      <div id="main-container" className="h-full min-h-screen  bg-black px-10 ">
        <div id="time-date" className="flex justify-between py-1 md:py-3">
          <div id="date" className="font-semibold font-sans text-white text-sm md:text-lg">
            {formatDate(date)}
          </div>
          <div id="time" className="font-semibold font-sans text-white text-sm md:text-lg">
            {formatTime(time)}
          </div>
        </div>
        <Routes>
          <Route path="/" element={<SignUpPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
