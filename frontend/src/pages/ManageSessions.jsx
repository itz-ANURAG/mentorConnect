import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { setLoading } from "../slices/authSlice";
import { CustomSpinner } from "../components/CustomSpinner";

const ManageSessions = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const loading = useSelector((state) => state.auth.loading);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
    const [search, setSearch] = useState("");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchSessions = async () => {
      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          `${BACKEND_URL}/sessions/${id}/sessions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSessions(response.data.data);
      } catch (error) {
        console.error("Failed to fetch sessions:", error);
        toast.error("Error fetching sessions");
      }
      dispatch(setLoading(false));
    };

    fetchSessions();
  }, [id, token, dispatch]);

  const handleCancel = async (sessionId) => {
    dispatch(setLoading(true));
    try {
      await axios.delete(
        `${BACKEND_URL}/sessions/${id}/cancel-session/${sessionId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSessions((prev) =>
        prev.filter((session) => session.sessionId !== sessionId)
      );
      toast.success("Session canceled successfully.");
    } catch (error) {
      console.error("Error canceling session:", error);
      toast.error("Failed to cancel the session.");
    }
    dispatch(setLoading(false));
  };

    const handleToggleBlock = async (session) => {
    const isBlocked = session.isBlocked;
    const url = isBlocked
        ? `${BACKEND_URL}/sessions/manageSession/unblock-mentee`
        : `${BACKEND_URL}/sessions/manageSession/block-mentee`;

    try {
        const response = await axios.put(
            url,
            { sessionId: session.sessionId, menteeId: session.menteeId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        toast.success(response.data.message);

        // Update the session list to reflect the new block status
        setSessions((prev) =>
            prev.map((s) =>
                s.menteeId === session.menteeId
                    ? { ...s, isBlocked: !isBlocked }
                    : s
            )
        );
    } catch (error) {
        console.error('Error toggling block status:', error.message);
        toast.error(
            isBlocked
                ? 'Failed to unblock the mentee.'
                : 'Failed to block the mentee.'
        );
    }
};


  const filteredSessions = sessions.filter((session) =>
    session.menteeName.toLowerCase().includes(search.toLowerCase())
  );

  const displaySessions = filteredSessions.filter(
    (session) => session.status === activeTab
  );

  return (
    <div className="p-8 bg-gray-800 text-white rounded shadow">
      {loading ? (
        <CustomSpinner />
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-6 text-center">Sessions</h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by mentee name"
              className="w-full p-3 bg-gray-700 rounded text-white focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex justify-center mb-6">
            <button
              className={`p-2 mx-2 rounded ${
                activeTab === "upcoming" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming Sessions
            </button>
            <button
              className={`p-2 mx-2 rounded ${
                activeTab === "completed" ? "bg-blue-600" : "bg-gray-700"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Completed Sessions
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-700 text-left rounded-lg">
              <thead className="bg-gray-900">
                <tr>
                  <th className="p-3 border-b">Mentee Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Time</th>
                  <th className="p-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {displaySessions.length > 0 ? (
                     displaySessions.map((session) => (
                    <tr key={session.sessionId}>
                      <td className="p-3">{session.menteeName}</td>
                      <td className="p-3">{session.menteeEmail}</td>
                      <td className="p-3">
                        {new Date(session.date).toLocaleDateString()}
                      </td>
                      <td className="p-3">{session.time}</td>
                      <td className="p-3">
                        {activeTab === "upcoming" ? (
                          <button
                            className="bg-red-600 p-2 rounded hover:bg-red-700"
                            onClick={() => handleCancel(session.sessionId)}
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            className={`p-2 rounded ${
                              session.isBlocked
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-yellow-600 hover:bg-yellow-700"
                            }`}
                            onClick={() => handleToggleBlock(session)}
                          >
                            {session.isBlocked ? "Unblock" : "Block"}
                          </button>
                        )}
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
        </>
      )}
    </div>
  );
};

export default ManageSessions;
