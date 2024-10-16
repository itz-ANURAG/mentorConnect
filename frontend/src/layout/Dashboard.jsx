
import React, { useState } from 'react';
import { Avatar, Chip, Card, CardContent, Typography, IconButton, Button, Tooltip } from '@mui/material';
import { LocationOn, Star, CheckCircle, AccessTime, Phone, Group } from '@mui/icons-material';

const Dashboard = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Hardcoded skill data
  const allSkills = [
    'React', 'Node.js', 'JavaScript', 'HTML/CSS', 'MongoDB', 'Express.js',
    'Tailwind CSS', 'Material UI', 'TypeScript', 'GraphQL', 'Redux', 'Next.js'
  ];

  // Function to handle tooltip toggle
  const handleTooltipOpen = () => {
    setTooltipOpen(!tooltipOpen);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  const skillsToShow = showMore ? allSkills : allSkills.slice(0, 6);

  return (
    <div className="w-full h-screen p-4">
      {/* Upper Rectangle (Dark Blue) */}
      <div className="bg-blue-900 h-1/3 relative flex items-end">
        {/* Profile Picture */}
        <div className="absolute left-4 -bottom-12">
          <Avatar
            alt="Edward Murphy"
            src="https://via.placeholder.com/150"
            className="w-40 h-40 border-4 border-white"
            sx={{ width: 160, height: 160 }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white flex justify-between px-4 pt-16">
        {/* Middle: Description and Session Section */}
        <div className="flex-grow pr-6">
          {/* Description */}
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-800">Edward Murphy</h1>
            <p className="text-gray-600">Senior Software Engineer (Full Stack) @ First American</p>

            {/* Location */}
            <div className="flex items-center mt-1 text-gray-500">
              <LocationOn fontSize="small" />
              <span className="ml-2">United States of America</span>
            </div>

            {/* Reviews */}
            <div className="flex items-center mt-1 text-gray-500">
              <Star fontSize="small" className="text-yellow-500" />
              <span className="ml-2">5.0 (33 reviews)</span>
            </div>

            {/* Active this month */}
            <div className="flex items-center mt-1 text-gray-500">
              <CheckCircle fontSize="small" className="text-green-500" />
              <span className="ml-2">Active this month</span>
            </div>

            {/* Usually responds in with clickable tooltip */}
            <div className="flex items-center mt-1 text-gray-500">
              <AccessTime fontSize="small" />
              <Tooltip
                title="Definition: Typically responds in half a day."
                arrow
                open={tooltipOpen} // Controls tooltip visibility
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

          {/* Session Card */}
          <Card className="mt-6 w-full" sx={{ maxWidth: 400 }}>
            <CardContent>
              <Typography variant="h6" component="div" className="text-gray-800 font-semibold">
                Session
              </Typography>
              <div className="flex flex-col gap-4 mt-4">
                {/* Book a Call */}
                <div className="flex items-center gap-2">
                  <IconButton color="primary">
                    <Phone />
                  </IconButton>
                  <Button variant="outlined" color="primary">
                    Book a Call
                  </Button>
                </div>
                {/* Join Community */}
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

        {/* Right: Skills Section */}
        <div className="ml-4 w-1/3">
          <h2 className="text-lg font-semibold text-gray-800">Skills</h2>
          <div className="flex flex-wrap gap-1 mt-2">
            {skillsToShow.map((skill, index) => (
              <Chip key={index} label={skill} color="primary" />
            ))}
          </div>

          {/* Show more/less toggle */}
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
  );
};

export default Dashboard;
