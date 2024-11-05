/* eslint-disable no-unused-vars */
// CommunityCard.jsx
import React from 'react';

const CommunityCard = ({ name, onClick }) => {
  return (
    <button 
      onClick={onClick} 
      className="min-w-[150px] px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-200"
    >
      {name}
    </button>
  );
};

export default CommunityCard;
