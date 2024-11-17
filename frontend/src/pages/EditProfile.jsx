import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setMenteeData } from '../slices/menteeSlice';
import { setMentorData } from '../slices/mentorSlice';
import { useNavigate } from 'react-router';
import { CustomSpinner } from '../components/CustomSpinner';
import { setLoading } from '../slices/authSlice';

const EditProfile = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const role = useSelector((state) => state.auth.role);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  // Form state
  const [profilePicture, setProfilePicture] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [skills, setSkills] = useState([]); // Selected skills for mentee
  const [newSkills, setNewSkills] = useState([]); // New skills added by mentor
  const [skillsList, setSkillsList] = useState([]);
  const [skillInput, setSkillInput] = useState(''); // Input for new skills
  const [selectedSkill, setSelectedSkill] = useState(''); // Selected skill from dropdown for mentor

  useEffect(() => {
    const fetchSkillsList = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get(`${BACKEND_URL}/profile/getAllSkills`);
        setSkillsList(response.data.skills);
      } catch (error) {
        toast.error('Failed to fetch skills');
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchSkillsList();
  }, [dispatch]);

  // Profile picture change handler
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  // Add new skill (mentor only)
  const addNewSkill = () => {
    if (skillInput && !newSkills.includes(skillInput)) {
      setNewSkills([...newSkills, skillInput]);
      setSkillInput('');
    }
  };

  // Remove new skill
  const removeNewSkill = (skill) => {
    setNewSkills(newSkills.filter((s) => s !== skill));
  };

  // Add selected skill (mentee/mentor)
  const addSelectedSkill = () => {
    if (selectedSkill && !skills.includes(selectedSkill)) {
      setSkills([...skills, selectedSkill]);
      setSelectedSkill('');
    }
  };

  // Remove selected skill
  const removeSelectedSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
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
    formData.append('skills', combinedSkills);

    try {
      dispatch(setLoading(true));
      const response = await axios.put(`${BACKEND_URL}/profile/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.user;
      if (role === 'mentee') dispatch(setMenteeData(userData));
      else if (role === 'mentor') dispatch(setMentorData(userData));

      toast.success('Profile updated successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      {loading ? (
        <CustomSpinner />
      ) : (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded shadow-md max-w-lg mx-auto">
          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-4">
            <label className="w-32 h-32 mb-2 relative cursor-pointer">
              {profilePicture ? (
                <img src={URL.createObjectURL(profilePicture)} alt="Profile Preview" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-500">Add Photo</span>
                </div>
              )}
              <input type="file" onChange={handleProfilePictureChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4">
            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="p-2 border rounded" />
            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="p-2 border rounded" />
            <textarea placeholder="Bio" value={bio} onChange={(e) => setBio(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="p-2 border rounded" />
            <textarea placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} className="p-2 border rounded" />

            {/* Skills Section */}
            {role === 'mentee' ? (
              <div className="flex">
                <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="p-2 border rounded w-full">
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
            ) : (
              <div className="flex">
                <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="p-2 border rounded w-full">
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
            )}
            <div className="flex flex-wrap mt-2">
              {skills.map((skill, index) => (
                <span key={index} className="bg-teal-200 text-teal-800 px-3 py-1 rounded-full mr-2 mb-2 flex items-center">
                  {skill}
                  <button type="button" onClick={() => removeSelectedSkill(skill)} className="ml-2 text-red-500">x</button>
                </span>
              ))}
            </div>
            {role === 'mentor' && (
              <div className="mt-4">
                <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add New Skill" className="p-2 border rounded w-full" />
                <button type="button" onClick={addNewSkill} className="bg-teal-600 text-white px-4 rounded mt-2">Add New Skill</button>
                <div className="flex flex-wrap mt-2">
                  {newSkills.map((skill, index) => (
                    <span key={index} className="bg-teal-200 text-teal-800 px-3 py-1 rounded-full mr-2 mb-2 flex items-center">
                      {skill}
                      <button type="button" onClick={() => removeNewSkill(skill)} className="ml-2 text-red-500">x</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-teal-600 text-white p-2 mt-6 rounded">Save Changes</button>
        </form>
      )}
    </>
  );
};

export default EditProfile;
