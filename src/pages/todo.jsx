import { useEffect, useRef, useState } from "react";
import {
  deleteDocument,
  getAllData,
  sendData,
  updateDocument,
  signOutUser,
} from "../config/firebase/firebaseMethods";
import { useNavigate } from "react-router-dom";

export default function Todo() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const todoVal = useRef();
  const navigate = useNavigate();

  const addTodo = async () => {
    const newTodo = { todo: todoVal.current.value };
    if (todoVal.current.value) {
      setIsAdding(true);
      try {
        const documentId = await sendData(newTodo, "todos");
        const newItem = { ...newTodo, documentId };
        setData((prevData) => [...prevData, newItem]);
        todoVal.current.value = "";
      } catch (error) {
        console.log("Error adding todo:", error);
        alert("Failed to add todo. Please try again.");
      } finally {
        setIsAdding(false);
      }
    } else {
      alert("Input Field Cannot Be Empty");
    }
  };

  const removeTodo = async (index) => {
    const todoToRemove = data[index];
    try {
      await deleteDocument(todoToRemove.documentId, "todos");
      const updatedData = [...data];
      updatedData.splice(index, 1);
      setData(updatedData);
    } catch (error) {
      console.error("Error removing document: ", error);
      alert("Failed to remove todo. Please try again.");
    }
  };

  const editTodo = async (index) => {
    const currentTodo = data[index];
    const newValue = prompt("Enter a New Value", currentTodo.todo);

    if (newValue && newValue !== currentTodo.todo) {
      try {
        await updateDocument(currentTodo.documentId, { todo: newValue }, "todos");
        const updatedData = [...data];
        updatedData[index] = { ...currentTodo, todo: newValue };
        setData(updatedData);
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update todo. Please try again.");
      }
    } else {
      alert("Please Enter A New Value");
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      console.log("User logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    getAllData("todos")
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((err) => {
        console.log("Error fetching data:", err);
        alert("Failed to load todos. Please refresh the page.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full transform hover:scale-105 transition duration-500 ease-in-out">
        <h1 className="text-center text-4xl font-extrabold text-indigo-800 mb-8 animate-pulse">
          Todo App
        </h1>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 w-full gap-4">
          <input
            type="text"
            placeholder="Enter Todo"
            ref={todoVal}
            className="flex-1 w-full p-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:border-purple-600 transition duration-300 ease-in-out"
            disabled={isAdding}
          />
          <button
            className={`w-full sm:w-auto bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${isAdding ? "cursor-not-allowed opacity-50" : "hover:bg-purple-800 hover:translate-y-1"
              }`}
            onClick={addTodo}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add Todo"}
          </button>
        </div>
        {loading ? (
          <h1 className="text-center text-xl text-zinc-900 animate-pulse mb-4">Loading Todos...</h1>
        ) : (
          <ul className="divide-y divide-gray-200 mb-4">
            {data.length > 0 ? (
              data.map((item, index) => (
                <li
                  key={item.documentId}
                  className="flex justify-between items-center p-4 bg-gray-100 rounded-lg mb-3 shadow-lg hover:bg-gray-300 transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  <span className="text-gray-800 font-semibold">{item.todo}</span>
                  <div>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-300 ease-in-out"
                      onClick={() => removeTodo(index)}
                    >
                      Remove
                    </button>
                    <button
                      className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-300 ease-in-out"
                      onClick={() => editTodo(index)}
                    >
                      Edit
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <h2 className="text-center text-gray-600">No Todos Found</h2>
            )}
          </ul>
        )}
        <button
          className="w-full bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-700 transform hover:translate-y-1 transition-all duration-300 ease-in-out"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
