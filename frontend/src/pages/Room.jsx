import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'simple-peer/simplepeer.min.js';
import { useSocket } from '../main';
import { Button, TextField, IconButton, Badge } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

function VideoCall() {
  const { token: safeToken } = useParams();
  const token = safeToken.replace(/-/g, '.');
  const socket = useSocket();
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [showChat, setShowChat] = useState(false);
  const userVideo = useRef();
  const connectionRef = useRef();
  const myVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (myVideo.current) {
          myVideo.current.srcObject = mediaStream;
        }
      })
      .catch((error) => console.error("Error accessing media devices:", error));
  
    if (token) {
      socket.emit("joined-room", { roomId: token });
    }
  
    socket.on("me", (data) => setMe(data));
    socket.on("user-joined", (data) => {
      const { socketId } = data;
      alert("A user joined the room");
      setIdToCall(socketId);
    });
  
    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  
    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
      }
    });
  
    return () => {
      if (connectionRef.current) connectionRef.current.destroy();
      socket.off("me");
      socket.off("user-joined");
      socket.off("callUser");
      socket.off("callAccepted");
    };
  }, [socket, token]);
  
  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: me });
    });
    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });
    peer.on("close", () => {
      setCallEnded(true);
      userVideo.current.srcObject = null; // Remove remote stream when the call ends
    });
    connectionRef.current = peer;
  };
  
  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (remoteStream) => {
      userVideo.current.srcObject = remoteStream;
    });
    peer.on("close", () => {
      setCallEnded(true);
      userVideo.current.srcObject = null; // Remove remote stream when the call ends
    });
    peer.signal(callerSignal);
    connectionRef.current = peer;
  };
  
  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }
    setCallAccepted(false);
    setReceivingCall(false);
    userVideo.current.srcObject = null; // Clear user video when leaving
  };
  
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  
  return (
    <div className="relative bg-gray-900 min-h-screen flex flex-col items-center text-white">
      <header className="w-full flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold">Team Meeting</h1>
        <Badge badgeContent={1} color="primary" variant="dot">
          <span className="text-gray-400">1 Active</span>
        </Badge>
      </header>
  
      <div className="flex flex-row justify-center gap-6 mt-6 w-full px-8">
        <div className="flex flex-col items-center w-2/3 bg-gray-800 p-6 shadow-lg rounded-lg border-2 border-gray-700">
          <span className="text-xl font-semibold mb-4">Video Call</span>
  
          <div className="flex gap-8 mb-6">
            <div className="flex flex-col items-center">
              {stream && (
                <video
                  className="rounded-lg shadow-md border-4 border-green-500"
                  playsInline
                  muted
                  ref={myVideo}
                  autoPlay
                  style={{ width: "350px" }}
                />
              )}
              <p className="text-gray-400 mt-2">{me}</p>
            </div>
  
            <div className="flex flex-col items-center">
              {callAccepted && !callEnded ? (
                <video
                  className="rounded-lg shadow-md border-4 border-blue-500"
                  playsInline
                  ref={userVideo}
                  autoPlay
                  style={{ width: "350px" }}
                />
              ) : (
                <div className="w-[350px] h-[350px] flex items-center justify-center bg-gray-700 text-gray-500 rounded-lg">
                  <span>User yet to join</span>
                </div>
              )}
            </div>
          </div>
  
          <div className="mt-4 flex gap-4">
            {callAccepted && !callEnded ? (
              <Button variant="contained" color="error" onClick={leaveCall} style={{ width: '120px' }}>
                End Call
              </Button>
            ) : !callAccepted && !receivingCall ? (
              <Button variant="contained" color="primary" onClick={() => callUser(idToCall)} style={{ width: '120px' }}>
                Call Now
              </Button>
            ) : null}
          </div>
  
          {receivingCall && !callAccepted && (
  <div className="mt-4 text-center">
    <h2>{caller} is calling...</h2>
    <Button variant="contained" color="primary" onClick={answerCall} style={{ width: '120px' }}>
      Answer
    </Button>
  </div>
)}

        </div>
  
        <div className="absolute top-4 right-4">
          <IconButton onClick={toggleChat} color="primary">
            <ChatIcon />
          </IconButton>
        </div>
  
        {showChat && (
          <div className="absolute top-0 right-0 w-[300px] h-full bg-gray-800 text-white shadow-lg z-10 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Chat</h2>
              <IconButton onClick={toggleChat} color="primary">
                <CloseIcon />
              </IconButton>
            </div>
            <div className="h-[400px] overflow-y-auto border-b border-gray-600 p-2">
              <div className="text-gray-400">[Placeholder] Chat goes here...</div>
            </div>
            <TextField fullWidth label="Type a message" variant="outlined" margin="normal" />
          </div>
        )}
      </div>
    </div>
  );
  }
  
  export default VideoCall;
  