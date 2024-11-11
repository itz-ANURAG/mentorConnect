
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const PostCard = ({ postId, title, content, image, initialLikes, initialDislikes }) => {
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [dislikeCount, setDislikeCount] = useState(initialDislikes);
  const token = useSelector((state) => state.auth.token);

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/communityPost/${postId}/like`,
        {},  // No body data, so pass an empty object
        { headers: { Authorization: `Bearer ${token}` } } // Headers moved outside
      );
      setLikeCount(response.data.likeCount);
      setDislikeCount(response.data.dislikeCount);
      toast.success("Post liked");
    } catch (error) {
      console.error("Error liking the post", error);
      toast.error(error.message);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/communityPost/${postId}/dislike`,
        {},  // No body data, so pass an empty object
        { headers: { Authorization: `Bearer ${token}` } } // Headers moved outside
      );
      setLikeCount(response.data.likeCount);
      setDislikeCount(response.data.dislikeCount);
      toast.success("Post disliked");
    } catch (error) {
      console.error("Error disliking the post", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <img src={image} alt="Post" className="w-full h-40 object-cover rounded-t-lg" />
      <div className="mt-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2">{content}</p>
        <div className="flex items-center mt-4 space-x-4">
          <button onClick={handleLike} className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
            <FaThumbsUp /> <span>{likeCount}</span>
          </button>
          <button onClick={handleDislike} className="flex items-center space-x-1 text-gray-600 hover:text-red-600">
            <FaThumbsDown /> <span>{dislikeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  postId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  initialLikes: PropTypes.number,
  initialDislikes: PropTypes.number,
};

PostCard.defaultProps = {
  initialLikes: 0,
  initialDislikes: 0,
};

export default PostCard;
