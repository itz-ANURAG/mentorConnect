
import React from 'react';
import PropTypes from 'prop-types';
import PostCard from './PostCard';

const CommunityPostSection = ({ posts }) => (
  <div className="flex justify-center w-full">
    <div className="space-y-10 w-full px-4">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          postId={post._id}
          title={post.title}
          content={post.content}
          image={post.imageUrl}
          initialLikes={post.likedMentees ? post.likedMentees.length : 0}
          initialDislikes={post.dislikedMentees ? post.dislikedMentees.length : 0}
        />
      ))}
    </div>
  </div>
);

CommunityPostSection.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      likedMentees: PropTypes.array.isRequired,
      dislikedMentees: PropTypes.array.isRequired,
    })
  ).isRequired,
};

export default CommunityPostSection;
