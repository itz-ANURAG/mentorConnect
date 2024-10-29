
// import React, { useState, useEffect } from 'react';
// import { Avatar, Chip, Card, CardContent, Typography, IconButton, Button, Tooltip } from '@mui/material';
// import { LocationOn, Star, CheckCircle, AccessTime, Phone, Group } from '@mui/icons-material';
// import Navbar from "../components/NavbarLandingPage";
// import Footer from "../components/footer";
// import Testimonial from './Testimonial';
// import { NavLink, useParams } from 'react-router-dom';
// import axios from 'axios';

// const Dashboard = () => {
//   const [tooltipOpen, setTooltipOpen] = useState(false);
//   const [showMore, setShowMore] = useState(false);
//   const { id } = useParams();
//   const [mentor, setMentor] = useState(null);
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state

//   useEffect(() => {
//     const fetchMentor = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/mentors/${id}`);
//         console.log(response.data);
//         console.log(response.data.mentor)
//         setMentor(response.data.mentor);
//       } catch (error) {
//         console.error("Error fetching mentor details:", error);
//         setError("Error fetching mentor details"); // Set error message
//       } finally {
//         setLoading(false); // Set loading to false after fetch
//       }
//     };

//     fetchMentor();
//   }, [id]);

//   // Handle loading state
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>; // Display error if it exists

//   // Handle mentor data
//   if (!mentor) return <p>No Mentor Found.....</p>;

//   // Skills array with fallback
//   const allSkills = mentor.skills && mentor.skills.length > 0 
//     ? mentor.skills 
//     : [
//         'React', 'Node.js', 'JavaScript', 'HTML/CSS', 'MongoDB', 
//         'Express.js', 'Tailwind CSS', 'Material UI', 'TypeScript', 
//         'GraphQL', 'Redux', 'Next.js'
//       ];

//   // Function to handle tooltip toggle
//   const handleTooltipOpen = () => {
//     setTooltipOpen(!tooltipOpen);
//   };

//   const handleTooltipClose = () => {
//     setTooltipOpen(false);
//   };

//   const skillsToShow = showMore ? allSkills : allSkills.slice(0, 6);

//   return (
//     <>
//       <Navbar />
//       <div className="w-full h-screen p-4">
//         {/* Upper Rectangle (Dark Blue) */}
//         <div className="bg-blue-900 h-1/3 relative flex items-end">
//           {/* Profile Picture */}
//           <div className="absolute left-4 -bottom-12">
//             <Avatar
//               alt={mentor.name}
//               src={mentor.profilePicture}
//               className="w-40 h-40 border-4 border-white"
//               sx={{ width: 160, height: 160 }}
//             />
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="bg-white flex justify-between px-4 pt-16">
//           {/* Middle: Description and Session Section */}
//           <div className="flex-grow pr-6">
//             {/* Description */}
//             <div className="text-left">
//               <h1 className="text-2xl font-bold text-gray-800">{mentor.name}</h1>
//               <p className="text-gray-600">{`${mentor.jobTitle} @ ${mentor.company}`}</p>

//               {/* Location */}
//               <div className="flex items-center mt-1 text-gray-500">
//                 <LocationOn fontSize="small" />
//                 <span className="ml-2">{mentor.location}</span>
//               </div>

//             {/* Reviews */}
//             <div className="flex items-center mt-1 text-gray-500">
//               <Star fontSize="small" className="text-yellow-500" />
//               <span className="ml-2">
//                 {mentor.ratings} ({mentor.reviews_cnt} reviews)
//               </span>
//             </div>

//               {/* Active this month */}
//               <div className="flex items-center mt-1 text-gray-500">
//                 <CheckCircle fontSize="small" className="text-green-500" />
//                 <span className="ml-2">Active this month</span>
//               </div>

//               {/* Usually responds in with clickable tooltip */}
//               <div className="flex items-center mt-1 text-gray-500">
//                 <AccessTime fontSize="small" />
//                 <Tooltip
//                   title="Definition: Typically responds in half a day."
//                   arrow
//                   open={tooltipOpen}
//                   onClose={handleTooltipClose}
//                 >
//                   <span
//                     className="ml-2 cursor-pointer text-blue-500 underline"
//                     onClick={handleTooltipOpen}
//                   >
//                     Usually responds in half a day
//                   </span>
//                 </Tooltip>
//               </div>
//             </div>

//             {/* Session Card */}
//             <Card className="mt-6 w-full" sx={{ maxWidth: 400 }}>
//               <CardContent>
//                 <Typography variant="h6" component="div" className="text-gray-800 font-semibold">
//                   Session
//                 </Typography>
//                 <div className="flex flex-col gap-4 mt-4">
//                   {/* Book a Call */}
//                   <div className="flex items-center gap-2">
//                     <IconButton color="primary">
//                       <Phone />
//                     </IconButton>
//                     <NavLink to={`mentors/${id}/`}>
//                       <Button variant="outlined" color="primary">
//                         Book a Call
//                       </Button>
//                     </NavLink>
//                   </div>
//                   {/* Join Community */}
//                   <div className="flex items-center gap-2">
//                     <IconButton color="primary">
//                       <Group />
//                     </IconButton>
//                     <Button variant="outlined" color="primary">
//                       Join Community
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right: Skills Section */}
//           <div className="ml-4 w-1/3">
//             <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
//             <div className="flex flex-wrap gap-1 mt-2">
//               {skillsToShow.map((skill, index) => (
//                 <Chip key={index} label={skill} color="primary" />
//               ))}
//             </div>

