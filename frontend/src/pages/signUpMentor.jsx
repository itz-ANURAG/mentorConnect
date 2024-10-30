import React, { useState } from 'react';
import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setLoading, setRole } from '../slices/authSlice';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'react-feather'; // Import eye icons
import logo from '../assets/logo.png'; // Ensure this path is correct

const MentorSignup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mentorData, setMentorData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: null,
    bio: '',
    jobTitle: '',
    company: '',
    location: '',
    summary: '',
    skills: [],
    skillInput: '',
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sampleSkills = ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'Django', 'MongoDB'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentorData({ ...mentorData, [name]: value });
  };

  const handleAddSkill = (e) => {
    const selectedSkill = mentorData.skillInput; // Use skillInput directly
    if (selectedSkill && !mentorData.skills.includes(selectedSkill)) {
      setMentorData({
        ...mentorData,
        skills: [...mentorData.skills, selectedSkill],
        skillInput: '', // Reset input field after adding
      });
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setMentorData({
      ...mentorData,
      skills: mentorData.skills.filter((skill) => skill !== skillToDelete),
    });
  };

  const handleNext = () => {
    if (activeStep === 0 && mentorData.password !== mentorData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    setError('');

    try {
      const formDataToSend = new FormData();
      for (const key in mentorData) {
        formDataToSend.append(key, mentorData[key]);
      }
      const response = await axios.post('/api/signUpMentor', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      if (response.data.success) {
        dispatch(setToken(response.data.token));
        dispatch(setRole("mentor"));
        dispatch(setMentorData(response.data.mentor));
        toast.success('Signed up successfully');
        navigate('/');
      } else {
        toast.error('Failed to Sign Up');
      }
    } catch (err) {
      toast.error('Something went wrong, please try again');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Black Rectangle with Logo */}
      <div className="w-1/2 bg-black flex items-center justify-center">
        <NavLink to='/'><img src={logo} alt="Logo" className="w-36 h-36 object-contain" /></NavLink>
      </div>

      {/* Right Side - Form */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center p-12">
        <form onSubmit={handleSubmit} className="w-full max-w-lg" encType="multipart/form-data">
          {activeStep === 0 ? (
            <>
              <h2 className="text-2xl font-bold text-center text-black mb-6">Sign Up Mentor</h2>

              <div className="flex justify-center mb-6">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setMentorData({ ...mentorData, profilePicture: e.target.files[0] })}
                  />
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    {mentorData.profilePicture ? (
                      <img
                        src={URL.createObjectURL(mentorData.profilePicture)}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-gray-500">Add Photo</span>
                    )}
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Full Name</span>
                  <input type="text" name="name" placeholder="Full Name" value={mentorData.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                </label>
                <label className="block">
                  <span className="text-gray-700">Email</span>
                  <input type="email" name="email" placeholder="Email" value={mentorData.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                </label>
                <label className="block">
                  <span className="text-gray-700">Password</span>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" value={mentorData.password} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </span>
                  </div>
                </label>
                <label className="block">
                  <span className="text-gray-700">Confirm Password</span>
                  <div className="relative">
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" value={mentorData.confirmPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </span>
                  </div>
                </label>
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm">Already registered?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800">Login here</Link> {/* Changed color */}
                </p>
                <button type="button" onClick={handleNext} className="bg-teal-600 text-white px-4 py-2 rounded">Next</button> {/* Changed color */}
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Secondary Info */}
              <h2 className="text-2xl font-bold text-center text-black mb-6">Sign Up Mentor</h2>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-gray-700">Bio (Optional)</span>
                  <textarea name="bio" placeholder="Bio" value={mentorData.bio} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                </label>
                <label className="block">
                  <span className="text-gray-700">Job Title</span>
                  <input type="text" name="jobTitle" placeholder="Job Title" value={mentorData.jobTitle} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                </label>
                <label className="block">
                  <span className="text-gray-700">Company</span>
                  <input type="text" name="company" placeholder="Company" value={mentorData.company} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" required />
                </label>
                <label className="block">
                  <span className="text-gray-700">Location</span>
                  <input type="text" name="location" placeholder="Location" value={mentorData.location} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                </label>
                <label className="block">
                  <span className="text-gray-700">Summary</span>
                  <textarea name="summary" placeholder="Summary" value={mentorData.summary} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded" />
                </label>
                <div className="block">
                  <span className="text-gray-700">Skills</span>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {mentorData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-400">
                        <span>{skill}</span>
                        <button type="button" className="text-red-500" onClick={() => handleDeleteSkill(skill)}>×</button>
                      </div>
                    ))}
                  </div>
                  <div className="flex">
                    <select
                      name="skillInput"
                      value={mentorData.skillInput}
                      onChange={handleChange}
                      className="border border-gray-300 rounded p-2 flex-grow mr-2"
                    >
                      <option value="" disabled>Select a skill</option>
                      {sampleSkills.map((skill, index) => (
                        <option key={index} value={skill}>{skill}</option>
                      ))}
                    </select>
                    <button type="button" onClick={handleAddSkill} className="bg-teal-600 text-white px-4 py-2 rounded">Add</button>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <button type="button" onClick={handlePrev} className="bg-teal-600 text-white px-4 py-2 rounded">Previous</button> {/* Changed color */}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</button> {/* Changed color */}
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default MentorSignup;
