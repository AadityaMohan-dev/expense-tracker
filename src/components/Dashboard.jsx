import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Modal from "./Modal";

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [totalAmountLeft, setTotalAmountLeft] = useState(100); // Initialize with a total amount
  const [savedAmount, setSavedAmount] = useState(0);
  const [userDetails, setUserDetails] = useState({ name: "", budget: "" });
  const [expenses, setExpenses] = useState([]); // Array of expense objects
  const [editingExpense, setEditingExpense] = useState(null); // Track the expense being edited
  const [editedCategory, setEditedCategory] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // Manage modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve user details from localStorage
    const userDetailsString = localStorage.getItem("userDetails");
    if (userDetailsString) {
      const details = JSON.parse(userDetailsString);
      setUserDetails(details);
      const initialBudget = parseFloat(details.budget);
      setTotalAmountLeft(initialBudget - savedAmount);
    }

    // Retrieve the saved amount from localStorage
    const storedAmount = localStorage.getItem("savedAmount");
    if (storedAmount) {
      setSavedAmount(parseFloat(storedAmount));
      if (userDetails.budget) {
        setTotalAmountLeft(parseFloat(userDetails.budget) - parseFloat(storedAmount));
      }
    }

    // Retrieve expenses from localStorage
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, [savedAmount, userDetails.budget]);

  const calculateTotalAmountLeft = () => {
    if (userDetails.budget) {
      setTotalAmountLeft(parseFloat(userDetails.budget) - savedAmount);
    }
  };

  const handleChangeCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleChangeAmount = (e) => {
    setAmount(e.target.value);
  };

  const handleSubmit = () => {
    const newSavedAmount = savedAmount + parseFloat(amount);
    localStorage.setItem("savedAmount", newSavedAmount);
    setSavedAmount(newSavedAmount);
    setTotalAmountLeft(parseFloat(userDetails.budget) - newSavedAmount);

    // Update expenses and localStorage
    const newExpense = { category, amount: parseFloat(amount), date: new Date().toLocaleString() };
    const updatedExpenses = [...expenses, newExpense];
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);

    // Clear input fields
    setCategory("");
    setAmount("");
  };

  const handleEdit = (index) => {
    const expenseToEdit = expenses[index];
    setEditingExpense(index);
    setEditedCategory(expenseToEdit.category);
    setEditedAmount(expenseToEdit.amount);
    setModalOpen(true); // Open the modal
  };

  const handleEditSubmit = () => {
    const updatedExpenses = expenses.map((exp, index) =>
      index === editingExpense
        ? { ...exp, category: editedCategory, amount: parseFloat(editedAmount) }
        : exp
    );
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);

    // Recalculate savedAmount
    const newSavedAmount = updatedExpenses.reduce((acc, exp) => acc + exp.amount, 0);
    setSavedAmount(newSavedAmount);
    
    // Recalculate total amount left
    calculateTotalAmountLeft();
    
    setEditingExpense(null);
    setEditedCategory("");
    setEditedAmount("");
    setModalOpen(false); // Close the modal
  };

  const handleDelete = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);

    // Recalculate savedAmount
    const newSavedAmount = updatedExpenses.reduce((acc, exp) => acc + exp.amount, 0);
    setSavedAmount(newSavedAmount);

    // Recalculate total amount left
    calculateTotalAmountLeft();
  };

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("savedAmount");
    localStorage.removeItem("expenses");
    navigate("/");
  };

  // Prepare data for the chart
  const expenseData = {
    labels: expenses.map((exp) => exp.category),
    datasets: [
      {
        label: "Expenses",
        data: expenses.map((exp) => exp.amount),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Amount: $${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div id="main-dashboard" className="h-full md:px-8 md:py-8 lg:px-10 lg:py-10">
      <div id="row-1" className="flex flex-col sm:flex-row sm:justify-between pb-5">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl">
          Welcome,{" "}
          <span className="text-blue-500">{userDetails.name}</span>
        </h1>
        <button
          className="bg-red-600 text-white px-4 py-2 font-semibold rounded mt-4 sm:mt-0"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div id="row-2" className="flex flex-col sm:flex-row sm:gap-5">
        <div id="left-col" className="w-full sm:w-1/2">
          <div
            id="total-amount-left"
            className="bg-white rounded-lg shadow-lg p-4 sm:p-5 h-auto sm:h-36"
          >
            <span className="text-lg sm:text-xl font-semibold">
              Total Amount Left: ${totalAmountLeft.toFixed(2)}
            </span>
            <div className="mt-2">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    $0
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    ${userDetails.budget}
                  </span>
                </div>
                <div className="flex">
                  <div className="bg-gray-200 rounded-full h-4 w-full">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{
                        width: `${
                          (totalAmountLeft / parseFloat(userDetails.budget)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="graph" className="mt-5 bg-white rounded-lg p-4 sm:p-10 h-auto sm:h-72">
            <Bar data={expenseData} options={options} />
          </div>
        </div>

        <div
          id="right-col"
          className="px-4 sm:px-10 py-4 mt-5 md:mt-0 sm:py-5 bg-white rounded-lg grid gap-5 w-full sm:w-1/2"
        >
          <span className="text-xl sm:text-2xl uppercase font-semibold text-blue-500">
            Add An Expense
          </span>
          <label htmlFor="category" className="text-lg font-semibold sm:text-2xl capitalize">
            Enter Category
          </label>
          <input
            className="border border-black rounded-md h-10 sm:h-12 px-4 sm:px-5"
            type="text"
            name="category"
            value={category}
            onChange={handleChangeCategory}
            placeholder="Ex: Vegetables"
          />
          <label htmlFor="amount" className="text-lg font-semibold sm:text-2xl capitalize">
            Enter Amount
          </label>
          <input
            className="border border-black rounded-md h-10 sm:h-12 px-4 sm:px-5"
            type="number"
            name="amount"
            value={amount}
            onChange={handleChangeAmount}
            placeholder="Ex: 1000"
          />
          <button
            className="bg-blue-600 h-10 sm:h-12 rounded-lg font-semibold text-white uppercase mt-3"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>

      <div id="row-3" className="mt-5 bg-white rounded-lg p-4 sm:p-10 h-auto sm:h-[100vh] overflow-y-auto">
        <div id="head" className="mb-5">
          <span className="text-xl sm:text-3xl text-blue-600 uppercase font-semibold">Transactions</span>
        </div>
        <div id="table">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Category</th>
                <th className="border border-gray-300 p-2">Amount</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2">{exp.category}</td>
                  <td className="border border-gray-300 p-2">${exp.amount.toFixed(2)}</td>
                  <td className="border border-gray-300 p-2">{exp.date}</td>
                  <td className="border border-gray-300 p-2 flex justify-center space-x-2">
                    <button
                      className="bg-yellow-500 text-white font-semibold px-2 sm:px-3 py-1 rounded"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 font-semibold sm:px-3 py-1 rounded"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleEditSubmit}
        editedCategory={editedCategory}
        setEditedCategory={setEditedCategory}
        editedAmount={editedAmount}
        setEditedAmount={setEditedAmount}
      />
    </div>
  );
}

export default Dashboard;
