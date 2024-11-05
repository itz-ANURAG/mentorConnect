/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSelector ,useDispatch} from "react-redux";
import NavbarLandingPage from "../components/NavbarLandingPage";
import axios from "axios";
import { setLoading } from "../slices/authSlice";
import { CustomSpinner } from "../components/CustomSpinner";

const RegisteredSessions = () => {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const [menteeData, setMenteeData] = useState(null); // State for mentee data
  const [error, setError] = useState(null); // State for error handling
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [itemsPerPage] = useState(5); // Number of items per page
  const role = useSelector((state) => state.auth.role); // Get role from Redux
  const menteeId = useSelector((state) => state.mentee.data._id); // Mentee ID from Redux

  useEffect(() => {
    const fetchMenteeData = async () => {
      dispatch(setLoading(true));
      if (role === "mentee") {
        try {
          const response = await axios.get(
            `http://localhost:3000/mentee/${menteeId}`
          );
          const sortedSessions = response.data.mentee.bookedSessions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          ); // Sort sessions by date in descending order
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
  }, [role, menteeId,dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Filter and paginate sessions
  const filteredSessions = menteeData?.bookedSessions.filter((session) =>
    session.mentorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil((filteredSessions?.length || 0) / itemsPerPage);

  const paginatedSessions = filteredSessions?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
            <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto p-6">
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
              <div className="overflow-x-auto">
                {paginatedSessions && paginatedSessions.length > 0 ? (
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
                      {paginatedSessions.map((session, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? "bg-indigo-100" : "bg-indigo-50"
                          }
                        >
                          <td className="px-6 py-4 text-gray-700">
                            {session.mentorName}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {session.mentorEmail}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {session.time}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            {session.date}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-700 text-center">
                    No registered sessions found.
                  </p>
                )}
              </div>

              {/* Pagination controls */}
              <div className="flex justify-center items-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-l-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-gray-200 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-r-md disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default RegisteredSessions;
