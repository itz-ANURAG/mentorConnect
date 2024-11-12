
import React, { useState } from "react";
import axios from "axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setToken, setLoading, setRole } from "../slices/authSlice";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "react-feather";
import logo from "../assets/logo.png";
import { setMentorData } from "../slices/mentorSlice";
import { CustomSpinner } from "../components/CustomSpinner";
import { GoogleMap, useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ["places"];

const MentorSignup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
    bio: "",
    jobTitle: "",
    company: "",
    location: "",
    summary: "",
    skills: [],
    skillInput: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sampleSkills = [
    "JavaScript", "React", "Node.js", "CSS", "HTML", "Python", "Django", "MongoDB"
  ];
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const { isLoaded } = useLoadScript({
    googleMapsApiKey:"AlzaSy3VyHXE5-vYXDN7gLxPRONy-urs6x7PM1Y", // Access the API key from Vite environment variable
    libraries,
  });

  const handleLocationChange = (autocomplete) => {
    const place = autocomplete.getPlace();
    setFormData({
      ...formData,
      location: place.formatted_address
    });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = () => {
    const { skillInput, skills } = formData;
    if (skillInput && !skills.includes(skillInput)) {
      setFormData({
        ...formData,
        skills: [...skills, skillInput],
        skillInput: "",
      });
    }
  };

  const handleDeleteSkill = (skillToDelete) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToDelete),
    });
  };

   const handleNext = () => {
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email format");
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      return;
    }
    if (activeStep === 0 && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setActiveStep((prevStep) => prevStep + 1);
  };
  const handlePrev = () => {
    setError("");
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));

      dispatch(setLoading(true));
      const response = await axios.post(
        "http://localhost:3000/api/signUpMentor",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.success) {
        dispatch(setToken(response.data.token));
        dispatch(setRole("mentor"));
        dispatch(setMentorData(response.data.mentor));
        toast.success("Signed up successfully");
        navigate("/");
      } else {
        toast.error("Failed to Sign Up");
      }
    } catch (err) {
      toast.error("Something went wrong, please try again");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {loading ? (
        <CustomSpinner />
      ) : (
        <div className="min-h-screen flex">
          <div className="w-1/2 bg-black flex items-center justify-center">
            <NavLink to="/">
              <img src={logo} alt="Logo" className="w-36 h-36 object-contain" />
            </NavLink>
          </div>
          <div className="w-1/2 bg-gray-50 flex items-center justify-center p-12">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-lg"
              encType="multipart/form-data"
            >
              {activeStep === 0 ? (
                <>
                  <h2 className="text-2xl font-bold text-center text-black mb-6">Sign Up Mentor</h2>
                  <div className="flex justify-center mb-6">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profilePicture: e.target.files[0],
                          })
                        }
                      />
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        {formData.profilePicture ? (
                          <img
                            src={URL.createObjectURL(formData.profilePicture)}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                          ) : (
                              <div className="flex-row">
                          <span className="text-gray-500">Add Photo </span><span className="text-red-500">*</span></div>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <label htmlFor="name" className="block font-medium mb-2">
                        Full Name <span className="text-red-500">*</span>
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded text-gray-900"
                          title="Please enter your full name."
                        required
                      />
                    </label>
                    <label htmlFor="email" className="block font-medium mb-2">
                        Email<span className="text-red-500">*</span>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded  text-gray-900"
                          title="Enter a valid email address."
                        required
                      />
                    </label>
                    <label htmlFor="Bio" className="block font-medium mb-2">
                        Password <span className="text-red-500">*</span>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded  text-gray-900"
                            title="Password must contain at least one uppercase letter, one lowercase letter, and one number."
                          required
                        />
                        <span
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </span>
                      </div>
                    </label>
                    <label htmlFor="Bio" className="block font-medium mb-2">
                        Confirm Password <span className="text-red-500">*</span>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded  text-gray-900"
                            title="Re-enter your password to confirm."
                          required
                        />
                        <span
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </span>
                      </div>
                    </label>
                  </div>

                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                  <div className="flex justify-between items-center mt-6">
                    <p className="text-sm">
                      Already registered?{" "}
                      <Link to="/login" className="text-blue-600 hover:text-blue-800">
                        Login here
                      </Link>
                    </p>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-teal-600 text-white px-4 py-2 rounded"
                    >
                      Next
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-center text-black mb-6">Sign Up Mentor</h2>

                  <div className="space-y-4">
                    <label htmlFor="Bio" className="block font-medium mb-2">
                        Bio <span className="text-red-500">*</span>
                      <textarea
                        name="bio"
                        placeholder="Bio"
                        value={formData.bio}
                        onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded  text-gray-900"
                            title="You can provide a brief bio about yourself."
                            required

                      />
                    </label>
                    <label htmlFor="jobTitle" className="block font-medium mb-2">
                        JobTitle <span className="text-red-500">*</span>
                      <input
                        type="text"
                        name="jobTitle"
                        placeholder="Job Title"
                        value={formData.jobTitle}
                        onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded  text-gray-900"
                            title="Please enter your current job title."
                        required
                      />
                    </label>
                    <label htmlFor="company" className="block font-medium mb-2">
                        Company <span className="text-red-500">*</span>
                      <input
                        type="text"
                        name="company"
                        placeholder="Company"
                        value={formData.company}
                        onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded  text-gray-900"
                            title="Please enter your current company."
                      />
                    </label>
                    {/* Location (Google Places) */}
                    <div className="mb-4">
                      <label htmlFor="location" className="block font-medium mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <Autocomplete
                        onPlaceChanged={() => handleLocationChange(this)}
                      >
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full p-2 border border-gray-300 rounded  text-gray-900"
                          placeholder="Enter your location"
                          required
                        />
                      </Autocomplete>
                    </div>
                    <label className="block font-medium mb-2">
                      <span className="text-gray-700">Summary</span>
                      <textarea
                        name="summary"
                        placeholder="Summary"
                        value={formData.summary}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded  text-gray-900"
                      />
                    </label>
                    <div className="flex items-center mb-4">
                      <select
                        name="skillInput"
                        value={formData.skillInput}
                        onChange={handleChange}
                        className="border border-gray-300 rounded p-2 mr-2"
                      >
                        <option value="">Select Skill</option>
                        {sampleSkills.map((skill) => (
                          <option key={skill} value={skill}>
                            {skill}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="bg-teal-600 text-white px-4 py-2 rounded"
                      >
                        Add Skill
                      </button>{" "}
                      {/* Changed color */}
                    </div>
                    <div className="flex flex-wrap">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-200 rounded-full px-3 py-1 text-base mr-2 mb-2 flex items-center"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleDeleteSkill(skill)}
                            className="ml-2 text-red-500"
                          >
                            x
                          </button>
                        </span>
                      ))}
                        </div>
                   </div>

                  {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                  <div className="flex justify-between items-center mt-6">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="bg-teal-600 text-white px-4 py-2 rounded"
                    >
                      Previous
                    </button>
                    <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded">
                      Sign Up
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MentorSignup;
