const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Mentor = require('./Models/Mentor');

// Sample data for the mentors
const mentors = [
  {
    name: "John Doe",
    email: "johndoe@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "I am a product manager with over 10 years of experience.",
    jobTitle: "Product Manager",
    company: "Tech Corp",
    location: "San Francisco, CA",
    summary: "Experienced in leading cross-functional teams.",
    freeSlots: [
      { date: new Date('2024-10-21'), time: "10:00 AM" },
      { date: new Date('2024-10-22'), time: "2:00 PM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 4.5
  },
  {
    name: "Jane Smith",
    email: "janesmith@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/women/4.jpg",
    bio: "Founder of a successful startup. Passionate about entrepreneurship.",
    jobTitle: "Startup Founder",
    company: "Innovate Inc",
    location: "New York, NY",
    summary: "Helping aspiring entrepreneurs build their dreams.",
    freeSlots: [
      { date: new Date('2024-10-23'), time: "3:00 PM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 5.0
  },
  {
    name: "David Lee",
    email: "davidlee@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
    bio: "Engineering manager with a passion for building scalable software.",
    jobTitle: "Engineering Manager",
    company: "BuildStuff",
    location: "Seattle, WA",
    summary: "Focused on mentoring engineering teams and delivering high-quality products.",
    freeSlots: [
      { date: new Date('2024-10-24'), time: "11:00 AM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 4.8
  },
  {
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/women/3.jpg",
    bio: "UX Designer with a passion for crafting beautiful user experiences.",
    jobTitle: "UX Designer",
    company: "Creative Minds",
    location: "Los Angeles, CA",
    summary: "Specialized in UI/UX and front-end design for tech products.",
    freeSlots: [
      { date: new Date('2024-10-25'), time: "9:00 AM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 4.7
  },
  {
    name: "Michael Brown",
    email: "michaelbrown@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/men/4.jpg",
    bio: "CTO with expertise in cloud computing and distributed systems.",
    jobTitle: "CTO",
    company: "Future Tech",
    location: "Boston, MA",
    summary: "Experienced in scaling engineering teams and products globally.",
    freeSlots: [
      { date: new Date('2024-10-26'), time: "4:00 PM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 5.0
  },
  {
    name: "Sara Evans",
    email: "saraevans@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/women/5.jpg",
    bio: "Marketing specialist with a focus on brand strategy and digital campaigns.",
    jobTitle: "Marketing Specialist",
    company: "Brand Builders",
    location: "Austin, TX",
    summary: "Helping brands grow through effective marketing and engagement strategies.",
    freeSlots: [
      { date: new Date('2024-10-27'), time: "10:00 AM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 4.6
  },
  {
    name: "Tom Harris",
    email: "tomharris@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/men/5.jpg",
    bio: "DevOps engineer focusing on automation and cloud infrastructure.",
    jobTitle: "DevOps Engineer",
    company: "Cloud Solutions",
    location: "Denver, CO",
    summary: "Expert in building CI/CD pipelines and cloud architecture.",
    freeSlots: [
      { date: new Date('2024-10-28'), time: "11:30 AM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 4.9
  },
  {
    name: "Emma Davis",
    email: "emmadavis@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/women/6.jpg",
    bio: "Data scientist with a passion for machine learning and data analysis.",
    jobTitle: "Data Scientist",
    company: "Data Insights",
    location: "Chicago, IL",
    summary: "Helping companies leverage data for strategic decision making.",
    freeSlots: [
      { date: new Date('2024-10-29'), time: "3:00 PM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 4.4
  },
  {
    name: "James Wilson",
    email: "jameswilson@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/men/6.jpg",
    bio: "Full stack developer with expertise in JavaScript and Python.",
    jobTitle: "Software Developer",
    company: "CodeCraft",
    location: "Miami, FL",
    summary: "Building scalable web applications and RESTful APIs.",
    freeSlots: [
      { date: new Date('2024-10-30'), time: "2:30 PM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 4.2
  },
  {
    name: "Olivia Martinez",
    email: "oliviamartinez@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/women/7.jpg",
    bio: "Project manager with a focus on agile methodology.",
    jobTitle: "Project Manager",
    company: "Agile Corp",
    location: "Phoenix, AZ",
    summary: "Leading agile teams to deliver projects on time and within scope.",
    freeSlots: [
      { date: new Date('2024-10-31'), time: "1:00 PM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 4.8
  },
  {
    name: "William Turner",
    email: "williamturner@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/men/7.jpg",
    bio: "Software architect with a passion for building scalable and maintainable systems.",
    jobTitle: "Software Architect",
    company: "CodeBase",
    location: "San Diego, CA",
    summary: "Helping development teams design efficient software systems.",
    freeSlots: [
      { date: new Date('2024-11-01'), time: "5:00 PM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 5.0
  },
  {
    name: "Sophia Clark",
    email: "sophiaclark@example.com",
    password: "password123",
    profilePicture: "https://randomuser.me/api/portraits/women/8.jpg",
    bio: "Cybersecurity expert focused on protecting businesses from digital threats.",
    jobTitle: "Cybersecurity Consultant",
    company: "SecureNet",
    location: "Washington, D.C.",
    summary: "Specializing in network security, ethical hacking, and incident response.",
    freeSlots: [
      { date: new Date('2024-11-02'), time: "9:30 AM" }
    ],
    skills: [],
    upcomingSessions: [],
    posts: [],
    communityPosts: [],
    ratings: 4.3
  }
];


// Connect to the database and insert the mentors
const seedDatabase = async () => {
  try {
    await connectDB();

    // Insert each mentor individually using mapping
    await Promise.all(
      mentors.map(async (mentor) => {
        await Mentor.create(mentor);
      })
    );

    console.log("Mentors Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedDatabase();