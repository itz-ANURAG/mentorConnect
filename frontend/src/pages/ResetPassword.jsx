import { useState } from "react";
import {NavLink} from "react-router-dom"
import logo from "../assets/logo.png"
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../slices/authSlice";
import { CustomSpinner } from "../components/CustomSpinner";

export default function PasswordReset() {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};
  console.log(role);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    // Basic email regex for validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    // Handle sending reset link logic here
    dispatch(setLoading(true));
    try {
      const responce = await axios.post(
        "http://localhost:3000/api/send-reset-password-email",
        { email: email, role: role }
      );
      if (responce.data.success) {
        toast.success("Reset link sent successfully");
        dispatch(setLoading(false));
        navigate("/login");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      dispatch(setLoading(false));
      navigate("/login");
    }

    console.log("Reset link sent to:", email);
  };

  return (
    <>
      {loading ? (
        <CustomSpinner />
      ) : (
        <div className="flex min-h-screen">
          {/* Left section */}
          <a href="/">
            <div className="w-2/5 bg-black flex justify-center items-center">
              <img src={logo} alt="Logo" className="h-32" />
            </div>
          </a>
          {/* Right section */}
          <div className="w-1/2 flex items-center justify-center">
            <div className="max-w-md w-full space-y-8">
              <h2 className=" text-3xl font-extrabold text-gray-900">
                Reset your password
              </h2>
              <p className="mt-2  text-sm text-gray-600">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                        error ? "border-red-500" : "border-gray-300"
                      } placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={handleSubmit}
                  >
                    Send reset link
                  </button>
                </div>
              </form>

              <div className="text-center">
                <a
                  href="/login"
                  className="font-medium text-green-600 hover:text-green-500 underline"
                >
                  Back to login
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
