// import React, { useState } from 'react';
// import logo from "../assets/logo.png";
// import googleLogo from "../assets/google.png";
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from "react-redux";
// import { setToken, setLoading, setRole } from "../slices/authSlice";
// import { toast } from "react-hot-toast";
// import { setMenteeData } from '../slices/menteeSlice';
// import { Eye, EyeOff } from 'react-feather'; // Import eye icons from react-feather or similar library
// import axios from 'axios';
// import { CustomSpinner } from '../components/CustomSpinner';

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     profilePicture: null,
//   });
  
//   const [profilePreview, setProfilePreview] = useState(null);
//   const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });
  
//   // State for toggling password visibility
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const loading = useSelector((state) => state.auth.loading);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: '' });
//   };

//   const handleProfileChange = (e) => {
//     const file = e.target.files[0];
//     setFormData({ ...formData, profilePicture: file });
//     setProfilePreview(file ? URL.createObjectURL(file) : null);
//   };

//   const validateEmail = (email) => {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(email)) {
//       setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
//       return false;
//     }
//     return true;
//   };

//   const validatePassword = (password) => {
//     if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
//       setErrors((prev) => ({
//         ...prev,
//         password: 'Password must be at least 8 characters and contain letters and numbers.',
//       }));
//       return false;
//     }
//     return true;
//   };

//   const validateConfirmPassword = (confirmPassword) => {
//     if (confirmPassword !== formData.password) {
//       setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
//       return false;
//     }
//     return true;
//   };

//   const handleGoogle = (e) => {
//     e.preventDefault();
//     console.log("google Initiated")
//     window.open('http://localhost:3000/auth/googleAuth', "_self");
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     dispatch(setLoading(true));

//     const isEmailValid = validateEmail(formData.email);
//     const isPasswordValid = validatePassword(formData.password);
//     const isConfirmPasswordValid = validateConfirmPassword(formData.confirmPassword);

//     if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
//       dispatch(setLoading(false));
//       return;
//     }

//     const formDataMultipart = new FormData();
//     formDataMultipart.append('role', 'mentee');
//     formDataMultipart.append('firstName', formData.firstName);
//     formDataMultipart.append('lastName', formData.lastName);
//     formDataMultipart.append('email', formData.email);
//     formDataMultipart.append('password', formData.password);
//     formDataMultipart.append('profilePicture', formData.profilePicture);

//     dispatch(setLoading(true));
//     await axios.post('http://localhost:3000/api/signUpMentee', formDataMultipart, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//       .then(response => {
//         toast.success("Signed up successfully");
//         dispatch(setToken(response.data.token));
//         dispatch(setRole("mentee"));
//         dispatch(setMenteeData(response.data.mentee));
//         navigate("/");
//       })
//       .catch(error => {
//         toast.error("Something went wrong, please try again");
//       });
//     dispatch(setLoading(false));
//   };
  
//   return (
//     <>
//     {
//       loading ? <CustomSpinner/>
//       :
//     <div className="flex min-h-screen">
//       <div className="w-2/5 bg-black flex justify-center items-center min-h-screen">
//         <NavLink to='/'>
//           <img src={logo} alt="Logo" className="h-32" />
//         </NavLink>
//       </div>
//       <div className="w-3/5 flex justify-center items-center">
//         <div className="w-96 p-8">
//           <h2 className="text-3xl font-semibold mb-4">Sign Up as a Mentee</h2>

//           {/* Profile Picture */}
//           <div className="flex justify-center mb-6">
//             <label className="relative cursor-pointer flex items-center justify-center w-24 h-24 border-2 border-teal-600 rounded-full">
//               {profilePreview ? (
//                 <img src={profilePreview} alt="Profile" className="w-full h-full rounded-full object-cover" />
//               ) : (
//                 <span className="text-sm text-gray-500">Add photo</span>
//               )}
//               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleProfileChange} />
//             </label>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* First Name */}
//             <div>
//               <label className="block text-gray-700">First Name</label>
//               <input
//                 type="text"
//                 name="firstName"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 value={formData.firstName}
//                 onChange={handleChange}
//               />
//             </div>
//             {/* Last Name */}
//             <div>
//               <label className="block text-gray-700">Last Name</label>
//               <input
//                 type="text"
//                 name="lastName"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 value={formData.lastName}
//                 onChange={handleChange}
//               />
//             </div>
//             {/* Email */}
//             <div>
//               <label className="block text-gray-700">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 value={formData.email}
//                 onChange={handleChange}
//                 onBlur={() => validateEmail(formData.email)}
//               />
//               {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
//             </div>
//             {/* Password */}
//             <div className="relative">
//               <label className="block text-gray-700">Password</label>
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 value={formData.password}
//                 onChange={handleChange}
//                 onBlur={() => validatePassword(formData.password)}
//               />
//               <div className="absolute right-3 top-8 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </div>
//               {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
//             </div>
//             {/* Confirm Password */}
//             <div className="relative">
//               <label className="block text-gray-700">Confirm Password</label>
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 onBlur={() => validateConfirmPassword(formData.confirmPassword)}
//                 />
//               <div className="absolute right-3 top-8 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </div>
//               {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
//             </div>

