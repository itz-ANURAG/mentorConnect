import { useState } from "react";
import logo from "../assets/logo.png"

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    // Basic email regex for validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    // Handle sending reset link logic here
    console.log("Reset link sent to:", email);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section */}
      <div className="w-2/5 bg-black flex justify-center items-center">
        <img src={logo} alt="Logo" className="h-32" />
      </div>

      {/* Right section */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <h2 className=" text-3xl font-extrabold text-gray-900">Reset your password</h2>
          <p className="mt-2  text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Send reset link
              </button>
            </div>
          </form>

          <div className="text-center">
            <a href="#" className="font-medium text-green-600 hover:text-green-500 underline">
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
