import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Grid,
} from "@mui/material";
import NavbarLandingPage from "../components/NavbarLandingPage";
import axios from "axios";
import { setLoading } from "../slices/authSlice";
import { CustomSpinner } from "../components/CustomSpinner";

const MentorSearchPage = () => {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const [mentors, setMentors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    leadership: false,
    productManagement: false,
    startup: false,
  });

  // Fetch mentor data from the API
  useEffect(() => {
    const fetchMentors = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios(`http://localhost:3000/search/mentors`, {
          method: "GET",
        });
        dispatch(setLoading(false));

        console.log(response); // Assuming backend API is set up
        const mentorData = response.data;

        // Filter mentors based on search query and filters
        const filteredMentors = mentorData.filter((mentor) => {
          const matchesSearch =
            mentor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mentor.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesFilters =
            (!filters.leadership || mentor.skills.includes("Leadership")) &&
            (!filters.productManagement ||
              mentor.skills.includes("Product Management")) &&
            (!filters.startup || mentor.skills.includes("Startup"));
          return matchesSearch && matchesFilters;
        });

        setMentors(filteredMentors);
      } catch (error) {
        console.error("Error fetching mentors:", error);
      }
    };

    fetchMentors();
  }, [searchQuery, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.checked });
  };

  return (
    <>
      {loading ? (
        <CustomSpinner />
      ) : (
        <Box>
          {/* Navbar */}
          <NavbarLandingPage />

          {/* Main Content */}
          <Box sx={{ display: "flex", marginTop: "5vh" }}>
            {/* Filters Section */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box
                sx={{ marginRight: "1rem", marginLeft: "3rem", width: "30vh" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="h6">Skills</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.leadership}
                          onChange={handleFilterChange}
                          name="leadership"
                        />
                      }
                      label="Leadership"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.productManagement}
                          onChange={handleFilterChange}
                          name="productManagement"
                        />
                      }
                      label="Product Management"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.startup}
                          onChange={handleFilterChange}
                          name="startup"
                        />
                      }
                      label="Startup"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.leadership}
                          onChange={handleFilterChange}
                          name="entreprenuer"
                        />
                      }
                      label="Entreprenuer"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.productManagement}
                          onChange={handleFilterChange}
                          name="web"
                        />
                      }
                      label="Web Developer"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.startup}
                          onChange={handleFilterChange}
                          name="android"
                        />
                      }
                      label="Android Developer"
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box
                sx={{
                  marginRight: "1rem",
                  marginLeft: "3rem",
                  width: "30vh",
                  marginTop: "2rem",
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="h6">Company</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.leadership}
                          onChange={handleFilterChange}
                          name="leadership"
                        />
                      }
                      label="Google"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.productManagement}
                          onChange={handleFilterChange}
                          name="productManagement"
                        />
                      }
                      label="Goldman Sachs"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.startup}
                          onChange={handleFilterChange}
                          name="startup"
                        />
                      }
                      label="Oracle"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.leadership}
                          onChange={handleFilterChange}
                          name="entreprenuer"
                        />
                      }
                      label="VISA"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.productManagement}
                          onChange={handleFilterChange}
                          name="web"
                        />
                      }
                      label="Arista "
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.startup}
                          onChange={handleFilterChange}
                          name="android"
                        />
                      }
                      label="Microsoft "
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Search and Mentor Cards Section */}
            <Box sx={{ width: "150vh" }}>
              {/* Search Bar */}
              <TextField
                fullWidth
                variant="outlined"
                label="Search for any skill, title or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ marginBottom: 3 }}
              />

              {/* Mentor Cards */}
              <Grid container spacing={2}>
                {mentors.map((mentor) => (
                  <Grid item xs={12} md={4} key={mentor._id}>
                    {" "}
                    {/* Use mentor._id for the key */}
                    <Card>
                      <CardContent>
                        <Avatar src={mentor.profilePicture} alt={mentor.name} />{" "}
                        {/* Corrected property */}
                        <Typography variant="h6">{mentor.name}</Typography>
                        <Typography variant="body1">
                          {mentor.jobTitle}
                        </Typography>
                        <Typography variant="body2">
                          {mentor.company}
                        </Typography>
                        <Typography variant="caption">
                          {mentor.skills.length > 0
                            ? mentor.skills.join(", ")
                            : "No skills listed"}
                        </Typography>
                        <Box
                          display="flex"
                          justifyContent="flex-end"
                          sx={{ marginTop: 2 }}
                        >
                          <Button variant="contained" color="primary">
                            Get Started
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default MentorSearchPage;
