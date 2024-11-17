// Importing necessary components
import ResponsiveAppBar from '../components/NavbarLandingPage'; // Navbar component
import Body from '../components/Body'; // Body content of the landing page
import Footer from '../components/Footer'; // Footer component
import MentorSection from '../components/Mentordetail'; // Section displaying mentor details

const LandingPage = () => {
  return (
    <>
      {/* Responsive AppBar (Navigation Bar) */}
      <ResponsiveAppBar />
      
      {/* Main content area, utilizing flexbox for layout */}
      <div className="flex flex-col min-h-screen">
        {/* Body section with the primary content */}
        <Body />
        
        {/* Mentor section showcasing mentor details */}
        <MentorSection />
        
        {/* Footer section to display footer content */}
        <Footer />
      </div>
    </>
  );
};

// Exporting the LandingPage component for use in other parts of the app
export default LandingPage;
