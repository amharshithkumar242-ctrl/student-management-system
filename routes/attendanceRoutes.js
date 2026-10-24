const express = require('express');

const router = express.Router();

const attendanceController =
require('../controllers/attendanceController');

const {
    isAuthenticated
} = require('../middleware/authMiddleware');

router.get(
    '/',
    isAuthenticated,
    attendanceController.listAttendance
);

router.get(
    '/mark',
    isAuthenticated,
    attendanceController.showMarkAttendance
);

router.post(
    '/mark',
    isAuthenticated,
    attendanceController.markAttendance
);

router.get(
    '/report',
    isAuthenticated,
    attendanceController.attendanceReport
);

module.exports = router;