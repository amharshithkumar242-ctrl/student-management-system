const db = require('../config/db');

exports.showMarkAttendance =
async (req,res) => {

    try {

        const [students] =
        await db.query(
        `
        SELECT
        student_id,
        student_code,
        first_name,
        last_name
        FROM students
        WHERE status='Active'
        `
        );

        res.render(
            'attendance/mark',
            { students }
        );

    } catch(error){

        console.error(error);
        res.send(error.message);
    }
};

exports.markAttendance =
async (req,res) => {

    try {

        const {
            student_id,
            status
        } = req.body;

        const today =
        new Date()
        .toISOString()
        .split('T')[0];

        const [existing] =
        await db.query(
        `
        SELECT *
        FROM attendance
        WHERE student_id=?
        AND attendance_date=?
        `,
        [student_id,today]
        );

        if(existing.length > 0){

            return res.send(
            'Attendance already marked today'
            );
        }

        await db.query(
        `
        INSERT INTO attendance
        (
            student_id,
            attendance_date,
            status
        )
        VALUES (?,?,?)
        `,
        [
            student_id,
            today,
            status
        ]
        );

        res.redirect('/attendance');

    } catch(error){

        console.error(error);

        res.send(error.message);
    }
};

exports.listAttendance =
async (req,res) => {

    try {

        const [attendance] =
        await db.query(
        `
        SELECT

        a.attendance_date,
        a.status,

        s.student_code,
        s.first_name,
        s.last_name

        FROM attendance a

        JOIN students s
        ON a.student_id =
        s.student_id

        ORDER BY
        a.attendance_date DESC
        `
        );

        res.render(
            'attendance/list',
            { attendance }
        );

    } catch(error){

        console.error(error);

        res.send(error.message);
    }
};

exports.attendanceReport =
async (req,res) => {

    try {

        const [report] =
        await db.query(
        `
        SELECT

            s.student_id,

            s.student_code,

            s.first_name,

            s.last_name,

            SUM(
            CASE
                WHEN a.status='Present'
                THEN 1
                ELSE 0
            END
            ) AS present_count,

            SUM(
            CASE
                WHEN a.status='Absent'
                THEN 1
                ELSE 0
            END
            ) AS absent_count

        FROM students s

        LEFT JOIN attendance a

        ON s.student_id = a.student_id

        GROUP BY s.student_id
        `
        );

        res.render(
            'attendance/report',
            { report }
        );

    } catch(error){

        console.error(error);

        res.send(error.message);
    }
};

