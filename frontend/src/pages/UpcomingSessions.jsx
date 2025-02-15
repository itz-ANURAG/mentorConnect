/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import { setLoading } from "../slices/authSlice";
import { CustomSpinner } from "../components/CustomSpinner";

const UpcomingSessions = ({ mentorId }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const loading = useSelector((state) => state.auth.loading); // Redux selector to check if data is loading
  const dispatch = useDispatch();
  const [sessions, setSessions] = useState([]); // State to store upcoming sessions
  const [search, setSearch] = useState(""); // State for search input
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order (ascending by default)
  const [currentPage, setCurrentPage] = useState(1); // State for pagination (current page)
  const sessionsPerPage = 5; // Number of sessions per page
  const token = useSelector((state) => state.auth.token); // Token for authentication from Redux store
  const { id } = useParams(); // Gets mentor id from URL parameters

  // useEffect hook to fetch sessions on initial load or when id/token changes
  useEffect(() => {
    const fetchSessions = async () => {
      dispatch(setLoading(true)); // Dispatch loading action
      try {
        const response = await axios.get(
          `${BACKEND_URL}/sessions/${id}/upcoming-sessions`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Adding token to request headers for authorization
            },
          }
        );
        setSessions(response.data.data); // Set sessions from API response
      } catch (error) {
        console.error("Failed to fetch upcoming sessions:", error);
        toast.error("Error fetching UpcomingSessions"); // Show error toast on failure
      }
      dispatch(setLoading(false)); // Dispatch loading action to false after fetching data
    };

    fetchSessions();
  }, [id, token, dispatch]);

  // Function to cancel a session
  const cancelSession = async (sessionId) => {
    dispatch(setLoading(true)); // Dispatch loading action
    try {
      await axios.delete(
        `${BACKEND_URL}/sessions/${id}/cancel-session/${sessionId}` // Send delete request to cancel session
      );
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.sessionId !== sessionId) // Remove canceled session from the list
      );
      toast.success("Session canceled successfully."); // Show success toast
    } catch (error) {
      console.error("Failed to cancel session:", error);
      toast.error("Error canceling the session."); // Show error toast on failure
    }
    dispatch(setLoading(false)); // Dispatch loading action to false after canceling session
  };

  // Filter sessions by mentee name based on the search query
  const filteredSessions = sessions.filter((session) =>
    session.menteeName.toLowerCase().includes(search.toLowerCase())
  );

  // Sort sessions by date and time, based on the selected sort order
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    if (sortOrder === "asc") {
      return (
        new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time)
      );
    } else {
      return (
        new Date(b.date) - new Date(a.date) || b.time.localeCompare(a.time)
      );
    }
  });

  // Pagination logic
  const indexOfLastSession = currentPage * sessionsPerPage; // Index of the last session on the current page
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage; // Index of the first session on the current page
  const currentSessions = sortedSessions.slice(
    indexOfFirstSession,
    indexOfLastSession
  ); // Sessions to display on the current page
  const totalPages = Math.ceil(sortedSessions.length / sessionsPerPage); // Total number of pages

  // Function to change the current page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {loading ? (
        <CustomSpinner /> // Show loading spinner if data is being fetched
      ) : (
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Sessions</h2>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by mentee name"
              className="p-3 w-full bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearch(e.target.value)} // Set search query when user types
            />
          </div>

          {/* Sort Button */}
          <div className="mb-4 flex justify-end">
            <button
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} // Toggle sorting order
            >
              Sort by Date {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>

          {/* Sessions Table */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 text-left rounded-lg">
              <thead className="bg-gray-900">
                <tr>
                  <th className="border-b-2 p-3">Mentee Name</th>
                  <th className="border-b-2 p-3">Email</th>
                  <th className="border-b-2 p-3">Date</th>
                  <th className="border-b-2 p-3">Time</th>
                  <th className="border-b-2 p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentSessions.length > 0 ? (
                  currentSessions.map((session) => (
                    <tr
                      key={session.sessionId}
                      className="hover:bg-gray-700 transition duration-300"
                    >
                      <td className="p-3">{session.menteeName}</td>
                      <td className="p-3">{session.menteeEmail}</td>
                      <td className="p-3">
                        {new Date(session.date).toLocaleDateString()}
                      </td>
                      <td className="p-3">{session.time}</td>
                      <td className="p-3">
                        <button
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition duration-300"
                          onClick={() => cancelSession(session.sessionId)} // Cancel session when button is clicked
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">
                      No sessions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)} // Paginate when page number is clicked
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default UpcomingSessions;
