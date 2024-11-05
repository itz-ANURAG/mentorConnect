import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setMenteeData } from '../slices/menteeSlice';
import { setMentorData } from '../slices/mentorSlice';
import {useNavigate } from 'react-router';
import { CustomSpinner } from '../components/CustomSpinner';
import { setLoading } from '../slices/authSlice';

const EditProfile = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state)=>state.auth.loading)
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);
  const navigate=useNavigate()
  // Form state
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState([]);  // Selected skills for mentee
  const [newSkills, setNewSkills] = useState([]); // New skills added by mentor
  const [skillsList, setSkillsList] = useState([]);
  const [skillInput, setSkillInput] = useState(''); // Input for new skills
  const [selectedSkill, setSelectedSkill] = useState(''); // Selected skill from dropdown for mentor

  useEffect(() => {
    const fetchSkillsList = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get('http://localhost:3000/profile/getAllSkills');
        console.log(response.data);
        setSkillsList(response.data.skills); // Assuming response.data is the array of skills
      } catch (error) {
        console.error('Error fetching skills list:', error);
        toast.error("Failed to fetch All skills");
      }
      dispatch(setLoading(false));
    };
    fetchSkillsList();
  }, [token,dispatch]);

  // Handle profile picture input
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  // Add a new skill to the list (mentor only)
  const addNewSkill = () => {
    if (skillInput && !newSkills.includes(skillInput)) {
      setNewSkills([...newSkills, skillInput]);
      setSkillInput(''); // Clear input after adding
    }
  };

  // Remove a skill from the new skills list (mentor only)
  const removeNewSkill = (skill) => {
    setNewSkills(newSkills.filter((s) => s !== skill));
  };

  // Add selected skill from dropdown
  const addSelectedSkill = () => {
    if (selectedSkill && !skills.includes(selectedSkill)) {
      setSkills([...skills, selectedSkill]);
      setSelectedSkill(''); // Clear dropdown selection
    }
  };

  // Remove selected skill from skills array
  const removeSelectedSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format skills as comma-separated string
    const combinedSkills = role === 'mentor' ? [...skills, ...newSkills].join(',') : skills.join(',');

    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('bio', bio);
    formData.append('jobTitle', jobTitle);
    formData.append('company', company);
    formData.append('location', location);
    formData.append('summary', summary);
    if (role === 'mentor') formData.append('name', `${firstName} ${lastName}`);
    if (profilePicture) formData.append('profilePicture', profilePicture);
    formData.append('skills', combinedSkills); // Send skills as comma-separated string

    try {
      dispatch(setLoading(true))
      const response = await axios.put('http://localhost:3000/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.user);
      if(role==='mentee') dispatch(setMenteeData(response.data.user));
      else if(role==='mentor') dispatch(setMentorData(response.data.user));
      
      toast.success("Profile updated successfully");
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error updating profile');
    }
    dispatch(setLoading(false))
  };


  return (
    <>
    {
      loading ? <CustomSpinner/>
      :
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded shadow-md max-w-lg mx-auto">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-4">
        <label className="w-32 h-32 mb-2 relative cursor-pointer">
          {profilePicture ? (
            <img
              src={URL.createObjectURL(profilePicture)}
              alt="Profile Preview"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-500">Add Photo</span>
            </div>
          )}
          <input
            type="file"
            onChange={handleProfilePictureChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-2 border rounded"
        />
        <textarea
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="p-2 border rounded"
        />

        {/* Skills Section */}
        {role === 'mentee' ? (
          <>
          <div className="flex">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="" disabled>Select Skill</option>
              {skillsList.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addSelectedSkill}
              className="bg-teal-600 text-white px-4 rounded ml-2"
            >
              Add
            </button>
          </div>
      
          {/* Display Selected Skills for Mentee */}
          <div className="flex flex-wrap mt-2">
            {skills.map((skill, index) => (
              <span key={index} className="flex items-center px-2 py-1 bg-gray-200 rounded-full m-1">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSelectedSkill(skill)}
                  className="ml-2 text-red-500"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </>
        ) : (
          <>
            {/* Mentor Only: Skill Input & Management */}
            <div className="flex">
              <select
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="" disabled>Select Skill</option>
                {skillsList.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <button type="button" onClick={addSelectedSkill} className="bg-teal-600 text-white px-4 rounded ml-2">
                Add
              </button>
            </div>

            {/* New Skill Input for Mentors */}
            <div className="flex mt-2">
              <input
                type="text"
                placeholder="Add New Skill"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="p-2 border rounded w-full"
              />
              <button type="button" onClick={addNewSkill} className="bg-teal-600 text-white px-4 rounded ml-2">
                Add
              </button>
            </div>

            {/* Display Selected Skills */}
            <div className="flex flex-wrap mt-2">
              {skills.map((skill, index) => (
                <span key={index} className="flex items-center px-2 py-1 bg-gray-200 rounded-full m-1">
                  {skill}
                  <button type="button" onClick={() => removeSelectedSkill(skill)} className="ml-2 text-red-500">
                    &times;
                  </button>
                </span>
              ))}
              {newSkills.map((newSkill, index) => (
                <span key={index} className="flex items-center px-2 py-1 bg-gray-200 rounded-full m-1">
                  {newSkill}
                  <button type="button" onClick={() => removeNewSkill(newSkill)} className="ml-2 text-red-500">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" className="bg-teal-600 text-white p-2 rounded mt-4">
        Update Profile
      </button>
    </form>
    }
    </>
  );
};

export default EditProfile;
