import React from "react";
import { useLocation } from "react-router-dom";
import Call from "./Call";

// A simple hook to extract query parameters
const useQuery = () => new URLSearchParams(useLocation().search);

const ChannelPage = () => {
  const query = useQuery();
  // Get the 'id' parameter from the query string
  const channelNameFromQuery = query.get("id") || "defaultChannel";

  // Ensure channelNameFromQuery is valid before calling replace()
  const safeChannel = channelNameFromQuery.replace(/\*/g, ".");
  const channelName = safeChannel.slice(0, 64); // Trim to max 64 bytes
  console.log(channelName)
  return (
    <main className="flex w-full flex-col">
      <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
        {/* {channelName} */}
      </p>
      <Call
  
        appId="8f1264110ece4b89b2dd592041a5d736"
        channelName={channelName}
      />
    </main>
  );
};

export default ChannelPage;
