import React, { useEffect, useRef, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import Peer from 'simple-peer/simplepeer.min.js';
import { useSelector } from 'react-redux';
import { selectSocket } from '../slices/socketSlice';
import { Button, TextField, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import toast from 'react-hot-toast';
import axios from 'axios';

function VideoCall() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  // Extracting the token from the URL parameters
  const { token: safeToken } = useParams();
  const token = safeToken.replace(/\*/g, '.');
  const navigate = useNavigate();
  const socket = useSelector(selectSocket);

   // State variables to manage call and chat data
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

    // Managing role and name based on URL query parameters
  const [mentorName, setMentorName] = useState('');
  const [menteeName, setMenteeName] = useState('');
  const [role, setRole] = useState('');

  // Set role and name based on the query parameters in the URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleFromQuery = params.get('role');
    const nameFromQuery = params.get('name');
    if (roleFromQuery === 'mentor') {
      setRole('mentor');
      setMentorName(nameFromQuery);
    } else if (roleFromQuery === 'mentee') {
      setRole('mentee');
      setMenteeName(nameFromQuery);
    }
  }, []);

  // Sending a message in the chat
  const handleSend = () => {
    if (message.trim()) {
      socket.emit("msg", { message, roomId: token, senderId: me });
      setMessage('');
    }
  };

   // Setting up media devices and socket listeners
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);// Storing the user's media stream
        if (myVideo.current) {
          myVideo.current.srcObject = mediaStream;// Displaying the user's video
        }
      })
      .catch((error) => console.error("Error accessing media devices:", error));

    if (token) {
      socket.emit("joined-room", { roomId: token });
    }

    
    // Listening for various socket events
    socket.on("newMessage", (data) => {
      setMessages((prevMessages) => {
        if (!prevMessages.some(msg => msg.message === data.message)) {
          return [...prevMessages, data];
        }
        return prevMessages;
      });
    });

    socket.on("me", (data) => setMe(data));// Setting the current user's ID
    socket.on("user-joined", (data) => {
      const { socketId } = data;
      alert("A user joined the room");
      setIdToCall(socketId);// Setting the ID of the user to call
    });

    socket.on("room-users", (user)=> setIdToCall(user[0].socketId));// Setting user ID to call from room data

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from); // Setting the caller's ID
      setCallerSignal(data.signal);// Storing the caller's signal
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.signal(signal);// Accepting the call and signaling back
      }
    });
          // Cleanup on component unmount
    return () => {
      if (connectionRef.current) connectionRef.current.destroy();
      socket.off("me");
      socket.off("user-joined");
      socket.off("callUser");
      socket.off("callAccepted");
      socket.off("newMessage");
      socket.off("room-users");
    };
  }, [socket, token]);

   // Handling message input change
  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const callUser = (id) => {
   const peer = new Peer({
  initiator: true, 
  trickle: false, 
  stream,
  config: {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  }
});
    peer.on("signal", (data) => {
      socket.emit("callUser", { userToCall: id, signal: data, from: me });
    });
    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;// Displaying the remote user's video
      }
    });
    peer.on("close", () => {
      setCallEnded(true);
      if (userVideo.current) {
        userVideo.current.srcObject = null;// Displaying the remote user's video
      }
    });
    connectionRef.current = peer;
  };

    // Function to answer an incoming call
  const answerCall = () => {
    setCallAccepted(true);
   const peer = new Peer({
  initiator: true, 
  trickle: false, 
  stream,
  config: {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  }
});
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });// Answering the call
    });
    peer.on("stream", (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;// Displaying the remote user's video
      }
    });
    peer.on("close", () => {
      setCallEnded(true);
      if (userVideo.current) {
        userVideo.current.srcObject = null;// Ending the call and clearing the video stream
      }
    });
    peer.signal(callerSignal);// Connecting with the incoming caller's signal
    connectionRef.current = peer;
  };

    // Function to leave the call
  const leaveCall = async() => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();// Destroying the peer connection
      connectionRef.current = null;
    }
    setCallAccepted(false);
    setReceivingCall(false);
    setCaller("");
    setCallerSignal(null);
    if (userVideo.current) {
      userVideo.current.srcObject = null; // Stopping the video stream
    }
    if (role === 'mentor') { // Navigating away based on role
      console.log("Role",role)
      try {
        const response = await axios.put(`${BACKEND_URL}/sessions/session-complete/${safeToken}`)
        console.log(response.data)
        toast.success(response.data.message)
      } catch (error) {
        console.log("Error updating session status",error)
        toast.error("Error updating session status")
      }
      navigate('/');
    } else {
      navigate(`/feedback/${safeToken}`);
    }
    
  };

    // Toggling mute on the audio stream
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

    // Toggling video on the video stream

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

  const handleBlockUser = async() => {
    try {
      const response = await axios.put(`${BACKEND_URL}/sessions/block/${safeToken}`)
      console.log(response.data)
      toast.success(response.data.message)
    } catch (error) {
      console.log("Error Blocking Mentee", error);
      toast.error("Error Blocking Mentee");
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen flex">
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
              <span className="text-white">Waiting for user to join...</span>
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
            </>
          ) : (
            role === 'mentor' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => callUser(idToCall)}
                startIcon={<VideoCallIcon />}
              >
                Call Now
              </Button>
            )
          )}
           <Button
                variant="contained"
                color="error"
                onClick={leaveCall}
                startIcon={<CallEndIcon />}
              >
                End Call
          </Button>
          {role === "mentor" && (
            <Button onClick={handleBlockUser} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
              BlockUser
            </Button>
          )}

        </div>

        {receivingCall && !callAccepted && (
          <div className="mt-4 text-center">
            <h2 className="text-white mb-1">User is calling...</h2>
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

      <div className="w-1/5 bg-gray-800 p-4 text-white flex flex-col">
        <h3 className="text-center mb-2 underline">Room: 0ne-one</h3>
        <h4 className="mb-4">Role: {role}</h4>

        {role === "mentor" ? (
          <h5>Mentor: {mentorName}</h5>
        ) : (
          <h5>Mentee: {menteeName}</h5>
        )}

        <div className="h-[70vh] overflow-y-auto border-b border-gray-600 p-2 space-y-2">
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

        <div className="flex items-center gap-2">
          <TextField
            fullWidth
            variant="outlined"
            label="Type a message"
            value={message}
            onChange={handleInputChange}
            className="mr-2"
            size="small"
            InputLabelProps={{
              style: { color: 'white' }
            }}
            InputProps={{
              style: { color: 'white', borderColor: 'white' },
              classes: {
                notchedOutline: 'white-outline'
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white'
                },
                '&:hover fieldset': {
                  borderColor: 'white'
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white'
                }
              }
            }}
          />

          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <ChatIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
