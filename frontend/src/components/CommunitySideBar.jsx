import CommunityShortcut from '../components/CommunityShortcut';
import PropTypes from 'prop-types';



const CommunitySidebar= ({select}) =>{
    return (
        <div className="w-1/4 flex flex-col border-r border-gray-300 p-4">
        <h3 className="text-lg font-semibold mb-4">Joined Communities</h3>
            <div className="overflow-y-auto max-h-[70vh] flex flex-col space-y-2">
                {select.map((community, index) => (
                <CommunityShortcut 
                    key={index} 
                    name={community.name} 
                    image={community.image}
                    count ={community.count}
                    
                />
                ))}
            </div>
        </div>
    )
}

CommunitySidebar.propTypes = {
    select: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        count: PropTypes.string.isRequired,
      })
    ).isRequired,
  };






export default  CommunitySidebar;