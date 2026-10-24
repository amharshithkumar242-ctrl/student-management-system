const db = require('../config/db');

// Show all departments
exports.getDepartments = async (req, res) => {
    try {
        const [departments] = await db.query(
            'SELECT * FROM departments ORDER BY department_id DESC'
        );

        res.render('departments/index', {
            departments
        });

    } catch (error) {
        console.error(error);
        res.send('Error loading departments');
    }
};

// Show Add Form
exports.showAddDepartment = (req, res) => {
    res.render('departments/add');
};

// Insert Department
exports.createDepartment = async (req, res) => {

    const { department_name, description } = req.body;

    try {

        await db.query(
            `INSERT INTO departments
            (department_name, description)
            VALUES (?, ?)`,
            [department_name, description]
        );

        res.redirect('/departments');

    } catch (error) {

        console.error(error);

        res.send('Unable to create department');
    }
};

// Edit Department
exports.showEditDepartment = async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] = await db.query(
            'SELECT * FROM departments WHERE department_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.send('Department not found');
        }

        res.render('departments/edit', {
            department: rows[0]
        });

    } catch (error) {

        console.error(error);
        res.send('Error loading department');
    }
};

// Update Department
exports.updateDepartment = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            department_name,
            description
        } = req.body;

        await db.query(
            `UPDATE departments
             SET department_name = ?,
                 description = ?
             WHERE department_id = ?`,
            [
                department_name,
                description,
                id
            ]
        );

        res.redirect('/departments');

    } catch (error) {

        console.error(error);
        res.send(error.message);
    }
};

// delete Department
exports.deleteDepartment = async (req, res) => {

    try {

        const id = req.params.id;

        await db.query(
            'DELETE FROM departments WHERE department_id = ?',
            [id]
        );

        res.redirect('/departments');

    } catch (error) {

        console.error(error);

        if (
            error.code === 'ER_ROW_IS_REFERENCED_2'
        ) {

            return res.send(
                'Cannot delete department. Students are linked to it.'
            );
        }

        res.send(error.message);
    }
};