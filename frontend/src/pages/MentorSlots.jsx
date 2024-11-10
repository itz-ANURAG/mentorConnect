import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Modal,
  Pagination,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../stylesheets/MentorSlots.css";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../slices/authSlice";
import { CustomSpinner } from "../components/CustomSpinner";

const MentorSlots = () => {
  const loading = useSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [slots, setSlots] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [slotsPerPage] = useState(10);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

    const token = useSelector((state) => state.auth.token);
    const role = useSelector((state) => state.auth.role);
    const menteeId = useSelector((state) => state.mentee.data?._id || state.mentee.data?.id);
    const [toastShown, setToastShown] = useState(false); // To avoid duplicate toasts

  const fetchSlots = async () => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `http://localhost:3000/mentors/${id}/normalfree-slots`
      );
      if (response.data.success) {
        setSlots(response.data.data);
      } else {
        throw new Error("Failed to fetch slots");
      }
    } catch (err) {
      setError("Failed to fetch slots");
      toast.error("Failed Fetching FreeSlots");
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    if (!token || role !== "mentee") {
      toast.error("Please log in as a mentee to book a session");
      navigate("/login");
      return;
    }
    fetchSlots();
  }, [id, token, role, navigate]);

  const filteredSlots = slots.filter(
    (slot) =>
      (!searchDate || slot.date.includes(searchDate)) &&
      (!searchTime || slot.time.includes(searchTime))
  );

  const indexOfLastSlot = currentPage * slotsPerPage;
  const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
  const currentSlots = filteredSlots.slice(indexOfFirstSlot, indexOfLastSlot);

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleBookSlot = (slot) => {
    setSelectedSlot(slot);
    setBookingModalOpen(true);
  };

  const handleCloseBookingModal = () => setBookingModalOpen(false);

  const handleConfirmBooking = async () => {
    dispatch(setLoading(true));
  
    try {
      // First booking request (for the first session)
      const response = await axios.post(
        `http://localhost:3000/sessions/${id}/book`,
        {
          date: selectedSlot.date,
          time: selectedSlot.time,
          session_type: "one-on-one",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Show success message for first booking
      //toast.success("Session Booked Successfully for the first session");
  
      // Attempt second booking request (for the second session with JWT)
      try {
        const secondResponse = await axios.post(
          `http://localhost:3000/video/book`,
          {
            mentorId: id,
            menteeId: menteeId,
            date: selectedSlot.date,
            time: selectedSlot.time,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        // Only handle response if data exists
        if (secondResponse?.data?.token) {
          console.log("JWT Token:", secondResponse.data.token);
          toast.success("Session Booked Successfully with JWT");
        } else {
          // If no data is returned, assume success and proceed without error
          console.log("Second booking request completed with no response data");
        }
  
        // Fetch updated slots after both bookings
        fetchSlots();
      } catch (secondError) {
        console.warn("Second booking request had no response data or failed:", secondError);
        // Optionally, show a message if desired, but not marking as failure
      }
  
      // Close the modal after both bookings are processed
      setBookingModalOpen(false);
  
    } catch (error) {
      // Catch errors for the first request only
      console.error("First booking error:", error);
      toast.error("Booking Failed: Server Error");
      setError('Failed to book the slot. Please try again.');
    } finally {
      dispatch(setLoading(false)); // Ensure loading state is reset even if an error occurs
    }
  };
  

  useEffect(() => {
    if (!token || role !== 'mentee') {
        if (!toastShown) {
            toast.error('Please log in as a mentee to book a session');
            setToastShown(true);
        }
        navigate('/login');
        return;
    }
    fetchSlots();
}, [id, token, role, navigate, toastShown]);

  return (
    <>
      {loading ? (
        <CustomSpinner />
      ) : (
        <div className="p-4 bg-gray-100 text-gray-900">
          <h2 className="text-2xl font-bold mb-4">Available Slots</h2>

          {error && <p className="text-red-500">{error}</p>}

          {/* Search Bar */}
          <div className="flex gap-6 mb-4">
            <TextField
              label="Search by Date"
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              margin="dense"
              onChange={(e) => setSearchDate(e.target.value)}
              style={{ width: "200px" }} // Increase width
            />
            <TextField
              label="Search by Time"
              type="time"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              margin="dense"
              onChange={(e) => setSearchTime(e.target.value)}
              style={{ width: "200px" }} // Increase width
            />
          </div>

          {/* Slots Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentSlots.map((slot, index) => (
                  <TableRow key={index}>
                    <TableCell>{slot.date}</TableCell>
                    <TableCell>{slot.time}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBookSlot(slot)}
                        style={{ marginLeft: "10px" }}
                      >
                        Book Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Pagination
            count={Math.ceil(filteredSlots.length / slotsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            className="mt-4"
          />

          {/* Booking Modal */}
          <Modal open={bookingModalOpen} onClose={handleCloseBookingModal}>
            <div className="modal-content p-4">
              <h3>Confirm Booking</h3>
              <p>Date: {selectedSlot?.date}</p>
              <p>Time: {selectedSlot?.time}</p>

              {/* Button Container with Spacing */}
              <div className="flex gap-4 mt-4">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleConfirmBooking}
                >
                  Confirm
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCloseBookingModal}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export default MentorSlots;
