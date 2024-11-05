import React from "react";
import Form from "../forms/exsmpleforms";
import CardStack from "../components/CardStack";
import Navbar from '../components/NavbarLandingPage'
import Footer from '../components/footer'

const GeneralPost = () => {
    return (
      <>
      <Navbar/>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10">
      <div className="space-y-4">
        {/* Stack multiple JobCards in the center */}
        <CardStack/>
        <CardStack/>
        <CardStack/>
        <CardStack/>
        <CardStack/>
        <CardStack/>
        <CardStack/>
        <CardStack/>
        <CardStack/>
        <CardStack/>
        {/* Add more cards as necessary */}
      </div>
    </div>
    <Footer/>
      </>
    );
};
export default GeneralPost;

