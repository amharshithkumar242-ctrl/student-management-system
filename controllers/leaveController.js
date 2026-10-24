const db = require('../config/db');

exports.showLeaveForm =
async (req,res) => {

    const [students] =
    await db.query(
        'SELECT * FROM students WHERE status="Active"'
    );

    res.render(
        'leave/apply',
        { students }
    );
};

exports.applyLeave =
async (req,res) => {

    try {

        const {
            student_id,
            from_date,
            to_date,
            reason
        } = req.body;

        const start =
        new Date(from_date);

        const end =
        new Date(to_date);

        const diff =
        Math.ceil(
            (end - start)
            / (1000 * 60 * 60 * 24)
        ) + 1;

        const [used] =
        await db.query(
        `
        SELECT
        COALESCE(SUM(leave_days),0)
        AS total
        FROM leave_applications
        WHERE student_id=?
        AND status='APPROVED'
        `,
        [student_id]
        );

        const annualAllowance = 30;

        if(
            used[0].total + diff >
            annualAllowance
        ){

            return res.send(
            'Leave allowance exceeded'
            );
        }

        await db.query(
        `
        INSERT INTO leave_applications
        (
            student_id,
            from_date,
            to_date,
            reason,
            leave_days
        )
        VALUES (?,?,?,?,?)
        `,
        [
            student_id,
            from_date,
            to_date,
            reason,
            diff
        ]
        );

        res.redirect('/leave');

    } catch(error){

        console.error(error);

        res.send(error.message);
    }
};

exports.listLeaveApplications =
async (req,res) => {

    const [applications] =
    await db.query(
    `
    SELECT

    l.*,

    s.student_code,

    s.first_name,

    s.last_name

    FROM leave_applications l

    JOIN students s

    ON l.student_id =
    s.student_id

    ORDER BY l.applied_on DESC
    `
    );

    res.render(
        'leave/list',
        { applications }
    );
};

exports.approveLeave =
async (req,res) => {

    const id =
    req.params.id;

    await db.query(
    `
    UPDATE leave_applications
    SET status='APPROVED'
    WHERE leave_id=?
    `,
    [id]
    );

    res.redirect('/leave');
};

exports.rejectLeave =
async (req,res) => {

    const id =
    req.params.id;

    await db.query(
    `
    UPDATE leave_applications
    SET status='REJECTED'
    WHERE leave_id=?
    `,
    [id]
    );

    res.redirect('/leave');
};