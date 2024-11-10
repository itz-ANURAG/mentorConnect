import PostCard from '../components/MentorPostCard';
import PropTypes from 'prop-types';

const CommunityPostSection = ({ select }) => {
  return (
    <div className="flex justify-center">
      <div className="space-y-10 w-4/5">
        {select.map((post, index) => (
          <PostCard 
            key={index} 
            title={post.title} 
            content={post.content} 
            image={post.imageUrl} 
          />
        ))}
      </div>
    </div>
  );
};

CommunityPostSection.propTypes = {
  select: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CommunityPostSection;
