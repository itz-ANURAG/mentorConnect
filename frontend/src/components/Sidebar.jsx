import React, { useState } from "react";

// Import react-pro-sidebar components
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

// Import icons from react-icons
import { FaList, FaRegHeart } from "react-icons/fa";
import { FiHome, FiLogOut, FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import { RiPencilLine } from "react-icons/ri";
import { BiCog } from "react-icons/bi";

// Import sidebar styles
// import "react-pro-sidebar/dist/css/styles.css";

const Header = () => {
  // Create initial menuCollapse state using useState hook
  const [menuCollapse, setMenuCollapse] = useState(false);

  // Function to toggle the menuCollapse state
  const menuIconClick = () => {
    setMenuCollapse(!menuCollapse);
  };

  return (
    <div
      id="header"
      className="absolute w-[220px]"
    >
      {/* Sidebar with collapse functionality */}
      <Sidebar collapsed={menuCollapse} className="h-screen w-full min-w-full">
        <div className="text-black text-2xl font-bold py-4 px-5">
          <p>{menuCollapse ? "Logo" : "Big Logo"}</p>
        </div>
        <div
          className="text-black absolute right-0 z-10 text-2xl font-bold cursor-pointer top-[55px] rounded-full"
          onClick={menuIconClick}
        >
          {menuCollapse ? <FiArrowRightCircle /> : <FiArrowLeftCircle />}
        </div>

        <Menu>
          <MenuItem icon={<FiHome />}>Home</MenuItem>
          <MenuItem icon={<FaList />}>Category</MenuItem>
          <MenuItem icon={<FaRegHeart />}>Favourite</MenuItem>
          <MenuItem icon={<RiPencilLine />}>Author</MenuItem>
          <MenuItem icon={<BiCog />}>Settings</MenuItem>
        </Menu>

        <Menu>
          <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default Header;
