const express = require('express');

const router = express.Router();

const studentController =
require('../controllers/studentController');

const {
    isAuthenticated
} = require('../middleware/authMiddleware');

router.get(
    '/',
    isAuthenticated,
    studentController.getStudents
);

router.get(
    '/add',
    isAuthenticated,
    studentController.showAddStudent
);

router.post(
    '/add',
    isAuthenticated,
    studentController.createStudent
);

router.get(
    '/edit/:id',
    isAuthenticated,
    studentController.showEditStudent
);

router.post(
    '/edit/:id',
    isAuthenticated,
    studentController.updateStudent
);

router.get(
    '/search',
    isAuthenticated,
    studentController.searchStudents
);

router.post(
    '/toggle-status/:id',
    isAuthenticated,
    studentController.toggleStatus
);

module.exports = router;