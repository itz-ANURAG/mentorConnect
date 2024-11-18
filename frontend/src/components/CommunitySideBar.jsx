// export default  CommunitySidebar;
// CommunitySidebar.jsx
import CommunityShortcut from '../components/CommunityShortcut';
import PropTypes from 'prop-types';

const CommunitySidebar = ({ communities, onCommunitySelect }) => (
  <div className="w-1/4 flex flex-col border-r border-gray-300 p-4">
    <h3 className="text-lg font-semibold mb-4">Joined Communities</h3>
    <div className="overflow-y-auto max-h-[70vh] flex flex-col space-y-2">
      {communities.map((community, index) => (
        <div key={index} onClick={() => onCommunitySelect(community)}>
          <CommunityShortcut
            name={community.name}
            image={community.mentorProfilePicture}
            count={community.memberCount}
          />
        </div>
      ))}
    </div>
  </div>
);

CommunitySidebar.propTypes = {
  communities: PropTypes.arrayOf(
    PropTypes.shape({
      communityId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      mentorProfilePicture: PropTypes.string.isRequired,
      memberCount: PropTypes.number.isRequired,
    })
  ).isRequired,
  onCommunitySelect: PropTypes.func.isRequired,
};

export default CommunitySidebar;
