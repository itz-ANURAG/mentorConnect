/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Navbar from './NavbarLandingPage'

const CreatePostGeneral = ({ closePopup }) => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const role = useSelector((state)=>state.auth.role)
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);
    

    const userId = role === 'mentee' ? useSelector((state)=>state.mentee.data._id || state.mentee.data.id) : useSelector((state)=>state.mentor.data._id)
    const username = role === 'mentee'? useSelector((state) => state.mentee.data.firstName + (state.mentee.data?.lastName||'')): useSelector((state) => (state.mentor.data?.name || ''));
    console.log("userId",userId)
    console.log("username",username)
    console.log("role",role)


    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const handlePostSubmit = async () => {
        const formData = new FormData();
        formData.append('role', role);
        formData.append('username', username);
        formData.append('userId', userId);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', image);
        formData.append('timestamp', new Date().toISOString());

        try {
            await axios.post(`${BACKEND_URL}/generalPost/create`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccessMessage(true);
            setTitle('');
            setContent('');
            setImage(null);
        } catch (error) {
            console.error("Error uploading post:", error);
        }
    };

    return (
        <>
        <Navbar/>
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
            {successMessage && (
                <div className="p-4 mb-4 bg-green-500 text-white rounded shadow-lg">
                    Post created successfully!
                </div>
            )}

            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter the title of your post"
                />
            </div>

            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700">Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="6"
                    className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Write the content of your post here..."
                />
            </div>

            <div className="mb-6">
                <label className="block text-lg font-medium text-gray-700">Upload Image</label>
                <input
                    type="file"
                    onChange={handleImageUpload}
                    className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {image && (
                    <div className="mt-4 relative">
                        <img
                            src={URL.createObjectURL(image)}
                            alt="Preview"
                            className="w-full h-40 object-cover rounded-lg border"
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 focus:outline-none"
                            aria-label="Remove image"
                        >
                            &minus;
                        </button>
                    </div>
                )}
            </div>

            <button
                onClick={handlePostSubmit}
                className="w-full p-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Submit Post
            </button>
        </div></>
    );
};

CreatePostGeneral.propTypes = {
    closePopup: PropTypes.func.isRequired,
};

export default CreatePostGeneral;
