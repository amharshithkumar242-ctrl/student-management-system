const db = require('../config/db');

exports.getStudents = async (req, res) => {

    try {

        const [students] =
        await db.query(
        `
        SELECT
            s.*,
            d.department_name
        FROM students s
        JOIN departments d
            ON s.department_id =
               d.department_id
        ORDER BY s.student_id DESC
        `);

        res.render(
            'students/index',
            { students }
        );

    } catch (error) {

        console.error(error);

        res.send(
        'Error loading students'
        );
    }
};

exports.showAddStudent =
async (req, res) => {

    try {

        const [departments] =
        await db.query(
        'SELECT * FROM departments'
        );

        res.render(
            'students/add',
            { departments }
        );

    } catch (error) {

        console.error(error);

        res.send(
        'Unable to load form'
        );
    }
};

exports.createStudent =
async (req, res) => {

    try {

        const {

            student_code,
            first_name,
            last_name,
            email,
            phone,
            department_id,
            batch_year,
            current_year

        } = req.body;

        await db.query(
        `
        INSERT INTO students
        (
            student_code,
            first_name,
            last_name,
            email,
            phone,
            department_id,
            batch_year,
            current_year
        )
        VALUES
        (
            ?,?,?,?,?,?,?,?
        )
        `,
        [
            student_code,
            first_name,
            last_name,
            email,
            phone,
            department_id,
            batch_year,
            current_year
        ]);

        res.redirect('/students');

    } catch (error) {

        console.error(error);

        res.send(error.message);
    }
};

exports.showEditStudent = async (req, res) => {

    try {

        const id = req.params.id;

        const [student] = await db.query(
            'SELECT * FROM students WHERE student_id = ?',
            [id]
        );

        const [departments] = await db.query(
            'SELECT * FROM departments'
        );

        res.render(
            'students/edit',
            {
                student: student[0],
                departments
            }
        );

    } catch (error) {

        console.error(error);
        res.send(error.message);
    }
};

exports.updateStudent = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            first_name,
            last_name,
            email,
            phone,
            department_id,
            batch_year,
            current_year
        } = req.body;

        await db.query(
        `
        UPDATE students
        SET
            first_name=?,
            last_name=?,
            email=?,
            phone=?,
            department_id=?,
            batch_year=?,
            current_year=?
        WHERE student_id=?
        `,
        [
            first_name,
            last_name,
            email,
            phone,
            department_id,
            batch_year,
            current_year,
            id
        ]
        );

        res.redirect('/students');

    } catch (error) {

        console.error(error);
        res.send(error.message);
    }
};

exports.searchStudents = async (req, res) => {

    try {

        const code =
        req.query.student_code || '';

        const department =
        req.query.department_id || '';

        let sql = `
        SELECT
            s.*,
            d.department_name
        FROM students s
        JOIN departments d
        ON s.department_id =
           d.department_id
        WHERE 1=1
        `;

        const params = [];

        if(code){

            sql +=
            ' AND s.student_code LIKE ?';

            params.push(`%${code}%`);
        }

        if(department){

            sql +=
            ' AND s.department_id = ?';

            params.push(department);
        }

        const [students] =
        await db.query(sql, params);

        const [departments] =
        await db.query(
            'SELECT * FROM departments'
        );

        res.render(
            'students/search',
            {
                students,
                departments
            }
        );

    } catch(error){

        console.error(error);
        res.send(error.message);
    }
};

exports.toggleStatus = async (req, res) => {

    try {

        const id = req.params.id;

        const [rows] =
        await db.query(
            'SELECT status FROM students WHERE student_id=?',
            [id]
        );

        const currentStatus =
        rows[0].status;

        const newStatus =
        currentStatus === 'Active'
        ? 'Inactive'
        : 'Active';

        await db.query(
        `
        UPDATE students
        SET status=?
        WHERE student_id=?
        `,
        [newStatus,id]
        );

        res.redirect('/students');

    } catch(error){

        console.error(error);
        res.send(error.message);
    }
};