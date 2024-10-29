import React, { useState } from 'react';
import logo from "../assets/logo.png";
import axios from 'axios'
import googleLogo from "../assets/google.png";
import {NavLink, useNavigate } from 'react-router-dom';
import {useSelector,useDispatch} from "react-redux";
import {setToken,setLoading,setRole} from "../slices/authSlice"
import {toast} from "react-hot-toast"
import { setMenteeData } from '../slices/menteeSlice';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  
  const dispatch=useDispatch();
  const navigate = useNavigate();
  const loading =useSelector((state)=>(state.auth.loading))

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // const validatePassword = (password) => {
  //   const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  //   return strongPasswordRegex.test(password);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (name === 'email') {
      setErrors({
        ...errors,
        email: validateEmail(value) ? '' : 'Invalid email format',
      });
    }

    if (name === 'password') {
      setErrors({
        ...errors,
        password: validatePassword(value) ? '' : 'Password must be strong: 8+ characters, 1 lowercase, 1 uppercase, 1 number, 1 special character',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setLoading(true))
    // Perform submission logic here
    axios.post('/api/signUpMentee', {
      role:'mentee',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    })
    .then(response => {
      toast.success("Siggned in successfuly")
      dispatch(setToken(response.data.token));
      dispatch(setRole("mentee"));
      console.log(response.data);
      dispatch(setMenteeData(response.data.mentee));
      navigate("/")
      console.log(response.data);
    })
    .catch(error => {
      // Handle login error
      toast.error("something went wrong ,Plz try again")
      console.error(error);
    })
      dispatch(setLoading(false))
  };

  const handleGoogle =(e)=>{
    e.preventDefault();
    console.log("Clicked");
    window.open('http://localhost:3000/auth/googleAuth',"_self")
  }

  return (
    <div className="flex h-screen">
      {/* Left Side - Blue section */}
      <div className="w-2/5 bg-black flex justify-center items-center">
        <NavLink to='/'>
          <img src={logo} alt="Logo" className="h-32" />
        </NavLink>
      </div>
      {/* Right Side - SignUp form */}
      <div className="w-1/2 flex justify-center items-center">
        <div className="w-96 p-8">
          <h2 className="text-3xl font-semibold mb-8">Sign up as a mentee</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">First name</label>
              <input
                type="text"
                name="firstName"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Last name</label>
              <input
                type="text"
                name="lastName"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-sm text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <button className="w-full bg-teal-600 text-white py-2 rounded-lg" disabled={errors.email || errors.password}>
              Sign up
            </button>
          </form>

          {/* OR line and Google Sign up button */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <button onClick={handleGoogle} className="w-full bg-white text-gray-700 border py-2 rounded-lg flex justify-center items-center mt-2">
            <img src={googleLogo} alt="Google" className="h-5 mr-2" />
            Sign up with Google
          </button>

          <p className="mt-4 text-center">
            Already have an account? <a href="/login" className="text-teal-600 underline">Log in</a>
          </p>
          <p className="mt-2 text-center">
            Looking to join us as a mentor? <a href="/signUpMentor" className="text-teal-600 underline">Apply now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
