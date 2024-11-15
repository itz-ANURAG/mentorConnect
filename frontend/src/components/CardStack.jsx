import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";

const JobCard = ({ postId, username, content, imageUrl, timestamp, likes, dislikes, comments }) => {
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [currentDislikes, setCurrentDislikes] = useState(dislikes);
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState(false); // Track visibility of comments
  const [newComment, setNewComment] = useState(""); // Track new comment input
  const [commentList, setCommentList] = useState(comments); // Initialize with the comments passed as props
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5); // Track the number of visible comments
  const role = useSelector((state) => state.auth.role);
  const menteeData = useSelector((state) => state.mentee.data);
  const mentorData = useSelector((state) => state.mentor.data);

  let userId, user;
  if (role != null) {
    // Check if the user data exists
    userId = role === "mentee"
      ? useSelector((state) => state.mentee.data._id || state.mentee.data.id)
      : useSelector((state) => state.mentor.data._id);

    user = role === 'mentee'
      ? useSelector((state) => state.mentee.data.firstName + (state.mentee.data?.lastName||''))
      : useSelector((state) => state.mentor.data.name);
  }

  // Truncate content logic
  const truncatedContent =
    content.length > 150 && !showMore ? `${content.slice(0, 150)}...` : content;

  // Handle like click
  const handleLike = async () => {
    try {
      if (!role) {
        toast("Login first to like and dislike");
        return;
      }
      const response = await axios.post(`http://localhost:3000/generalPost/likes`, {
        role,
        userId,
        postId,
      });
      if (response.data.success) {
        toast.success("Post Liked");
        setCurrentLikes(currentLikes + 1);
        if (response.data.already) setCurrentDislikes(currentDislikes - 1);
      } else {
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Handle dislike click
  const handleDislike = async () => {
    try {
      if (!role) {
        toast("Login first to like and dislike");
        return;
      }
      const response = await axios.post(`http://localhost:3000/generalPost/dislikes`, {
        role,
        userId,
        postId,
      });
      if (response.data.success) {
        toast.success(`${response.data.message}`);
        setCurrentDislikes(currentDislikes + 1);
        if (response.data.already) setCurrentLikes(currentLikes - 1);
      } else {
        toast.error(`${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating dislikes:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!newComment) {
      toast.error("Comment cannot be empty");
      return;
    }
    if (!role) {
      toast("Login first to like and dislike");
      return;
    }
    try {
      console.log("username" ,username)
      const response = await axios.post(`http://localhost:3000/generalPost/comments`, {
        role,
        userId,
        postId,
        comment: newComment,
        username: user,
      });

      if (response.data.success) {
        setCommentList([...commentList, response.data.comment]); // Add new comment to the list
        setNewComment(""); // Clear the input field
        toast.success("Comment posted");
      } else {
        toast.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  // Load more comments handler
  const handleLoadMoreComments = () => {
    setVisibleCommentsCount(visibleCommentsCount + 5); // Show 5 more comments
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 flex flex-col justify-between items-center m-4"
      style={{
        width: "70%", // Card width: 40% of the page
        height: "auto", // Allow card to grow with content, preventing overlap
        margin: "5px auto", // Add margin between cards for spacing
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* User Information (Top Section) */}
      <div className="w-full flex justify-start items-center mb-2">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center mr-2">
          <span className="text-white text-xl">U</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{username}</h4>
          <p className="text-gray-500 text-xs">{new Date(timestamp).toLocaleString()}</p>
        </div>
      </div>

      {/* Post Content (Above Image) */}
      <div className="text-center w-full mb-4 flex-grow">
        <p className="text-gray-700 text-sm">
          {truncatedContent}
          {content.length > 150 && (
            <button
              className="text-blue-600 hover:underline ml-2"
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show Less" : "Show More"}
            </button>
          )}
        </p>
      </div>

      {/* Post Image (Middle Section) */}
      {imageUrl && (
        <div className="w-full flex justify-center mb-4 relative">
          <img
            src={imageUrl}
            alt="Post"
            className="w-full h-full object-cover rounded-lg"
            style={{ maxHeight: "60%" }} // Adjust image size to take up remaining space
          />
        </div>
      )}

      {/* Likes, Dislikes, and Comments (Bottom Section) */}
      <div className="w-full flex justify-between items-center mt-4">
        <button className="text-sm text-gray-600" onClick={handleLike}>
          👍 {currentLikes}
        </button>
        <button className="text-sm text-gray-600" onClick={handleDislike}>
          👎 {currentDislikes}
        </button>
        <button
          className="text-sm text-gray-600"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {commentList.length} Comments
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="w-full mt-4">
          <div className="mb-4">
            {commentList.slice(0, visibleCommentsCount).map((comment, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg mb-4 flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex justify-center items-center mr-3">
                  <span className="text-white text-xl">{comment.username.charAt(0)}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold text-gray-800 mr-2">{comment.username}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Comments Button */}
          {commentList.length > visibleCommentsCount && (
            <div className="text-center mt-4">
              <button
                className="bg-blue-500 text-white p-2 rounded-lg"
                onClick={handleLoadMoreComments}
              >
                Load More Comments
              </button>
            </div>
          )}

          {/* Comment Input and Submit */}
          <div className="flex items-center mt-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="border p-2 rounded-lg w-full"
              placeholder="Write a comment..."
            />
            <button
              onClick={handleCommentSubmit}
              className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
