const express = require('express');

const router = express.Router();

const departmentController = require('../controllers/departmentController');

const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', departmentController.getDepartments);

router.get('/add', departmentController.showAddDepartment);

router.get('/', isAuthenticated, departmentController.getDepartments);

router.get('/add', isAuthenticated, departmentController.showAddDepartment);

router.get('/edit/:id', departmentController.showEditDepartment);

router.get('/edit/:id', isAuthenticated, departmentController.showEditDepartment);

router.post('/add', departmentController.createDepartment);

router.post('/add', isAuthenticated, departmentController.createDepartment);

router.post('/edit/:id', departmentController.updateDepartment);

router.post('/edit/:id', isAuthenticated, departmentController.updateDepartment);

router.post('/delete/:id', departmentController.deleteDepartment);

router.post('/delete/:id', isAuthenticated, departmentController.deleteDepartment);

module.exports = router;