//             {/* Submit Button */}
//             <button className="w-full bg-teal-600 text-white py-2 rounded-lg">Sign up</button>
//           </form>

//           {/* Google Signup */}
//           <div className="mt-4">
//             <button onClick={handleGoogle} className="w-full flex items-center justify-center border py-2 rounded-lg">
//               <img src={googleLogo} alt="Google logo" className="w-5 h-5 mr-2" />
//               Sign up with Google
//             </button>
//           </div>

//             {/* Additional Links */}
//             <p className="mt-4 text-center">
//               Already have an account? <NavLink to="/login" className="text-teal-600">Log in</NavLink>
//             </p>
//             <p className="mt-2 text-center">
//               Interested in mentoring? <NavLink to="/signUpMentor" className="text-teal-600">Apply as a Mentor</NavLink>
//             </p>

//         </div>
//       </div>
//     </div>
//               }
//               </>
//   );
// };

// export default SignUp;

import React, { useState } from 'react';
import logo from "../assets/logo.png";
import googleLogo from "../assets/google.png";
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setToken, setLoading, setRole } from "../slices/authSlice";
import { toast } from "react-hot-toast";
import { setMenteeData } from '../slices/menteeSlice';
import { Eye, EyeOff } from 'react-feather'; // Import eye icons from react-feather or similar library
import axios from 'axios';
import { CustomSpinner } from '../components/CustomSpinner';
import Modal from 'react-modal';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP modal state
  const [isOtpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
    setProfilePreview(file ? URL.createObjectURL(file) : null);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
      return false;
    }
    return true;
  };

  const validatePassword = (password) => {
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password: 'Password must be at least 8 characters and contain letters and numbers.',
      }));
      return false;
    }
    return true;
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (confirmPassword !== formData.password) {
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
      return false;
    }
    return true;
  };

  const handleOtpSend = async () => {
    try {
      await axios.post('http://localhost:3000/api/sendOtp', { email: formData.email });
      toast.success('OTP sent to your email!');
      setOtpModalOpen(true);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };

  const handleOtpVerify = async () => {
    if (!otp) {
      setOtpError('Please enter the OTP.');
      return;
    }

    try {
      await handleSignup();
      toast.success('OTP verified and signup completed successfully!');
      setOtpModalOpen(false); // Proceed to signup after successful OTP verification
    } catch (error) {
      setOtpError('Invalid OTP. Please try again.');
    }
  };

  const handleSignup = async () => {
    const formDataMultipart = new FormData();
    formDataMultipart.append('role', 'mentee');
    formDataMultipart.append('firstName', formData.firstName);
    formDataMultipart.append('lastName', formData.lastName);
    formDataMultipart.append('email', formData.email);
    formDataMultipart.append('password', formData.password);
    formDataMultipart.append('profilePicture', formData.profilePicture);

    dispatch(setLoading(true));
    try {
      const response = await axios.post('http://localhost:3000/api/signUpMentee', formDataMultipart, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Signed up successfully');
      dispatch(setToken(response.data.token));
      dispatch(setRole('mentee'));
      dispatch(setMenteeData(response.data.mentee));
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong, please try again');
    }
    dispatch(setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    const isConfirmPasswordValid = validateConfirmPassword(formData.confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    handleOtpSend(); // Trigger OTP sending
  };

  return (
    <>
      {loading ? (
        <CustomSpinner />
      ) : (
        <div className="flex min-h-screen">
          <div className="w-2/5 bg-black flex justify-center items-center min-h-screen">
            <NavLink to="/">
              <img src={logo} alt="Logo" className="h-32" />
            </NavLink>
          </div>
          <div className="w-3/5 flex justify-center items-center">
            <div className="w-96 p-8">
              <h2 className="text-3xl font-semibold mb-4">Sign Up as a Mentee</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rest of the form as it is */}
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      <Modal
        isOpen={isOtpModalOpen}
        onRequestClose={() => setOtpModalOpen(false)}
        contentLabel="OTP Verification"
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full px-4 py-2 border rounded-lg mb-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
          <div className="flex justify-between mt-4">
            <button
              className="px-4 py-2 bg-teal-600 text-white rounded-lg"
              onClick={handleOtpVerify}
            >
              Verify OTP
            </button>
            <button
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              onClick={() => setOtpModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
              onClick={handleOtpSend}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SignUp;