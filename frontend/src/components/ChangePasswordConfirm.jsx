import { useState  } from "react";
import logo from "../assets/logo.png"
import axios from "axios";
import { useParams ,useNavigate} from "react-router";
import toast from "react-hot-toast";

export default function SetNewPassword() {
  const token = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    // Handle password reset logic here
    try {
      // console.log(token.token);
      const responce = await axios.post(`http://localhost:3000/api/reset-password/${token.token}`,{newPassword:password , confirmPassword:password})
      // console.log(responce)
      if(responce.data.success){
        toast.success("Password Reset succesfully");
        navigate('/login');
      }
      else{
        console.log("error");
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong");
      navigate('/login');
    }
    console.log("Password reset confirmed");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section */}
      <a href="/">
      <div className="w-2/5 bg-black flex justify-center items-center">
        <img src={logo} alt="Logo" className="h-32" />
      </div>
      </a>
      {/* Right section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="bg-white p-8 max-w-md w-full space-y-8">
          <h2 className="text-3xl font-bold text-gray-700">Set a new password</h2>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                  New password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`appearance-none block w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600">
                  Confirm new password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  className={`appearance-none block w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Confirm
              </button>
            </div>
          </form>
          </div>
      </div>
    </div>
      );
    }