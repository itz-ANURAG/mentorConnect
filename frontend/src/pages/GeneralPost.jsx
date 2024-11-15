import React, { useEffect, useState } from "react";
import Navbar from "../components/NavbarLandingPage";
import Footer from "../components/footer";
import CardStack from "../components/CardStack"; // Import JobCard component
import axios from "axios";
import toast from "react-hot-toast";

const GeneralPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/generalPost/getAllPost");
        setPosts(response.data.posts); // Assuming API returns posts in `response.data.posts`
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Error while fetching posts");
      } finally {
        setLoading(false); // Stop loading once fetch is complete
      }
    };

    fetchPosts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 py-10">
        {loading ? (
          <p className="text-gray-600 text-lg">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-600 text-lg">No posts available</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <CardStack
                key={post._id}
                username={post.username}
                content={post.content}
                imageUrl={post.imageUrl}
                timestamp={post.timestamp}
                likes={post.likes.length}
                dislikes={post.disLikes.length}
                postId = {post._id}
                comments={post.comments}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default GeneralPost;
