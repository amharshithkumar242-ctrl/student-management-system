const express = require('express');

const router = express.Router();

const leaveController =
require('../controllers/leaveController');

const {
    isAuthenticated
} = require('../middleware/authMiddleware');

router.get(
    '/',
    isAuthenticated,
    leaveController.listLeaveApplications
);

router.get(
    '/apply',
    isAuthenticated,
    leaveController.showLeaveForm
);

router.post(
    '/apply',
    isAuthenticated,
    leaveController.applyLeave
);

router.post(
    '/approve/:id',
    isAuthenticated,
    leaveController.approveLeave
);

router.post(
    '/reject/:id',
    isAuthenticated,
    leaveController.rejectLeave
);

module.exports = router;