/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const CreatePostCommunity = ({ closePopup }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(false);
    const community_id = useSelector((state) => state.mentor.data.community);

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleRemoveImage = () => {
        setImage(null);
    };

    const handlePostSubmit = async () => {
        const formData = new FormData();
        formData.append('community_id', community_id);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('image', image);
        formData.append('timestamp', new Date().toISOString());

        try {
            await axios.post('http://localhost:3000/community/communityPost', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccessMessage(true);
            setTitle('');
            setContent('');
            setImage(null);

            setTimeout(() => {
                setSuccessMessage(false);
                closePopup();
            }, 3000);
        } catch (error) {
            console.error("Error uploading post:", error);
        }
    };

    return (
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
        </div>
    );
};

CreatePostCommunity.propTypes = {
    closePopup: PropTypes.func.isRequired,
};

export default CreatePostCommunity;
