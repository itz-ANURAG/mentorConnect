// import { useState, useEffect } from 'react';
// import { Box, TextField, Checkbox, FormControlLabel, Button, Card, CardContent, Typography, Avatar, Grid } from '@mui/material';
// import axios from 'axios';
// import Navbar from '../components/NavbarLandingPage';
// import { NavLink } from 'react-router-dom';

// const MentorSearchPage = () => {
//   const [mentors, setMentors] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [page, setPage] = useState(1);
//   const [filters, setFilters] = useState({
//     skills: [],
//     jobTitles: [],
//     companies: [],
//   });
//   const [showMore, setShowMore] = useState({
//     skills: false,
//     jobTitles: false,
//     companies: false,
//   });
//   const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

//   // Fetch mentors from the backend
//   const fetchMentors = async () => {
//     try {
//       const { data } = await axios.get(`http://localhost:3000/mentors/search`, {
//         params: {
//           searchQuery,
//           skills: filters.skills.join(','),
//           jobTitle: filters.jobTitles.join(','),
//           company: filters.companies.join(','),
//           page,
//           limit: 9, // Show 9 cards per page
//         },
//       });
//       setMentors(data.mentors);
//       setPagination(data.pagination);
//     } catch (error) {
//       console.error('Error fetching mentors:', error);
//     }
//   };

//   useEffect(() => {
//     fetchMentors();
//   }, [searchQuery, filters, page]);

//   // Handle filters and show more toggling
//   const handleFilterChange = (category, value) => {
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [category]: prevFilters[category].includes(value)
//         ? prevFilters[category].filter((item) => item !== value)
//         : [...prevFilters[category], value],
//     }));
//   };

//   const toggleShowMore = (category) => {
//     setShowMore((prevShowMore) => ({
//       ...prevShowMore,
//       [category]: !prevShowMore[category],
//     }));
//   };

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ display: 'flex', padding: 2 }}>
//         <Box sx={{ width: '25%', paddingRight: 2 }}>
//           <TextField
//             fullWidth
//             variant="outlined"
//             label="Search for any skill, title, or company"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{ marginBottom: 3 }}
//           />

//           <Box>
//             <Typography variant="h6">Skills</Typography>
//             {['HTML', 'CSS', 'JavaScript', 'React'
// , 'Web Developer', 'MongoDB']
//               .slice(0, showMore.skills ? undefined : 3)
//               .map((skill) => (
//                 <FormControlLabel
//                   key={skill}
//                   control={<Checkbox checked={filters.skills.includes(skill)} onChange={() => handleFilterChange('skills', skill)} />}
//                   label={skill}
//                 />
//               ))}
//             <Button onClick={() => toggleShowMore('skills')}>{showMore.skills ? 'Show Less' : 'Show More'}</Button>
//           </Box>

//           <Box sx={{ marginTop: 2 }}>
//             <Typography variant="h6">Job Titles</Typography>
//             {['Software Engineer', 'Data Scientist', 'Product Manager', 'Designer']
//               .slice(0, showMore.jobTitles ? undefined : 3)
//               .map((title) => (
//                 <FormControlLabel
//                   key={title}
//                   control={<Checkbox checked={filters.jobTitles.includes(title)} onChange={() => handleFilterChange('jobTitles', title)} />}
//                   label={title}
//                 />
//               ))}
//             <Button onClick={() => toggleShowMore('jobTitles')}>{showMore.jobTitles ? 'Show Less' : 'Show More'}</Button>
//           </Box>

//           <Box sx={{ marginTop: 2 }}>
//             <Typography variant="h6">Companies</Typography>
//             {['Google', 'Microsoft', 'Goldman Sachs', 'Oracle', 'VISA', 'Arista']
//               .slice(0, showMore.companies ? undefined : 3)
//               .map((company) => (
//                 <FormControlLabel
//                   key={company}
//                   control={<Checkbox checked={filters.companies.includes(company)} onChange={() => handleFilterChange('companies', company)} />}
//                   label={company}
//                 />
//               ))}
//             <Button onClick={() => toggleShowMore('companies')}>{showMore.companies ? 'Show Less' : 'Show More'}</Button>
//           </Box>
//         </Box>

//         <Box sx={{ width: '75%' }}>
//           <Grid container spacing={3}>
//             {mentors.map((mentor) => (
//               <Grid item xs={4} key={mentor._id}>
//                 <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 2 }}>
//                   <CardContent>
//                     <Avatar src={mentor.profilePicture} alt={mentor.name} sx={{ width: 64, height: 64, marginBottom: 2 }} />
//                     <Typography variant="h6">{mentor.name}</Typography>
//                     <Typography variant="body2">{mentor.jobTitle} at {mentor.company}</Typography>
//                     {/* <Typography variant="caption" color="text.secondary">{mentor.skills.join(', ')}</Typography> */}
//                   </CardContent>
//                   <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 1 }}>
//                     <NavLink to={`/mentors/${mentor._id}`}>
//                         <Button variant="contained" size="small" sx={{ mt: 1 }}>
//                         Get Details
//                         </Button>
//                     </NavLink>
//                   </Box>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>

