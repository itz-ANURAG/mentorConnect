import { Box, Typography } from '@mui/material';

const StatisticsSection = () => {
  const stats = [
    { value: '5,400+', label: 'Available mentors' },
    { value: '22,700+', label: 'Matches made' },
    { value: '130+', label: 'Countries represented' }
  ];

  return (
    <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#ffffff' }}>
      <Box display="flex" justifyContent="center" flexWrap="wrap" >
        {stats.map((stat, index) => (
          <Box
            key={index}
            sx={{
              flex: '1 1 30%', // 30% width, allowing flexibility
              maxWidth: '300px', // Set a maximum width for each item
              textAlign: 'center',
              m: 1 // margin for spacing between items
            }}
          >
            <Typography variant="h4" component="div" color="primary">
              {stat.value}
            </Typography>
            <Typography variant="subtitle1" component="div">
              {stat.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default StatisticsSection;