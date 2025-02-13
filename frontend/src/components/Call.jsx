import React, { useEffect } from "react";
import AgoraRTC, {
  AgoraRTCProvider,
  useRTCClient,
} from "agora-rtc-react";
import Videos from "./Videos";

const Call = ({ appId, channelName }) => {
  const client = useRTCClient(
    AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })
  );

  useEffect(() => {
    return () => {
      client.leave(); // Ensure cleanup
    };
  }, [client]);

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={channelName} appId={appId} />
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4">
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 w-40"
          href="/"
        >
          End Call
        </a>
      </div>
    </AgoraRTCProvider>
  );
};

export default Call;
