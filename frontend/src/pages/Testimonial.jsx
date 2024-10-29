/* eslint-disable no-unused-vars */

import { Box, Typography, Card, Avatar, Button } from '@mui/material';
import { Star } from '@mui/icons-material';
import React, { useRef, useState } from 'react';
let testimonials = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Project Manager',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur in atque voluptas accusantium, sequi dolorem nobis illum libero obcaecati illo excepturi incidunt veritatis, ratione ea a eaque dolor! Qui, tenetur?Asperiores, consequatur beatae iste possimus doloremque accusantium quam esse quas? Tenetur qui explicabo saepe. Voluptatum omnis, molestias dolor nostrum a laborum ut fuga dolorem non soluta, recusandae nam aliquid repellat?Tempore velit placeat, voluptates quisquam ex quis adipisci cumque quia eos quibusdam, autem hic eligendi est exercitationem. Magni, vitae adipisci! Facilis explicabo temporibus nam quibusdam a excepturi quidem aut necessitatibus.Voluptatibus quam asperiores illum ea nesciunt veritatis officiis commodi, voluptate, expedita repellat iure! Magnam cumque id sapiente voluptate explicabo repellat provident error repudiandae. Asperiores, nisi aspernatur tempora itaque corporis sed!Porro voluptatum aliquid, ea doloremque nemo eum blanditiis commodi asperiores error perferendis tenetur ducimus maxime, in, illo illum! Sint vitae possimus aspernatur eligendi voluptates provident, ut necessitatibus aut. Suscipit, excepturi!',
    rating: 4.5,
    profilePic: 'profile-pic-1.jpg', // Add actual image path
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Developer',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur in atque voluptas accusantium, sequi dolorem nobis illum libero obcaecati illo excepturi incidunt veritatis, ratione ea a eaque dolor! Qui, tenetur?Asperiores, consequatur beatae iste possimus doloremque accusantium quam esse quas? Tenetur qui explicabo saepe. Voluptatum omnis, molestias dolor nostrum a laborum ut fuga dolorem non soluta, recusandae nam aliquid repellat?Tempore velit placeat, voluptates quisquam ex quis adipisci cumque quia eos quibusdam, autem hic eligendi est exercitationem. Magni, vitae adipisci! Facilis explicabo temporibus nam quibusdam a excepturi quidem aut necessitatibus.Voluptatibus quam asperiores illum ea nesciunt veritatis officiis commodi, voluptate, expedita repellat iure! Magnam cumque id sapiente voluptate explicabo repellat provident error repudiandae. Asperiores, nisi aspernatur tempora itaque corporis sed!Porro voluptatum aliquid, ea doloremque nemo eum blanditiis commodi asperiores error perferendis tenetur ducimus maxime, in, illo illum! Sint vitae possimus aspernatur eligendi voluptates provident, ut necessitatibus aut. Suscipit, excepturi!',
    rating: 5.0,
    profilePic: 'profile-pic-2.jpg', // Add actual image path
  },
  // Add more testimonials as needed...
  {
    id: 3,
    name: 'Sam Taylor',
    role: 'Designer',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur in atque voluptas accusantium, sequi dolorem nobis illum libero obcaecati illo excepturi incidunt veritatis, ratione ea a eaque dolor! Qui, tenetur?Asperiores, consequatur beatae iste possimus doloremque accusantium quam esse quas? Tenetur qui explicabo saepe. Voluptatum omnis, molestias dolor nostrum a laborum ut fuga dolorem non soluta, recusandae nam aliquid repellat?Tempore velit placeat, voluptates quisquam ex quis adipisci cumque quia eos quibusdam, autem hic eligendi est exercitationem. Magni, vitae adipisci! Facilis explicabo temporibus nam quibusdam a excepturi quidem aut necessitatibus.Voluptatibus quam asperiores illum ea nesciunt veritatis officiis commodi, voluptate, expedita repellat iure! Magnam cumque id sapiente voluptate explicabo repellat provident error repudiandae. Asperiores, nisi aspernatur tempora itaque corporis sed!Porro voluptatum aliquid, ea doloremque nemo eum blanditiis commodi asperiores error perferendis tenetur ducimus maxime, in, illo illum! Sint vitae possimus aspernatur eligendi voluptates provident, ut necessitatibus aut. Suscipit, excepturi!',
    profilePic: 'profile-pic-3.jpg',
  },
  {
    id: 4,
    name: 'Laura Johnson',
    role: 'Data Analyst',
    description: 'A fantastic service that enhanced my productivity.',
    rating: 4.7,
    profilePic: 'profile-pic-4.jpg',
  },
  {
    id: 5,
    name: 'Michael Lee',
    role: 'Engineer',
    description: 'The perfect solution for managing tasks!',
    rating: 4.6,
    profilePic: 'profile-pic-5.jpg',
  },
  {
    id: 6,
    name: 'Michael Lee',
    role: 'Engineer',
    description: 'The perfect solution for managing tasks!',
    rating: 4.6,
    profilePic: 'profile-pic-5.jpg',
  },
  {
    id: 7,
    name: 'Michael Lee',
    role: 'Engineer',
    description: 'The perfect solution for managing tasks!',
    rating: 4.6,
    profilePic: 'profile-pic-5.jpg',
  },
  {
    id: 8,
    name: 'Michael Lee',
    role: 'Engineer',
    description: 'The perfect solution for managing tasks!',
    rating: 4.6,
    profilePic: 'profile-pic-5.jpg',
  },
];

const Testimonial = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonialRef = useRef(null);
  if(props.reviews) testimonials=props.reviews;
  const cardsPerView = 3; // Number of visible cards
  const totalCards = testimonials.length;
  // Smooth scroll behavior and increment/decrement
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

  // Pagination dots logic
  const renderPaginationDots = () => {
    const totalDots = totalCards - cardsPerView + 1;
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
                <Avatar src={testimonial.profilePic} alt="Profile" className="w-16 h-16 mr-3" />
                <div className="flex flex-col">
                  <Typography className="font-semibold text-lg">{testimonial.name}</Typography>
                  <Typography className="text-sm text-gray-500">{testimonial.role}</Typography>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold">{testimonial.rating}</span>
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

      {/* Buttons placed outside the cards */}
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
