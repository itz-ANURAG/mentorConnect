import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import MentorCard from "./MentorCard";

const ScrollableMentorSection = ({ speed = 2, mentors }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += speed; // Adjust for vertical scrolling
      }
    }, 30); // Adjust the interval for smoothness

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [speed]);

  return (
    <Box
      ref={scrollRef}
      sx={{
        display: "flex",
        flexDirection: "column", // Stack items vertically
        overflowY: "auto", // Enable vertical scrolling
        overflowX: "hidden", // Disable horizontal scrolling
        scrollBehavior: "smooth",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none", /* for Internet Explorer, Edge */
        scrollbarWidth: "none", /* for Firefox */
        gap: "16px",
        p: 2,
      }}
    >
      {mentors.map((mentor, index) => (
        <MentorCard key={index} mentor={mentor} />
      ))}
    </Box>
  );
};

// Prop types validation
ScrollableMentorSection.propTypes = {
  speed: PropTypes.number,
  mentors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
      expertise: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ScrollableMentorSection;