//             {/* Show more/less toggle */}
//             <div className="mt-2">
//               <a
//                 href="#"
//                 className="text-blue-500 cursor-pointer"
//                 onClick={() => setShowMore(!showMore)}
//               >
//                 {showMore ? 'Show Less' : 'Show More'}
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-center min-h-screen items-center py-3 px-2">
//         <div className="bg-slate flex flex-col items-center justify-center drop-shadow-lg rounded-lg max-w w-full p-20">
//           <div className="w-full">
//             <h2 className=" text-lg lg:text-4xl font-bold text-start mb-4">
//               About
//             </h2>
//             <p className="text-justify text-gray-700 text-xl">
//               {mentor.bio}
//             </p>
//           </div>
//         </div>
//       </div>
//       <Testimonial reviews={mentor.reviews} />
//       <Footer />
//     </>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from 'react';
import { Avatar, Chip, Card, CardContent, Typography, IconButton, Button, Tooltip } from '@mui/material';
import { LocationOn, Star, CheckCircle, AccessTime, Phone, Group } from '@mui/icons-material';
import Navbar from "../components/NavbarLandingPage";
import Footer from "../components/footer";
import Testimonial from './Testimonial';
import { NavLink, useParams, Outlet } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/mentors/${id}`);
        setMentor(response.data.mentor);
      } catch (error) {
        console.error("Error fetching mentor details:", error);
        setError("Error fetching mentor details");
      } finally {
        setLoading(false);
      }
    };

    fetchMentor();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!mentor) return <p>No Mentor Found.....</p>;

  const allSkills = mentor.skills && mentor.skills.length > 0 
    ? mentor.skills 
    : [
        'React', 'Node.js', 'JavaScript', 'HTML/CSS', 'MongoDB', 
        'Express.js', 'Tailwind CSS', 'Material UI', 'TypeScript', 
        'GraphQL', 'Redux', 'Next.js'
      ];

  const handleTooltipOpen = () => {
    setTooltipOpen(!tooltipOpen);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const skillsToShow = showMore ? allSkills : allSkills.slice(0, 6);

  return (
    <>
      <div className="w-full h-screen p-4">
        <div className="bg-blue-900 h-1/3 relative flex items-end">
          <div className="absolute left-4 -bottom-12">
            <Avatar
              alt={mentor.name}
              src={mentor.profilePicture}
              className="w-40 h-40 border-4 border-white"
              sx={{ width: 160, height: 160 }}
            />
          </div>
        </div>

        <div className="bg-white flex justify-between px-4 pt-16">
          <div className="flex-grow pr-6">
            <div className="text-left">
              <h1 className="text-2xl font-bold text-gray-800">{mentor.name}</h1>
              <p className="text-gray-600">{`${mentor.jobTitle} @ ${mentor.company}`}</p>

              <div className="flex items-center mt-1 text-gray-500">
                <LocationOn fontSize="small" />
                <span className="ml-2">{mentor.location}</span>
              </div>

              <div className="flex items-center mt-1 text-gray-500">
                <Star fontSize="small" className="text-yellow-500" />
                <span className="ml-2">
                  {mentor.ratings} ({mentor.reviews_cnt} reviews)
                </span>
              </div>

              <div className="flex items-center mt-1 text-gray-500">
                <CheckCircle fontSize="small" className="text-green-500" />
                <span className="ml-2">Active this month</span>
              </div>

              <div className="flex items-center mt-1 text-gray-500">
                <AccessTime fontSize="small" />
                <Tooltip
                  title="Definition: Typically responds in half a day."
                  arrow
                  open={tooltipOpen}
                  onClose={handleTooltipClose}
                >
                  <span
                    className="ml-2 cursor-pointer text-blue-500 underline"
                    onClick={handleTooltipOpen}
                  >
                    Usually responds in half a day
                  </span>
                </Tooltip>
              </div>
            </div>

            <Card className="mt-6 w-full" sx={{ maxWidth: 400 }}>
              <CardContent>
                <Typography variant="h6" component="div" className="text-gray-800 font-semibold">
                  Session
                </Typography>
                <div className="flex flex-col gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <IconButton color="primary">
                      <Phone />
                    </IconButton>
                    <NavLink to={`/mentors/${id}/slots`}>
  <Button variant="outlined" color="primary">
    Book a Call
  </Button>
</NavLink>

                  </div>
                  <div className="flex items-center gap-2">
                    <IconButton color="primary">
                      <Group />
                    </IconButton>
                    <Button variant="outlined" color="primary">
                      Join Community
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="ml-4 w-1/3">
            <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
            <div className="flex flex-wrap gap-1 mt-2">
              {skillsToShow.map((skill, index) => (
                <Chip key={index} label={skill} color="primary" />
              ))}
            </div>

            <div className="mt-2">
              <a
                href="#"
                className="text-blue-500 cursor-pointer"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show Less' : 'Show More'}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center min-h-screen items-center py-3 px-2">
        <div className="bg-slate flex flex-col items-center justify-center drop-shadow-lg rounded-lg max-w w-full p-20">
          <div className="w-full">
            <h2 className=" text-lg lg:text-4xl font-bold text-start mb-4">
              About
            </h2>
            <p className="text-justify text-gray-700 text-xl">
              {mentor.bio}
            </p>
          </div>
        </div>
      </div>
      <Testimonial reviews={mentor.reviews} />
    </>
  );
};

export default Dashboard;

