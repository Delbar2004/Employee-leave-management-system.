const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// Create a leave request
router.post('/', async (req, res) => {
    const { userId, leaveType, startDate, endDate } = req.body;
    const leave = new Leave({ userId, leaveType, startDate, endDate });
    await leave.save();
    res.status(201).send(leave);
});

// ... other CRUD operations

module.exports = router; 