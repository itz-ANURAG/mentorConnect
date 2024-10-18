import ResponsiveAppBar from '../components/NavbarLandingPage';
import Body from '../components/Body'
import Footer from '../components/footer'
import MentorSection from '../components/Mentordetail';
const LandingPage = () =>{
return (
    <>
    <ResponsiveAppBar/>
    <div className='flex flex-col'>
    <Body/>
    </div>
    <MentorSection/>
    <Footer/>
    </>
)
};

export default LandingPage;