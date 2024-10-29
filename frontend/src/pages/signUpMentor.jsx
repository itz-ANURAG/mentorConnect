import React, { useState } from 'react';
import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setLoading,setRole } from '../slices/authSlice';
import { toast } from 'react-hot-toast';
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

  const sampleSkills = ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'Python', 'Django', 'MongoDB'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMentorData({ ...mentorData, [name]: value });
  };

  const handleAddSkill = (e) => {
    const selectedSkill = e.target.value;
    if (selectedSkill && !mentorData.skills.includes(selectedSkill)) {
      setMentorData({
        ...mentorData,
        skills: [...mentorData.skills, selectedSkill],
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
        console.log(key)
        formDataToSend.append(key, mentorData[key]);
      }
         console.log(formDataToSend)
      const response = await axios.post('/api/signUpMentor', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }});
        if (response.data.success) {
      dispatch(setToken(response.data.token));
      dispatch(setRole("mentor"));
      console.log(response.data);
      dispatch(setMentorData(response.data.mentor));
      toast.success('Signed in successfully');
      navigate('/profile');
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
      <NavLink to='/'>
         <img src={logo} alt="Logo" className="w-36 h-36 object-contain" />
      </NavLink>
      </div>

      {/* Right Side - Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg"
          encType="multipart/form-data"
        >
          {activeStep === 0 ? (
            <>
              {/* Step 1: Primary Info */}
              <h2 className="text-2xl font-bold text-center text-black mb-6">Sign Up Mentor</h2>
              
              {/* Profile Picture */}
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
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={mentorData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={mentorData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={mentorData.password}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={mentorData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm">
                  Already registered?{' '}
                  <Link to="/login" className="text-green-600 hover:text-green-800">
                    Login here
                  </Link>
                </p>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Secondary Info */}
              <h2 className="text-2xl font-bold text-center text-black mb-6">Sign Up Mentor</h2>
              
              <div className="space-y-4">
                <textarea
                  name="bio"
                  placeholder="Bio (Optional)"
                  value={mentorData.bio}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="text"
                  name="jobTitle"
                  placeholder="Job Title"
                  value={mentorData.jobTitle}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={mentorData.company}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={mentorData.location}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <textarea
                  name="summary"
                  placeholder="Summary"
                  value={mentorData.summary}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />

                {/* Skills Dropdown */}
                <div>
                  <select
                    value=""
                    onChange={handleAddSkill}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    <option value="" disabled>
                      Select a skill
                    </option>
                    {sampleSkills.map((skill, index) => (
                      <option key={index} value={skill}>
                        {skill}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex flex-wrap">
                    {mentorData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-green-600 text-white px-3 py-1 rounded-full mr-2 mb-2 flex items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          className="ml-2"
                          onClick={() => handleDeleteSkill(skill)}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default MentorSignup;