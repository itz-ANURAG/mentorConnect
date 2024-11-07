import PostCard from '../components/MentorPostCard';
import PropTypes from 'prop-types';


const CommunityPostSection = ({select})=>{

   



    return (
        <div className="w-4/5 pl-6">
        <div className="border-b border-gray-300 pb-4 mb-6">
          <h2 className="text-2xl font-bold">Community Name</h2>
        </div>

        <div className="space-y-6">
          {select.map((post, index) => (
            <PostCard 
              key={index} 
              title={post.title} 
              content={post.content} 
              image={post.image} 
            />
          ))}
        </div>
      </div>
    )
}

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