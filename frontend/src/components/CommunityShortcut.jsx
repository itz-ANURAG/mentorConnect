
import React from 'react';
import PropTypes from 'prop-types';

const CommunityShortcut = ({ name, image, count }) => (
  <div className="flex items-center space-x-4 min-w-4 min-h-5">
    <img src={image} alt="Community" className="w-20 h-20 object-cover rounded-full" />
    <div>
      <h3 className="font-bold text-lg">{name}</h3>
      <span>Members: {count}</span>
    </div>
  </div>
);

CommunityShortcut.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

export default CommunityShortcut;

