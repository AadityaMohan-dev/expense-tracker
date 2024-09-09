import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/bdhome.jpg";

function SignUpPage() {
  const [details, setDetails] = useState({
    name: "",
    budget: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const detailsString = JSON.stringify({
      name: details.name,
      budget: details.budget,
    });

    // Store the JSON string in localStorage
    localStorage.setItem("userDetails", detailsString);

    // Redirect to Dashboard
    navigate("/dashboard");
  };

  return (
    <div id="main-dashboard-container" className="flex flex-col lg:flex-row items-center px-5 py-3 lg:p-10 bg-white rounded-xl mt-2 md:mt-4">
      <div id="col-1" className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
        <span className="text-3xl lg:text-7xl capitalize font-semibold text-blue-600 text-center lg:text-left">
          Welcome to EXT{" "}
        </span>
        <span className="text-2xl lg:text-6xl font-semibold capitalize text-center lg:text-left pb-3 md:pb-0">
          track your expenses
        </span>

        <div id="form-fields" className="grid gap-4 md:py-5 px-3 w-full lg:w-3/4">
          <label htmlFor="name" className="text-lg lg:text-2xl capitalize font-semibold">
            Enter Your Name
          </label>
          <input
            className="border border-black rounded-md h-10 lg:h-12 px-4 lg:px-5"
            type="text"
            name="name"
            onChange={handleChange}
          />
          <label htmlFor="budget" className="text-lg lg:text-2xl capitalize font-semibold">
            Enter Your Monthly Budget
          </label>
          <input
            className="border border-black rounded-md h-10 lg:h-12 px-4 lg:px-5"
            type="text"
            name="budget"
            onChange={handleChange}
          />
          <button
            className="bg-blue-600 h-10 lg:h-12 rounded-lg font-semibold text-white uppercase mt-3"
            onClick={handleSubmit}
          >
            Create Account
          </button>
        </div>
      </div>
      <div id="col-2" className="w-full lg:w-1/2 flex justify-center lg:justify-end  lg:mt-0">
        <img src={bg} alt="Background" className="w-full lg:w-3/4 max-w-lg" />
      </div>
    </div>
  );
}

export default SignUpPage;
