import React, { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import Nouser from '../assets/Nouser.png'; 
import  Navbar  from '../components/Navbar';
import  Footer  from '../components/footer';


function UserUpProfile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [goal, setGoal] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // Perform the upload logic here, e.g., send the file to an API
    console.log('Uploading file:', selectedFile);
  };


  return (
    <>
    <Navbar/>
    <div className="container mx-auto p-4">


      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">


 <div> 
      <label htmlFor="file-upload" className="cursor-pointer">
      <img src={Nouser} alt="nouser" width={100} height={100} className='rounded-full' />
    <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

<div className="flex items-center mb-10">
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex items-center space-x-2">
          <FaUpload className="text-gray-500 text-lg" />
          <span className="text-sm text-gray-600">Upload File</span>
        </div>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {selectedFile && (
        <div className="mt-2 text-sm text-gray-700">
          Selected file: {selectedFile.name}
        </div>
      )}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
        onClick={handleUpload}
        disabled={!selectedFile}
      >
        Upload
      </button>
    </div>
    </div>


        
        <div className="flex justify-between mb-4">
          <div className="w-1/2 mr-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="w-1/2 ml-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        
        <div className='flex justify-between mb-4'>

 <div className="w-1/2 mr-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkedin">
            LinkedIn
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="linkedin"
            type="url"
            placeholder="LinkedIn Profile URL"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
          />
        </div>

         <div className="w-1/2 mr-2">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="twitter">
            Twitter
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="twitter"
            type="url"
            placeholder="Twitter Profile URL"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">
            Job Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="jobTitle"
            type="text"
            placeholder="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="goal">
            Your Goal
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="goal"
            placeholder="Your professional goals..."
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>

        {/* <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Save Profile
          </button>
        </div> */}
      <h1 className="text-3xl font-bold mb-6">Change your password</h1>

      {/* <form onSubmit={handleSubmit} className="w-full max-w-md"> */}
        <div className="mb-4">
          <label htmlFor="oldPassword" className="block text-gray-700 text-sm font-bold mb-2">
            Old password
          </label>
          <input 
            type="password" 
            id="oldPassword" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
          />
        </div>

        <div className="mb-4">
          <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
            New password
          </label>
          <input 
            type="password" 
            id="newPassword" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />
        </div>
        <ul className="list-disc text-gray-600 ml-10">
        <li>Your password can't be too similar to your other personal information.</li>
        <li>Your password must contain at least 8 characters.</li>
        <li>Your password can't be a commonly used password.</li>
        <li>Your password can't be entirely numeric.</li>
      </ul>

        <div className="mb-6 mt-5">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
            New password confirmation
          </label>
          <input 
            type="password" 
            id="confirmPassword" 
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save changes
        </button>
      {/* </form> */}
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default UserUpProfile;