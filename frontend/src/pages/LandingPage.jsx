// Importing necessary components
import ResponsiveAppBar from '../components/NavbarLandingPage'; // Navbar component
import Body from '../components/Body'; // Body content of the landing page
import Footer from '../components/Footer'; // Footer component
import MentorSection from '../components/Mentordetail'; // Section displaying mentor details
import { useDispatch ,useSelector } from 'react-redux';
import restoreAuthState from '../utility/RestoreAuthState';
import { useState ,useEffect} from 'react';
import { Navigate } from 'react-router';
import CustomSpinner from '../components/CustomSpinner';

const LandingPage = () => {


  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const menteeId = useSelector((state) => state.mentee.data?._id || state.mentee.data?.id);
  const mentorId = useSelector((state) => state.mentor.data?._id || state.mentor.data?.id);
  const [isAuthChecked, setIsAuthChecked] = useState(false);


  // Checking is already logged in or not
  // useEffect(() => {
  //     const restoreAuth = async () => {
  //         if (!token) {
  //             console.log("Restoring authentication state...");
  //             await restoreAuthState(dispatch);
  //         }
  //         setIsAuthChecked(true); // Ensure we update state after checking auth
  //     };

  //     restoreAuth();
  // }, [dispatch, token]);

  // // Wait until auth state is checked before rendering anything
  // if (!isAuthChecked) {
  //     return <div><CustomSpinner/></div>; // Show a loading indicator while restoring auth
  // }

// If loggedIn and role is mentor the mentor profile else mentee profile
  return(
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

  )
};

// Exporting the LandingPage component for use in other parts of the app
export default LandingPage;
