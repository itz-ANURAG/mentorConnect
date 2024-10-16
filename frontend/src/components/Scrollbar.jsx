// src/components/Scrollbar.jsx
import React, { useEffect, useRef } from "react";

const Scrollbar = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollSpeed = 1; // Adjust the speed of scrolling
    const scrollStep = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop += scrollSpeed;
        if (
          containerRef.current.scrollTop + containerRef.current.offsetHeight >=
          containerRef.current.scrollHeight
        ) {
          containerRef.current.scrollTop = 0; // Loop back to the top
        }
      }
    };

    const intervalId = setInterval(scrollStep, 30); // Adjust time for smooth scrolling

    return () => clearInterval(intervalId);
  }, []);

  return (
    // **Outer Container Adjusted for Middle Right Alignment**
    <div className="flex justify-end items-center h-screen p-4"> {/* Align cards to the middle right side with padding */}
      <div
        className="h-[400px] w-[600px] overflow-hidden relative" // Maintain fixed size for scrollbar
        ref={containerRef}
      >
        <div className="p-4 space-y-4"> {/* Added space between the children (cards) */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Scrollbar;
