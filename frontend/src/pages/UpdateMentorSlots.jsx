import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Modal, Pagination } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const UpdateMentorSlots = () => {
    const { id } = useParams();
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [slotsPerPage] = useState(10);
    const [slotModalOpen, setSlotModalOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();
    const token = useSelector((state) => state.auth.token);

    const fetchSlots = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/mentors/${id}/free-slots`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSlots(response.data.data);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login');
            }
            toast.error('Failed Fetching Free Slots');
        }
    };

    useEffect(() => {
        fetchSlots();
    }, [id]);

    const handleOpenModal = (slot) => {
        setEditing(!!slot);
        if (slot) {
            setDate(slot.date.split('T')[0]); // Set the date input to the ISO date string in 'yyyy-MM-dd'
            setTime(slot.time);
            setSelectedSlot(slot);
        } else {
            setDate('');
            setTime('');
            setSelectedSlot(null);
        }
        setSlotModalOpen(true);
    };

    const handleCloseModal = () => setSlotModalOpen(false);

    const handleSaveSlot = async () => {
        try {
            const slotData = {
                date: new Date(date).toISOString(), // Ensure date is in ISO format
                time,
            };

            if (editing && selectedSlot) {
                // Update existing slot
                await axios.put(
                    `http://localhost:3000/mentors/${id}/free-slots/${selectedSlot._id}`,
                    slotData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Slot updated successfully');
            } else {
                // Add new slot
                await axios.post(
                    `http://localhost:3000/mentors/${id}/free-slots`,
                    slotData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Slot added successfully');
            }
            fetchSlots();
            handleCloseModal();
        } catch (error) {
            toast.error('Failed to save slot');
        }
    };

    const handleDeleteSlot = async (slotId) => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/mentors/${id}/free-slots/${slotId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                toast.success('Slot deleted successfully');
                fetchSlots(); // Refresh the slots list after deletion
            } else {
                toast.error('Failed to delete slot');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete slot');
        }
    };

    // Pagination logic
    const indexOfLastSlot = currentPage * slotsPerPage;
    const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
    const currentSlots = slots.slice(indexOfFirstSlot, indexOfLastSlot);
    const totalPages = Math.ceil(slots.length / slotsPerPage);

    return (
        <div style={{ padding: '20px' }}>
            <Button variant="contained" onClick={() => handleOpenModal(null)} style={{ marginBottom: '20px' }}>
                Add Slot
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Time</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentSlots.map((slot) => (
                            <TableRow key={slot._id}>
                                <TableCell>{new Date(slot.date).toLocaleDateString()}</TableCell>
                                <TableCell>{slot.time}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpenModal(slot)} style={{ marginRight: '10px' }}>Edit</Button>
                                    <Button color="secondary" onClick={() => handleDeleteSlot(slot._id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} style={{ marginTop: '20px' }} />

            <Modal open={slotModalOpen} onClose={handleCloseModal}>
                <div className="modal-content" style={{ padding: '20px', width: '400px', margin: 'auto', marginTop: '100px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                    <h2 style={{ marginBottom: '20px' }}>{editing ? 'Edit Slot' : 'Add Slot'}</h2>
                    <TextField
                        label="Date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        style={{ marginBottom: '20px' }}
                    />
                    <TextField
                        label="Time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        style={{ marginBottom: '20px' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" onClick={handleSaveSlot}>{editing ? 'Update' : 'Add'}</Button>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default UpdateMentorSlots;
