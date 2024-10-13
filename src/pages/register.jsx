import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpUser } from "../config/firebase/firebaseMethods";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // loading state
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when registration starts
    const userObj = { name, email, password };

    try {
      await signUpUser(userObj);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false); // Set loading to false after registration process ends
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full transform hover:scale-105 transition duration-500 ease-in-out">
        <h1 className="text-center text-4xl font-extrabold text-indigo-800 mb-8 animate-pulse">
          Register
        </h1>
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:border-purple-600 transition duration-300 ease-in-out"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:border-purple-600 transition duration-300 ease-in-out"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-md focus:outline-none focus:border-purple-600 transition duration-300 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg transform hover:translate-y-1 transition-all duration-300 ease-in-out ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-purple-800"
              }`}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to="/" className="text-purple-700 hover:text-purple-800 transition duration-300 ease-in-out">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
