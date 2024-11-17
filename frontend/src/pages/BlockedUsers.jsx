import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const BlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Number of users per page
  const token = useSelector((state) => state.auth.token);

  // Fetch all blocked users from the backend
  const fetchBlockedUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/mentors/blocked/mentees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
      setBlockedUsers(response.data.mentees);
      setFilteredUsers(response.data.mentees); // Initially, all users are shown
    } catch (error) {
        console.error("Error fetching blocked users:", error);
        toast.error("Error fetching blocked users");
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter users based on search query
    const filtered = blockedUsers.filter((user) =>
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when searching
    };
    
    const unblockUser = async (userId) => {
    try {
        const response = await axios.delete(
            `http://localhost:3000/mentors/unblock/${userId}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        // Update state to remove the unblocked user
        setBlockedUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
        );
        setFilteredUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
        );

        toast.success(response.data.message);
    } catch (error) {
        console.error("Error unblocking user:", error);
        toast.error("Failed to unblock user. Please try again.")
    }
};


  // Pagination logic
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-teal-600">Blocked Users</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Blocked Users List */}
      <div className="bg-white shadow rounded-lg">
        {paginatedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between border-b border-gray-200 p-4"
          >
            <div className="flex items-center">
              <img
                src={user.profilePicture || "/default-avatar.png"}
                alt={user.firstName}
                className="w-12 h-12 rounded-full border-2 border-teal-500 object-cover"
              />
              <div className="ml-4">
                <p className="font-medium text-gray-800">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg shadow hover:bg-red-600"
              onClick={() => unblockUser(user._id)}
            >
              Unblock
            </button>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
        </p>
        <button
          className="px-4 py-2 bg-teal-500 text-white rounded-lg disabled:opacity-50"
          disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BlockedUsers;
