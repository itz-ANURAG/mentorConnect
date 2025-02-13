import React, { useState } from "react";
import {
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useJoin,
  useRemoteUsers,
  useRemoteAudioTracks,
  LocalVideoTrack,
  RemoteUser,
} from "agora-rtc-react";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";

const Videos = ({ channelName, appId, role }) => {
  const { isLoading: isLoadingMic, localMicrophoneTrack } = useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCamEnabled, setIsCamEnabled] = useState(true);

  usePublish([
    isMicEnabled ? localMicrophoneTrack : null,
    isCamEnabled ? localCameraTrack : null,
  ]);

  useJoin({
    appid: "8f1264110ece4b89b2dd592041a5d736",
    channel: channelName,
    token: null,
  });

  audioTracks.forEach((track) => track.play());

  if (isLoadingMic || isLoadingCam) {
    return <div className="flex flex-col items-center pt-40">Loading devices...</div>;
  }

  const toggleMic = () => {
    if (localMicrophoneTrack) {
      localMicrophoneTrack.setEnabled(!isMicEnabled);
      setIsMicEnabled((prev) => !prev);
    }
  };

  const toggleCam = () => {
    if (localCameraTrack) {
      localCameraTrack.setEnabled(!isCamEnabled);
      setIsCamEnabled((prev) => !prev);
    }
  };

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      <div
        className="grid gap-1 flex-1"
        style={{
          gridTemplateColumns:
            remoteUsers.length > 9
              ? "repeat(4, minmax(0, 1fr))"
              : remoteUsers.length > 4
              ? "repeat(3, minmax(0, 1fr))"
              : remoteUsers.length > 1
              ? "repeat(2, minmax(0, 1fr))"
              : "minmax(0, 1fr)",
        }}
      >
        <div className="relative">
          <LocalVideoTrack track={localCameraTrack} play={isCamEnabled} className="w-full h-full" />
          <div className="absolute bottom-2 left-2 flex space-x-2">
            <button
              onClick={toggleMic}
              className={`flex items-center px-3 py-2 rounded-lg text-white transition-all ${
    isMicEnabled ? "bg-red-500 hover:bg-red-600" : "bg-gray-500 hover:bg-gray-600"
  }`}
            >
              {isMicEnabled ? <Mic size={20} /> : <MicOff size={20} />} &nbsp;
              {isMicEnabled ? "Mute" : "Unmute"}
            </button>
            <button
              onClick={toggleCam}
              className={`flex items-center px-3 py-2 rounded-lg text-white transition-all ${
    isCamEnabled ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 hover:bg-gray-600"
  }`}
            >
              {isCamEnabled ? <Video size={20} /> : <VideoOff size={20} />} &nbsp;
              {isCamEnabled ? "Turn Off" : "Turn On"}
            </button>
          </div>
        </div>

        {remoteUsers.map((user) => (
          <div key={user.uid} className="relative">
            <RemoteUser user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