//           <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, marginTop: 3 }}>
//             <Button
//               variant="contained"
//               onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
//               disabled={pagination.currentPage <= 1}
//               sx={{ marginRight: 2 }}
//             >
//               Previous
//             </Button>
//             <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
//               Page {pagination.currentPage} of {pagination.totalPages}
//             </Typography>
//             <Button
//               variant="contained"
//               onClick={() => setPage((prevPage) => prevPage + 1)}
//               disabled={pagination.currentPage >= pagination.totalPages}
//               sx={{ marginLeft: 2 }}
//             >
//               Next
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default MentorSearchPage;
import { useState, useEffect } from 'react';
import { Box, TextField, Checkbox, FormControlLabel, Button, Card, CardContent, Typography, Avatar, Grid } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff'; // Icon for "no results" message
import axios from 'axios';
import Navbar from '../components/NavbarLandingPage';
import { NavLink } from 'react-router-dom';

const MentorSearchPage = () => {
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [skillsList, setSkillsList] = useState([]);
  const [filters, setFilters] = useState({
    skills: [],
    jobTitles: [],
    companies: [],
  });
  const [showMore, setShowMore] = useState({
    skills: false,
    jobTitles: false,
    companies: false,
  });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });

  // Fetch skills list from backend
  useEffect(() => {
    const fetchSkillsList = async () => {
      try {
        const response = await axios.get('http://localhost:3000/profile/getAllSkills');
        setSkillsList(response.data.skills || []);
      } catch (error) {
        console.error('Error fetching skills list:', error);
      }
    };
    fetchSkillsList();
  }, []);

  // Fetch mentors from the backend
  const fetchMentors = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/mentors/search`, {
        params: {
          searchQuery,
          skills: filters.skills.join(','),
          jobTitle: filters.jobTitles.join(','),
          company: filters.companies.join(','),
          page,
          limit: 9,
        },
      });
      setMentors(data.mentors);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, [searchQuery, filters, page]);

  // Handle filters and show more toggling
  const handleFilterChange = (category, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value],
    }));
  };

  const toggleShowMore = (category) => {
    setShowMore((prevShowMore) => ({
      ...prevShowMore,
      [category]: !prevShowMore[category],
    }));
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', padding: 2 }}>
        <Box sx={{ width: '25%', paddingRight: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search for any skill, title, or company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginBottom: 3 }}
          />

          <Box>
            <Typography variant="h6">Skills</Typography>
            {skillsList.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No skills available
              </Typography>
            ) : (
              skillsList.slice(0, showMore.skills ? undefined : 3).map((skill) => (
                <FormControlLabel
                  key={skill}
                  control={
                    <Checkbox
                      checked={filters.skills.includes(skill)}
                      onChange={() => handleFilterChange('skills', skill)}
                    />
                  }
                  label={skill}
                />
              ))
            )}
            {skillsList.length > 3 && (
              <Button onClick={() => toggleShowMore('skills')}>
                {showMore.skills ? 'Show Less' : 'Show More'}
              </Button>
            )}
          </Box>

          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Job Titles</Typography>
            {['Software Engineer', 'Data Scientist', 'Product Manager', 'Designer']
              .slice(0, showMore.jobTitles ? undefined : 3)
              .map((title) => (
                <FormControlLabel
                  key={title}
                  control={<Checkbox checked={filters.jobTitles.includes(title)} onChange={() => handleFilterChange('jobTitles', title)} />}
                  label={title}
                />
              ))}
            <Button onClick={() => toggleShowMore('jobTitles')}>{showMore.jobTitles ? 'Show Less' : 'Show More'}</Button>
          </Box>

          <Box sx={{ marginTop: 2 }}>
            <Typography variant="h6">Companies</Typography>
            {['Google', 'Microsoft', 'Goldman Sachs', 'Oracle', 'VISA', 'Arista']
              .slice(0, showMore.companies ? undefined : 3)
              .map((company) => (
                <FormControlLabel
                  key={company}
                  control={<Checkbox checked={filters.companies.includes(company)} onChange={() => handleFilterChange('companies', company)} />}
                  label={company}
                />
              ))}
            <Button onClick={() => toggleShowMore('companies')}>{showMore.companies ? 'Show Less' : 'Show More'}</Button>
          </Box>
        </Box>

        <Box sx={{ width: '75%' }}>
          {mentors.length === 0 ? (
            <Box sx={{ textAlign: 'center', padding: 5 }}>
              <SearchOffIcon sx={{ fontSize: 80, color: 'grey.500', marginBottom: 2 }} />
              <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                No Mentors Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your filters or search term to find the right mentor for you.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {mentors.map((mentor) => (
                <Grid item xs={4} key={mentor._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 2 }}>
                    <CardContent>
                      <Avatar src={mentor.profilePicture} alt={mentor.name} sx={{ width: 64, height: 64, marginBottom: 2 }} />
                      <Typography variant="h6">{mentor.name}</Typography>
                      <Typography variant="body2">{mentor.jobTitle} at {mentor.company}</Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: 1 }}>
                      <NavLink to={`/mentors/${mentor._id}`}>
                        <Button variant="contained" size="small" sx={{ mt: 1 }}>
                          Get Details
                        </Button>
                      </NavLink>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2, marginTop: 3 }}>
            <Button
              variant="contained"
              onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
              disabled={pagination.currentPage <= 1}
              sx={{ marginRight: 2 }}
            >
              Previous
            </Button>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setPage((prevPage) => prevPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
              sx={{ marginLeft: 2 }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MentorSearchPage;
