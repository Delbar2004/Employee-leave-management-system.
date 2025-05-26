import React, { useState } from 'react';
import axios from 'axios';

const LeaveRequestForm = () => {
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Submit leave request
        await axios.post('/api/leaves', { leaveType, startDate, endDate });
        // Handle response
    };

    return (
        <form onSubmit={handleSubmit}>
            <select onChange={(e) => setLeaveType(e.target.value)}>
                <option value="">Select Leave Type</option>
                <option value="sick">Sick Leave</option>
                <option value="vacation">Vacation</option>
            </select>
            <input type="date" onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" onChange={(e) => setEndDate(e.target.value)} />
            <button type="submit">Submit Leave Request</button>
        </form>
    );
};

export default LeaveRequestForm; 