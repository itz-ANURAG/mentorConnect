import React, { useState } from "react";
import Navbar from '../components/Navbar'
import Footer from "../components/footer";


const BookedSessions = () => {
    // Example session data
    const [sessions, setSessions] = useState([
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
      { id: 1, mentee: "John Doe", dateTime: "2024-10-21T14:00" },
      { id: 2, mentee: "Jane Smith", dateTime: "2024-10-22T16:00" },
      { id: 3, mentee: "Alice Johnson", dateTime: "2024-10-23T10:00" },
    ]);
  
    // State for filtering
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filterVisible, setFilterVisible] = useState(false); // To toggle the dropdown
  
    // Function to filter sessions based on date range
    const filterSessions = () => {
      if (!startDate || !endDate) return sessions;
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      return sessions.filter((session) => {
        const sessionDate = new Date(session.dateTime);
        return sessionDate >= start && sessionDate <= end;
      });
    };
  
    // Cancel session function
    const cancelSession = (id) => {
      setSessions(sessions.filter((session) => session.id !== id));
    };
  
    return (
      <div className="container mx-auto p-6 bg-white min-h-screen">
        <h2 className="text-5xl font-extrabold text-gray-900 text-center mb-8">
          Booked Sessions
        </h2>
  
        {/* Filter Dropdown */}
        <div className="mb-6 flex justify-end items-end">
          <div className="relative">
            <button
              onClick={() => setFilterVisible(!filterVisible)}
              className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-300 ease-in-out"
            >
              Filter By
            </button>
            {filterVisible && (
              <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                <div className="mb-4">
                  <label className="block text-gray-700">Start Date:</label>
                  <input
                    type="datetime-local"
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">End Date:</label>
                  <input
                    type="datetime-local"
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
  
        {/* Table for displaying filtered sessions */}
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white text-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-900">
              <tr className="text-left">
                <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider">
                  S. No.
                </th>
                <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider">
                  Mentee
                </th>
                <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider">
                  Date Time
                </th>
                <th className="py-4 px-6 text-sm font-semibold uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filterSessions().length > 0 ? (
                filterSessions().map((session, index) => (
                  <tr
                    key={session.id}
                    className="bg-white hover:bg-gray-100 transition duration-300 ease-in-out"
                  >
                    <td className="py-4 px-6 border-b border-gray-200">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      {session.mentee}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      {session.dateTime.replace("T", " ")} {/* Format datetime */}
                    </td>
                    <td className="py-4 px-6 border-b border-gray-200">
                      <button
                        className="bg-gray-800 text-white font-bold py-2 px-4 rounded-md shadow-md transform hover:scale-105 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-300 ease-in-out"
                        onClick={() => cancelSession(session.id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="py-4 px-6 text-center text-gray-600 font-semibold"
                  >
                    No sessions found for the selected date range.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

export default BookedSessions;
