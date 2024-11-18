import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from "../assets/logo.png";
import googleLogo from "../assets/google.png";
import { useSelector, useDispatch } from "react-redux";
import { setToken, setLoading, setRole } from "../slices/authSlice";
import { toast } from "react-hot-toast";
import { NavLink, useNavigate } from 'react-router-dom';
import { setMenteeData } from '../slices/menteeSlice';
import { setMentorData } from '../slices/mentorSlice';
import { CustomSpinner } from '../components/CustomSpinner';

const Login = () => {
  // Fetching backend URL from environment variables
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // State for form data and user type (mentee or mentor)
  const [isMentee, setIsMentee] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });

  // Redux hooks to dispatch actions and select data
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);

  // Toggle between mentee and mentor roles
  const toggleUserType = (type) => {
    setIsMentee(type === 'mentee');
  };

  // Update form data on input change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit the form to authenticate the user
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true)); // Start loading state
    try {
      // Sending login request to the backend
      const response = await axios.post(`${BACKEND_URL}/api/login`, {
        role: isMentee ? 'mentee' : 'mentor',
        email: formData.email,
        password: formData.password,
      });

      // Logging in successfully, dispatching actions to store user data
      dispatch(setToken(response.data.token));
      dispatch(setRole(response.data.role));

      // Storing mentee or mentor data based on the role
      if (response.data.role === 'mentor') {
        dispatch(setMentorData(response.data.user));
      } else if (response.data.role === 'mentee') {
        dispatch(setMenteeData(response.data.user));
      }

      toast.success("Logged in successfully");
      navigate("/"); // Redirect to the homepage on successful login
    } catch (error) {
      console.error(error);
      // Handling error if login fails
      if (error.response) {
        toast.error(error.response.data.message); // Display backend error message
      } else {
        toast.error("An error occurred while logging in.");
      }
    } finally {
      dispatch(setLoading(false)); // Stop loading state
    }
  };

  // Handling Google login
  const handleGoogle = (e) => {
    e.preventDefault();
    console.log("Google login initiated");
    window.open(`${BACKEND_URL}/auth/googleAuth`, "_self");
  };

  // Navigate to password reset page
  const handleForgotPassword = () => {
    navigate('/resetPassword', { state: { role: isMentee ? 'mentee' : 'mentor' } });
  };

  return (
    <>
      {
        loading ? <CustomSpinner/> : // Show loading spinner if data is loading
        <div className="flex h-screen">
          {/* Left side for logo */}
          <div className="w-2/5 bg-black flex justify-center items-center">
            <NavLink to='/'>
              <img src={logo} alt="Logo" className="h-32" />
            </NavLink>
          </div>

          {/* Right side for the login form */}
          <div className="w-1/2 flex justify-center items-center">
            <div className="w-96 p-8">
              <h2 className="text-3xl font-semibold mb-8">Log in</h2>

              {/* Buttons to toggle between mentee and mentor login */}
              <div className="flex mb-4">
                <button
                  onClick={() => toggleUserType('mentee')}
                  className={`px-4 py-2 ${isMentee ? 'bg-teal-600 text-white' : 'text-teal-600'}`}
                >
                  I'm a mentee
                </button>
                <button
                  onClick={() => toggleUserType('mentor')}
                  className={`px-4 py-2 ${!isMentee ? 'bg-teal-600 text-white' : 'text-teal-600'}`}
                >
                  I'm a mentor
                </button>
              </div>

              {/* Form for email and password */}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">
                    {isMentee ? 'Mentee Email or Username' : 'Mentor Email or Username'}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder={isMentee ? 'Mentee Email or Username' : 'Mentor Email or Username'}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Password"
                  />
                </div>

                <button className="w-full bg-teal-600 text-white py-2 rounded-lg border-b-4 border-teal-700">
                  Log in as {isMentee ? 'Mentee' : 'Mentor'}
                </button>
              </form>

              {/* Google login option for mentee */}
              {isMentee && (
                <>
                  <div className="flex items-center my-4">
                    <hr className="w-full border-gray-300" />
                    <span className="mx-2 text-gray-500">Or</span>
                    <hr className="w-full border-gray-300" />
                  </div>

                  <button onClick={handleGoogle} className="w-full bg-white text-gray-700 border py-2 rounded-lg flex justify-center items-center">
                    <img src={googleLogo} alt="Google" className="h-5 mr-2" />
                    Log in with Google
                  </button>
                </>
              )}

              {/* Forgot password link */}
              <p className="mt-4 text-center">
                <button onClick={handleForgotPassword} className="text-teal-600">Forgot password?</button>
              </p>
              {/* Sign up links for mentee and mentor */}
              <p className="mt-2 text-center">
                Don't have an account? <a href="signUpMentee" className="text-teal-600">Sign up as a mentee</a> or <a href="signUpMentor" className="text-teal-600">apply to be a mentor</a>.
              </p>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Login;
