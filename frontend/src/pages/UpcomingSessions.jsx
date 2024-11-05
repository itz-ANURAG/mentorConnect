/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector ,useDispatch} from "react-redux";
import { useParams } from "react-router";
import { setLoading } from "../slices/authSlice";
import { CustomSpinner } from "../components/CustomSpinner";

const UpcomingSessions = ({ mentorId }) => {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const [sessions, setSessions] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // Ascending by default
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 5;
  const token = useSelector((state) => state.auth.token);
  const { id } = useParams();

  useEffect(() => {
    const fetchSessions = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          `http://localhost:3000/sessions/${id}/upcoming-sessions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSessions(response.data.data);
      } catch (error) {
        console.error("Failed to fetch upcoming sessions:", error);
        toast.error("Error fetching UpcomingSessions");
      }
      dispatch(setLoading(false));
    };

    fetchSessions();
  }, [id, token,dispatch]);

  // Cancel a session
  const cancelSession = async (sessionId) => {
    dispatch(setLoading(true));
    try {
      await axios.delete(
        `http://localhost:3000/sessions/${id}/cancel-session/${sessionId}`
      );
      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.sessionId !== sessionId)
      );
      toast.success("Session canceled successfully.");
    } catch (error) {
      console.error("Failed to cancel session:", error);
      toast.error("Error canceling the session.");
    }
    dispatch(setLoading(false));
  };

  // Filter, Sort, and Paginate sessions
  const filteredSessions = sessions.filter((session) =>
    session.menteeName.toLowerCase().includes(search.toLowerCase())
  );

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

  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = sortedSessions.slice(
    indexOfFirstSession,
    indexOfLastSession
  );
  const totalPages = Math.ceil(sortedSessions.length / sessionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      {loading ? (
        <CustomSpinner />
      ) : (
        <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Upcoming Sessions
          </h2>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by mentee name"
              className="p-3 w-full bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Sort Button */}
          <div className="mb-4 flex justify-end">
            <button
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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
                          onClick={() => cancelSession(session.sessionId)}
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
                onClick={() => paginate(index + 1)}
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
