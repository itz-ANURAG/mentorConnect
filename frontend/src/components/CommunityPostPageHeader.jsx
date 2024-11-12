/* eslint-disable no-unused-vars */
// CommunityPostPageHeader.js
import React from 'react';
import PropTypes from 'prop-types';

const CommunityPostPageHeader = ({ select: { communityName, onRefresh, onCreatePost } }) => {
  console.log(communityName);
  return (
    <header className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300">
      <h1 className="text-2xl font-semibold text-gray-800">{communityName}</h1>
      <div className="flex space-x-4">
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        >
          Refresh
        </button>
        <button
          onClick={onCreatePost}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
        >
          Create Post
        </button>
      </div>
    </header>
  );
};

CommunityPostPageHeader.propTypes = {
  select: PropTypes.shape({
    communityName: PropTypes.string.isRequired,
    onRefresh: PropTypes.func.isRequired,
    onCreatePost: PropTypes.func.isRequired,
  }).isRequired,
};

export default CommunityPostPageHeader;
