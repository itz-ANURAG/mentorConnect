/* eslint-disable no-unused-vars */
// PostCard.jsx
import React from 'react';

const PostCard = ({ title, content, image }) => {
  return (
    <div className="max-w-4xl mx-auto border border-gray-200 rounded-lg p-6 bg-white shadow-lg">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-700 mb-6 leading-relaxed">{content}</p>
      {image && (
        <div className="mb-4">
          <img
            src={image}
            alt="Post"
            className="w-full h-64 object-cover rounded-lg shadow-sm"
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;
