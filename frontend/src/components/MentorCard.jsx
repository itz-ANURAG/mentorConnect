import PropTypes from "prop-types";
import { Card, CardContent, Typography } from "@mui/material";

const MentorCard = ({ mentor }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{mentor.name}</Typography>
        <Typography variant="body2">{mentor.bio}</Typography>
        <Typography variant="caption">{mentor.expertise}</Typography>
      </CardContent>
    </Card>
  );
};

// Prop types validation for MentorCard
MentorCard.propTypes = {
  mentor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    expertise: PropTypes.string.isRequired,
  }).isRequired,
};

export default MentorCard;