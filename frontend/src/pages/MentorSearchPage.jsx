import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  
  FormControlLabel,
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import SearchOffIcon from "@mui/icons-material/SearchOff"; // Icon for "no results" message
import axios from "axios";
import Navbar from "../components/NavbarLandingPage";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../slices/authSlice";
import { CustomSpinner } from "../components/CustomSpinner";
import '../stylesheets/MentorCard.css'
import styled from 'styled-components';
import Checkbox from '../components/Checkbox';



const MentorSearchPage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const [expanded, setExpanded] = useState(false);
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
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  // Fetch skills list from backend
  useEffect(() => {
    const fetchSkillsList = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          `${BACKEND_URL}/profile/getAllSkills`
        );
        setSkillsList(response.data.skills || []);
      } catch (error) {
        console.error("Error fetching skills list:", error);
      }
      dispatch(setLoading(false));
    };
    fetchSkillsList();
  }, []);

  // Fetch mentors from the backend
  const fetchMentors = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await axios.get(`${BACKEND_URL}/mentors/search`, {
        params: {
          searchQuery,
          skills: filters.skills.join(","),
          jobTitle: filters.jobTitles.join(","),
          company: filters.companies.join(","),
          page,
          limit: 9,
        },
      });
      setMentors(data.mentors);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching mentors:", error);
    }
    dispatch(setLoading(false));
  };

  // Load mentors when the component mounts
  useEffect(() => {
    fetchMentors();
  }, []);

  // Handle search when Search button is clicked
  const handleSearch = () => {
    setPage(1); // Reset to the first page
    fetchMentors();
  };

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

  const handleFocus = () => {
    if (!expanded) {
      setExpanded(true);
    }
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };


  const handleIconClick = () => {
    
      handleSearch(); // Trigger search on clicking icon if there is a query
    
  };

  return (
    <>
      {loading ? (
        <CustomSpinner />
      ) : (
        <>
          <Navbar />
          <Box sx={{ display: "flex", padding: 2 }}>
            <Box sx={{ width: "25%", paddingRight: 2 }}>
            
            <StyledWrapper>
      <div className="input-container">
      <input
          placeholder="Search for any skill, title, or company"
          className="input"
          value={searchQuery}
          onChange={handleChange}
          onFocus={handleFocus}
          type="text"
        />
        <span className="icon"> 
          <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"       onClick={handleIconClick}  ><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path opacity={1} d="M14 5H20" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> <path opacity={1} d="M14 8H17" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> <path opacity={1} d="M22 22L20 20" stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /> </g></svg>
        </span>
      </div>
    </StyledWrapper>

         
              {/* Skills filter */}
              <Box >
      <Typography variant="h6">Skills</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {skillsList.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No skills available
        </Typography>
      ) : (
        skillsList
          .slice(0, showMore.skills ? undefined : 3)
          .map((skill) => (
            <div className="flex flex-col">
            <Checkbox
            
              key={skill}
              checked={filters.skills.includes(skill)}
              onChange={() => handleFilterChange("skills", skill)}
              label={skill} // pass skill name as label
            />
            </div>
          ))
      )}
      </Box>
      {skillsList.length > 3 && (
        <Button onClick={() => toggleShowMore("skills")}>
          {showMore.skills ? "Show Less" : "Show More"}
        </Button>
      )}
    </Box>

              {/* Job Titles filter */}
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6">Job Titles</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[
                  "Software Engineer",
                  "Data Scientist",
                  "Product Manager",
                  "Designer",
                ]
                  .slice(0, showMore.jobTitles ? undefined : 3)
                  .map((title) => (
                    


                    <Checkbox
            
                    key={title}
                    checked={filters.jobTitles.includes(title)}
                    onChange={() =>
                      handleFilterChange("jobTitles", title)
                    }
                    label={title} // pass skill name as label
            />
                  ))}
                  </Box>
                <Button onClick={() => toggleShowMore("jobTitles")}>
                  {showMore.jobTitles ? "Show Less" : "Show More"}
                </Button>
              </Box>

              {/* Companies filter */}
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6">Companies</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[
                  "Google",
                  "Microsoft",
                  "Goldman Sachs",
                  "Oracle",
                  "VISA",
                  "Arista",
                ]
                
                  .slice(0, showMore.companies ? undefined : 3)
                  .map((company) => (
                    
                    <Checkbox
            
                    key={company}
                    checked={filters.companies.includes(company)}
                    onChange={() =>
                      handleFilterChange("companies", company)
                    }
                    label={company} // pass skill name as label
            />


                  ))}
                  </Box>
                <Button onClick={() => toggleShowMore("companies")}>
                  {showMore.companies ? "Show Less" : "Show More"}
                </Button>
              </Box>
            </Box>

            {/* Mentor list and pagination */}
            <Box sx={{ width: "75%" }}>
              {mentors.length === 0 ? (
                <Box sx={{ textAlign: "center", padding: 5 }}>
                  <SearchOffIcon
                    sx={{ fontSize: 80, color: "grey.500", marginBottom: 2 }}
                  />
                  <Typography
                    variant="h5"
                    color="text.secondary"
                    sx={{ fontWeight: "bold", marginBottom: 1 }}
                  >
                    No Mentors Found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try adjusting your filters or search term to find the right
                    mentor for you.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {mentors.map((mentor) => (
                    <Grid item xs={4} key={mentor._id}>
<StyledWrapper>
      <article className="card">
        <section className="card__hero" style={{ backgroundImage: `url(${mentor.profilePicture})` }}>
          <div className="card__name-wrapper">
            <Typography variant="h6" className="card__name">{mentor.name}</Typography>
          </div>
        </section>
        <footer className="card__footer">
          <div className="card__footer-left">
            <Typography variant="body2" className="card__job-title">
              {mentor.jobTitle} at {mentor.company}
            </Typography>
          </div>
          <div className="card__footer-right">
            <NavLink to={`/mentors/${mentor._id}`}>
              <button className="card__btn">Get Details</button>
            </NavLink>
          </div>
        </footer>
      </article>
    </StyledWrapper>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Pagination controls */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 2,
                  marginTop: 3,
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => setPage((prevPage) => prevPage - 1)}
                  disabled={pagination.currentPage === 1}
                  sx={{ marginRight: 2 }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setPage((prevPage) => prevPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};
const StyledWrapper = styled.div`
  .card {
    margin: auto;
    width: min(300px, 100%);
    background-color: #fefefe;
    border-radius: 1rem;
    padding: 0.5rem;
    color: #141417;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    border: 1px solid #e0e0e0; /* Light border */
  }
  .card__hero {
    height: 250px; /* Increased height to take more of the image into account */
    background-size: cover;
    background-position: center;
    border-radius: 0.5rem 0.5rem 0 0;
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    padding: 1rem;
  }
  .card__name-wrapper {
    position: absolute;
    bottom: 0; /* Position directly at the bottom */
    left: 0; /* Position to the left */
    background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
    width: 100%; /* Extend the width to the full bottom of the card */
    padding: 0.4rem 1rem; /* Slight padding inside */
    box-sizing: border-box; /* Ensure the padding is included in width calculation */
    border-radius: 0; /* Remove rounded corners for a sharp rectangle */
  }
  .card__name {
    color: #fff;
    font-weight: bold;
    text-align: left;
    margin: 0; /* Remove margin for the text */
  }
  .card__footer {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
  }
  .card__footer-left {
    flex: 1;
  }
  .card__job-title {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  .card__footer-right {
    display: flex;
    align-items: center;
    margin-left: 1rem;
  }
  .card__btn {
    font-weight: 400;
    border: none;
    cursor: pointer;
    padding: 0.5rem 1.25rem;
    border-radius: 1rem;
    background-color: #141417;
    color: #fff;
  }



  .input-container {
    width: 20rem;
    position: relative;
  }

  .icon {
    position: absolute;
    right: 10px;
    top: calc(50% + 5px);
    transform: translateY(calc(-50% - 5px));
  }

  .input {
    width: 100%;
    height: 40px;
    padding: 10px;
    transition: .2s linear;
    border: 2.5px solid black;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .input:focus {
    outline: none;
    border: 0.5px solid black;
    box-shadow: -5px -5px 0px black;
  }

  .input-container:hover > .icon {
    animation: anim 1s linear infinite;
  }

  @keyframes anim {
    0%,
    100% {
      transform: translateY(calc(-50% - 5px)) scale(1);
    }

    50% {
      transform: translateY(calc(-50% - 5px)) scale(1.1);
    }
  }
`;
export default MentorSearchPage;
