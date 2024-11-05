/* eslint-disable no-unused-vars */
// PostCard.jsx
import React from 'react';

const PostCard = ({ title, content, image }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 bg-gray-50 shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{content}</p>
      {image && (
        <img src={image} alt="Post" className="w-full h-40 object-cover rounded-md" />
      )}
    </div>
  );
};

export default PostCard;
