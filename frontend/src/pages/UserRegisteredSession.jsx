/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NavbarLandingPage from "../components/NavbarLandingPage";
import axios from "axios";
import { setLoading } from "../slices/authSlice";
import { CustomSpinner } from "../components/CustomSpinner";

const RegisteredSessions = () => {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const [menteeData, setMenteeData] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const role = useSelector((state) => state.auth.role);
  const menteeId = useSelector((state) => state.mentee.data._id);

  useEffect(() => {
    const fetchMenteeData = async () => {
      dispatch(setLoading(true));
      if (role === "mentee") {
        try {
          const response = await axios.get(`http://localhost:3000/mentee/${menteeId}`);
          const sortedSessions = response.data.mentee.bookedSessions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setMenteeData({
            ...response.data.mentee,
            bookedSessions: sortedSessions,
          });
        } catch (error) {
          console.error("Error fetching mentee details:", error);
          setError("Error fetching mentee details");
        } finally {
          dispatch(setLoading(false));
        }
      }
    };
    fetchMenteeData();
  }, [role, menteeId, dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setUpcomingPage(1);
    setHistoryPage(1);
  };

  const today = new Date();
  const upcomingSessions = menteeData?.bookedSessions.filter(
    (session) => new Date(session.date) >= today
  ).filter(session =>
    session.mentorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const historySessions = menteeData?.bookedSessions.filter(
    (session) => new Date(session.date) < today
  ).filter(session =>
    session.mentorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for upcoming sessions
  const totalPagesUpcoming = Math.ceil((upcomingSessions?.length || 0) / itemsPerPage);
  const paginatedUpcomingSessions = upcomingSessions?.slice(
    (upcomingPage - 1) * itemsPerPage,
    upcomingPage * itemsPerPage
  );

  // Pagination for history sessions
  const totalPagesHistory = Math.ceil((historySessions?.length || 0) / itemsPerPage);
  const paginatedHistorySessions = historySessions?.slice(
    (historyPage - 1) * itemsPerPage,
    historyPage * itemsPerPage
  );

  const handleUpcomingPageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPagesUpcoming) {
      setUpcomingPage(newPage);
    }
  };

  const handleHistoryPageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPagesHistory) {
      setHistoryPage(newPage);
    }
  };

  return (
    <>
      {loading ? (
        <CustomSpinner />
      ) : (
        <>
          <NavbarLandingPage />
          <div className="bg-gray-100 min-h-screen w-full p-6">
            <div className="bg-white rounded-lg shadow-lg max-w-full mx-auto p-5">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Registered Sessions
              </h2>
              <input
                type="text"
                placeholder="Search by Mentor Name"
                value={searchTerm}
                onChange={handleSearch}
                className="mb-4 p-2 border border-gray-300 rounded-md w-full"
              />

              <div className="flex flex-col lg:flex-row lg:space-x-8">
                {/* Upcoming Sessions */}
                <div className="lg:w-1/2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Sessions</h3>
                  <div className="overflow-x-auto">
                    {paginatedUpcomingSessions && paginatedUpcomingSessions.length > 0 ? (
                      <table className="min-w-full bg-gray-50 border border-gray-200 rounded-lg">
                        <thead className="bg-indigo-500 text-white">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                              Mentor Name
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                              Mentor Email
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                              Time
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedUpcomingSessions.map((session, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-indigo-100" : "bg-indigo-50"}>
                              <td className="px-6 py-4 text-gray-700">{session.mentorName}</td>
                              <td className="px-6 py-4 text-gray-700">{session.mentorEmail}</td>
                              <td className="px-6 py-4 text-gray-700">{session.time}</td>
                              <td className="px-6 py-4 text-gray-700">{session.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-700 text-center">No upcoming sessions found.</p>
                    )}
                  </div>

                  {/* Upcoming Pagination controls */}
                  <div className="flex justify-center items-center mt-4">
                    <button
                      onClick={() => handleUpcomingPageChange(upcomingPage - 1)}
                      disabled={upcomingPage === 1}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-l-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 bg-gray-200 text-gray-700">
                      Page {upcomingPage} of {totalPagesUpcoming}
                    </span>
                    <button
                      onClick={() => handleUpcomingPageChange(upcomingPage + 1)}
                      disabled={upcomingPage === totalPagesUpcoming}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-r-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* History Sessions */}
                <div className="lg:w-1/2 mt-8 lg:mt-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">History Sessions</h3>
                  <div className="overflow-x-auto">
                    {paginatedHistorySessions && paginatedHistorySessions.length > 0 ? (
                      <table className="min-w-full bg-gray-50 border border-gray-200 rounded-lg">
                        <thead className="bg-indigo-500 text-white">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                              Mentor Name
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                              Mentor Email
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                              Time
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedHistorySessions.map((session, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-indigo-100" : "bg-indigo-50"}>
                              <td className="px-6 py-4 text-gray-700">{session.mentorName}</td>
                              <td className="px-6 py-4 text-gray-700">{session.mentorEmail}</td>
                              <td className="px-6 py-4 text-gray-700">{session.time}</td>
                              <td className="px-6 py-4 text-gray-700">{session.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-gray-700 text-center">No history sessions found.</p>
                    )}
                  </div>

                  {/* History Pagination controls */}
                  <div className="flex justify-center items-center mt-4">
                    <button
                      onClick={() => handleHistoryPageChange(historyPage - 1)}
                      disabled={historyPage === 1}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-l-md disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 bg-gray-200 text-gray-700">
                      Page {historyPage} of {totalPagesHistory}
                    </span>
                    <button
                      onClick={() => handleHistoryPageChange(historyPage + 1)}
                      disabled={historyPage === totalPagesHistory}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-r-md disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RegisteredSessions;
