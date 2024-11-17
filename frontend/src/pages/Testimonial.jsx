import { Box, Typography, Card, Avatar, Button } from '@mui/material';
import { Star } from '@mui/icons-material';
import React, { useRef, useState, useEffect } from 'react';

const Testimonial = ({ reviews = [] }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialRef = useRef(null);

  useEffect(() => {
    setTestimonials(reviews); // Update state when reviews prop changes
  }, [reviews]);

  const cardsPerView = 3; // Number of visible cards
  const totalCards = testimonials.length;

  // Handle next and previous clicks
  const nextTestimonial = () => {
    if (currentIndex < totalCards - cardsPerView) {
      setCurrentIndex(currentIndex + 1);
      testimonialRef.current.scrollLeft += testimonialRef.current.offsetWidth / cardsPerView;
    }
  };

  const prevTestimonial = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      testimonialRef.current.scrollLeft -= testimonialRef.current.offsetWidth / cardsPerView;
    }
  };

  // Render pagination dots dynamically
  const renderPaginationDots = () => {
    const totalDots = Math.max(1, totalCards - cardsPerView + 1);
    return Array.from({ length: totalDots }).map((_, index) => (
      <Box
        key={index}
        sx={{
          height: 10,
          width: 10,
          borderRadius: '50%',
          backgroundColor: index === currentIndex ? '#fff' : '#888',
          opacity: index === currentIndex ? 1 : 0.6,
          transition: 'opacity 0.3s ease',
        }}
      />
    ));
  };

  return (
    <Box className="bg-blue-900 text-white p-8 relative">
      {/* Heading Section */}
      <Box className="text-left mb-4">
        <Typography variant="h6" className="text-sm">Testimonials</Typography>
        <Typography variant="h4" className="font-bold">What Clients Say</Typography>
      </Box>

      {/* Testimonial Cards Sliding Section */}
      <Box
        ref={testimonialRef}
        className="flex overflow-hidden space-x-4 scroll-smooth mb-12"
        style={{ scrollBehavior: 'smooth' }}
      >
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="bg-white text-blue-600 rounded-lg w-[400px] shadow-lg flex-none p-6 relative"
            style={{ minWidth: '300px' }}
          >
            <Typography variant="body2" className="mb-2">{testimonial.description}</Typography>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar src={testimonial.profilePicture} alt="Profile" className="w-16 h-16 mr-3" />
                <div className="flex flex-col">
                  <Typography className="font-semibold text-lg">{testimonial.name}</Typography>
                  <Typography className="text-sm text-gray-500">{testimonial.role}</Typography>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold">{testimonial.rating.toFixed(1)}</span>
                <Star className="text-yellow-500 text-2xl ml-1" />
              </div>
            </div>
          </Card>
        ))}
      </Box>

      {/* Pagination Dots */}
      <Box className="absolute w-full bottom-16 flex justify-center space-x-2">
        {renderPaginationDots()}
      </Box>

      {/* Buttons */}
      <Box className="absolute w-full bottom-4 flex justify-center space-x-8">
        <Button
          onClick={prevTestimonial}
          className="bg-gray-800 text-white p-4 rounded-full opacity-90 hover:bg-gray-700 hover:opacity-100 transition"
          disabled={currentIndex === 0}
        >
          ❮
        </Button>
        <Button
          onClick={nextTestimonial}
          className="bg-gray-800 text-white p-4 rounded-full opacity-90 hover:bg-gray-700 hover:opacity-100 transition"
          disabled={currentIndex >= totalCards - cardsPerView}
        >
          ❯
        </Button>
      </Box>
    </Box>
  );
};

export default Testimonial;
