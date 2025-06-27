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

// ChartJS setup
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [totalAmountLeft, setTotalAmountLeft] = useState(100);
  const [savedAmount, setSavedAmount] = useState(0);
  const [userDetails, setUserDetails] = useState({ name: "", budget: "" });
  const [expenses, setExpenses] = useState([]); // should always be an array
  const [editingExpense, setEditingExpense] = useState(null);
  const [editedCategory, setEditedCategory] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Load from localStorage
  useEffect(() => {
    const userDetailsString = localStorage.getItem("userDetails");
    if (userDetailsString) {
      const details = JSON.parse(userDetailsString);
      setUserDetails(details);
    }

    const storedAmount = localStorage.getItem("savedAmount");
    if (storedAmount) {
      setSavedAmount(parseFloat(storedAmount));
    }

    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      const parsed = JSON.parse(storedExpenses);

      // 🔐 Ensure `expenses` is always an array
      if (Array.isArray(parsed)) {
        setExpenses(parsed);
      } else {
        const converted = Object.entries(parsed).map(([category, amount]) => ({
          category,
          amount,
          date: new Date().toLocaleString(),
        }));
        setExpenses(converted);
      }
    }
  }, []);

  // Calculate remaining amount
  useEffect(() => {
    if (userDetails.budget) {
      setTotalAmountLeft(parseFloat(userDetails.budget) - savedAmount);
    }
  }, [savedAmount, userDetails.budget]);

  const handleChangeCategory = (e) => setCategory(e.target.value);
  const handleChangeAmount = (e) => setAmount(e.target.value);

  // ✅ Add/update expense
  const handleSubmit = () => {
    const parsedAmount = parseFloat(amount);
    if (!category || isNaN(parsedAmount)) return;

    setExpenses((prevExpenses) => {
      const updatedExpenses = [...prevExpenses];
      const index = updatedExpenses.findIndex(
        (exp) => exp.category.toLowerCase() === category.toLowerCase()
      );

      if (index !== -1) {
        // Category exists → update amount
        updatedExpenses[index] = {
          ...updatedExpenses[index],
          amount: updatedExpenses[index].amount + parsedAmount,
          date: new Date().toLocaleString(),
        };
      } else {
        // New category → add entry
        updatedExpenses.push({
          category,
          amount: parsedAmount,
          date: new Date().toLocaleString(),
        });
      }

      // Update localStorage + states
      const newSavedAmount = updatedExpenses.reduce((acc, exp) => acc + exp.amount, 0);
      localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
      localStorage.setItem("savedAmount", newSavedAmount);

      setSavedAmount(newSavedAmount);
      setTotalAmountLeft(parseFloat(userDetails.budget) - newSavedAmount);

      return updatedExpenses;
    });

    setCategory("");
    setAmount("");
  };

  const handleEdit = (index) => {
    const expenseToEdit = expenses[index];
    setEditingExpense(index);
    setEditedCategory(expenseToEdit.category);
    setEditedAmount(expenseToEdit.amount);
    setModalOpen(true);
  };

  const handleEditSubmit = () => {
    const updatedExpenses = expenses.map((exp, index) =>
      index === editingExpense
        ? { ...exp, category: editedCategory, amount: parseFloat(editedAmount) }
        : exp
    );
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);

    const newSavedAmount = updatedExpenses.reduce((acc, exp) => acc + exp.amount, 0);
    setSavedAmount(newSavedAmount);
    setTotalAmountLeft(parseFloat(userDetails.budget) - newSavedAmount);

    setEditingExpense(null);
    setEditedCategory("");
    setEditedAmount("");
    setModalOpen(false);
  };

  const handleDelete = (index) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    setExpenses(updatedExpenses);

    const newSavedAmount = updatedExpenses.reduce((acc, exp) => acc + exp.amount, 0);
    setSavedAmount(newSavedAmount);
    setTotalAmountLeft(parseFloat(userDetails.budget) - newSavedAmount);
  };

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    localStorage.removeItem("savedAmount");
    localStorage.removeItem("expenses");
    navigate("/");
  };

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
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Amount: $${tooltipItem.raw}`,
        },
      },
    },
  };

  return (
    <div className="h-full md:px-8 md:py-8 lg:px-10 lg:py-10">
      <div className="flex flex-col sm:flex-row sm:justify-between pb-5">
        <h1 className="text-white text-4xl">
          Welcome, <span className="text-blue-500">{userDetails.name}</span>
        </h1>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 font-semibold rounded mt-4 sm:mt-0">
          Logout
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-5">
        <div className="w-full sm:w-1/2">
          <div className="bg-white rounded-lg shadow-lg p-5 h-36">
            <span className="text-xl font-semibold">
              Total Amount Left: ${totalAmountLeft.toFixed(2)}
            </span>
            <div className="mt-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>$0</span>
                <span>${userDetails.budget}</span>
              </div>
              <div className="bg-gray-200 h-4 rounded-full mt-1">
                <div
                  className="bg-blue-500 h-4 rounded-full"
                  style={{
                    width: `${(totalAmountLeft / parseFloat(userDetails.budget || 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-white rounded-lg p-4 sm:p-10 h-72">
            <Bar data={expenseData} options={options} />
          </div>
        </div>

        <div className="px-4 sm:px-10 py-4  sm:py-5 bg-white rounded-lg grid gap-5 w-full sm:w-1/2">
          <span className="text-2xl uppercase font-semibold text-blue-500">
            Add An Expense
          </span>
          <label htmlFor="category" className="text-xl font-semibold capitalize">Enter Category</label>
          <input
            className="border border-black rounded-md h-12 px-4"
            type="text"
            name="category"
            value={category}
            onChange={handleChangeCategory}
            placeholder="Ex: Vegetables"
          />
          <label htmlFor="amount" className="text-xl font-semibold capitalize">Enter Amount</label>
          <input
            className="border border-black rounded-md h-12 px-4"
            type="number"
            name="amount"
            value={amount}
            onChange={handleChangeAmount}
            placeholder="Ex: 1000"
          />
          <button
            className="bg-blue-600 h-12 rounded-lg font-semibold text-white uppercase mt-3"
            onClick={handleSubmit}
          >
            Add
          </button>
        </div>
      </div>

      <div className="mt-5 bg-white rounded-lg p-10 h-auto overflow-y-auto">
        <span className="text-3xl text-blue-600 uppercase font-semibold">Transactions</span>
        <table className="min-w-full border-collapse mt-4">
          <thead>
            <tr>
              <th className="border p-2">Category</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, index) => (
              <tr key={index} className="text-center">
                <td className="border capitalize p-2">{exp.category}</td>
                <td className="border p-2">${exp.amount.toFixed(2)}</td>
                <td className="border p-2">{exp.date}</td>
                <td className="border p-2 flex justify-center space-x-2">
                  <button
                    className="bg-yellow-500 text-white font-semibold px-3 py-1 rounded"
                    onClick={() => handleEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 font-semibold rounded"
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
