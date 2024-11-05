import React from "react";
import Navbar from "./NavbarLandingPage"
import Footer from "./footer"

const About = () => {
  return (
    <>
    <Navbar/>
    <div className="flex justify-center min-h-screen items-center py-3 px-2">
      <div className="bg-slate flex flex-col items-center justify-center drop-shadow-lg rounded-lg max-w w-full p-20">
        <div className="w-full">
          <h2 className=" text-lg lg:text-4xl font-bold text-start mb-4">
            About Us
          </h2>
          <p className="text-justify text-gray-700 text-xl">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam ratione nostrum voluptate cumque. Quisquam, neque ducimus rem soluta blanditiis incidunt hic voluptas perspiciatis dolore! Et autem quam soluta illo eaque?
            Sunt assumenda odit molestiae modi perferendis qui excepturi iste, nihil perspiciatis! Excepturi quis accusamus, similique totam unde hic culpa. Quisquam, ducimus hic temporibus nulla corrupti aliquid laudantium. Quam, dolorum eius.
            Itaque debitis non cupiditate quaerat eos quo consequatur. Odio ad vitae suscipit. Consequatur itaque sunt dolorum impedit mollitia nostrum inventore repellendus, cumque ut praesentium voluptate tempore, delectus, alias possimus tenetur.
            Repellendus voluptatem sed aut at iure eligendi, placeat provident fugit reiciendis aperiam doloremque tenetur nisi vel voluptatum vero culpa magnam, hic doloribus corrupti perspiciatis expedita exercitationem! Voluptas error consectetur iure.
            Magni ipsa quod ducimus esse sit fuga modi incidunt culpa consequuntur. Iusto, totam repudiandae repellat a vitae, reprehenderit officia sapiente nesciunt dolorum dolore itaque esse eum? Veniam sequi a quisquam.
          </p>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default About;
