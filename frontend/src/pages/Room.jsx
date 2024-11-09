import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'simple-peer/simplepeer.min.js';
import { useSocket } from '../main';
import { Button, TextField, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

function VideoCall() {
  const { token: safeToken } = useParams();
  const token = safeToken.replace(/-/g, '.');
  const socket = useSocket();
  const [me, setMe] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [showChat, setShowChat] = useState(true);
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const userVideo = useRef();
  const connectionRef = useRef();
  const myVideo = useRef();
  
  const handleSend = () => {
    if (message.trim()) {
      socket.emit("msg", { message, roomId: token, senderId: me });
      setMessage('');
    }
  };

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

    socket.on("newMessage", (data) => {
      console.log(data);
      setMessages((prevMessages) => {
        if (!prevMessages.some(msg => msg.message === data.message)) {
          return [...prevMessages, data];
        }
        return prevMessages;
      });
    });
  
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
      socket.off("newMessage");
    };
  }, [socket, token]);
  
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

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
      userVideo.current.srcObject = null;
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
      userVideo.current.srcObject = null;
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
    userVideo.current.srcObject = null;
  };

  const toggleMute = () => {
    setMuted((prev) => {
      const newMuted = !prev;
      if (stream) {
        stream.getAudioTracks().forEach(track => {
          track.enabled = !newMuted;
        });
      }
      return newMuted;
    });
  };

  const toggleVideo = () => {
    setVideoEnabled((prev) => {
      const newVideoEnabled = !prev;
      if (stream) {
        stream.getVideoTracks().forEach(track => {
          track.enabled = newVideoEnabled;
        });
      }
      return newVideoEnabled;
    });
  };

  return (
    <div className="bg-gray-900 min-h-screen flex">
      {/* Video Section - 80% of the screen */}
      <div className="flex-grow w-4/5 p-4">
        <div className="video-container w-full h-[80vh] bg-black rounded-lg overflow-hidden relative">
          {callAccepted && !callEnded ? (
            <video
              className="w-full h-full object-cover"
              playsInline
              ref={userVideo}
              autoPlay
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500">
              <span>Waiting for user to join...</span>
            </div>
          )}
          {stream && (
            <video
              className="absolute bottom-4 right-4 w-[150px] h-[100px] rounded-lg border-2 border-green-500"
              playsInline
              muted
              ref={myVideo}
              autoPlay
            />
          )}
        </div>

        <div className="flex justify-center mt-4 gap-4">
          {callAccepted && !callEnded ? (
            <>
              <IconButton onClick={toggleMute} color="primary">
                {muted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
              <IconButton onClick={toggleVideo} color="primary">
                {videoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
              <Button
                variant="contained"
                color="error"
                onClick={leaveCall}
                startIcon={<CallEndIcon />}
              >
                End Call
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => callUser(idToCall)}
              startIcon={<VideoCallIcon />}
            >
              Call Now
            </Button>
          )}
        </div>

        {receivingCall && !callAccepted && (
          <div className="mt-4 text-center">
            <h2>{caller} is calling...</h2>
            <Button
              variant="contained"
              color="primary"
              onClick={answerCall}
              style={{ width: '120px' }}
            >
              Answer
            </Button>
          </div>
        )}
      </div>

      {/* Chat Section - 20% of the screen */}
      {showChat && (
        <div className="w-1/5 h-[90vh] bg-gray-800 text-white shadow-lg z-10 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Chat</h2>
          </div>
          <div className="h-[60vh] overflow-y-auto border-b border-gray-600 p-2 space-y-2">
          {messages.map((msg, index) => (
                        <div
                        key={index}
                        className={`flex ${msg.senderId === me ? "justify-end" : "justify-start"}`}
                        >
                        <div
                            className={`${
                            msg.senderId === me ? "bg-green-500 text-white" : "bg-gray-300 text-black"
                            } rounded-lg px-4 py-2 max-w-xs shadow-md`}
                        >
                            <span className="block text-xs text-gray-500 mb-1">
                            {msg.senderId === me ? "You" : msg.emailId}
                            </span>
                            <p>{msg.message}</p>
                        </div>
                        </div>
                    ))}
          </div>
          <div className="mt-4">
            <TextField
              label="Type a message"
              variant="outlined"
              value={message}
              onChange={handleInputChange}
              fullWidth
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSend}
              className="mt-2 w-full"
            >
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCall;
