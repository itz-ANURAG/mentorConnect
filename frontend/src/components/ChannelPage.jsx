import React from "react";
import { useParams } from "react-router-dom";
import Call from "./Call";

const ChannelPage = () => {
  const { lchannelName } = useParams();
  
  // Ensure lchannelName is valid before calling replace()
  const safeChannel = lchannelName ? lchannelName.replace(/\*/g, ".") : "defaultChannel";
  const channelName = safeChannel.slice(0, 64); // Trim to max 64 bytes

  return (
    <main className="flex w-full flex-col">
      <p className="absolute z-10 mt-2 ml-12 text-2xl font-bold text-gray-900">
        {channelName}
      </p>
      <Call
        appId="8f1264110ece4b89b2dd592041a5d736"
        channelName={channelName}
      />
    </main>
  );
};

export default ChannelPage;
