require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./config/db');
const departmentRoutes = require('./routes/departmentRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');

const { isAuthenticated } = require('./middleware/authMiddleware');

const studentRoutes = require('./routes/studentRoutes');

const attendanceRoutes = require('./routes/attendanceRoutes');

const leaveRoutes = require('./routes/leaveRoutes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true
        }
    })
);

app.use('/students', studentRoutes);

app.get('/', (req, res) => {
    res.send(`
        <h1>IKF 1 Student Management System</h1>
        <p>Node.js + Express application is running successfully.</p>
    `);
});

app.get('/health', async (req, res) => {
    try {
        await db.query('SELECT 1');

        res.status(200).json({
            status: 'UP',
            database: 'CONNECTED'
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            status: 'DOWN',
            database: 'DISCONNECTED'
        });
    }
});

app.get(
    '/dashboard',
    isAuthenticated,
    async (req, res) => {

        const [studentRows] =
        await db.query(
        `
        SELECT COUNT(*) total
        FROM students
        `
        );

        const [departmentRows] =
        await db.query(
        `
        SELECT COUNT(*) total
        FROM departments
        `
        );

        const [activeRows] =
        await db.query(
        `
        SELECT COUNT(*) total
        FROM students
        WHERE status='Active'
        `
        );

        const [inactiveRows] =
        await db.query(
        `
        SELECT COUNT(*) total
        FROM students
        WHERE status='Inactive'
        `
        );

        res.render(
            'dashboard',
            {
                username:
                req.session.username,

                totalStudents:
                studentRows[0].total,

                totalDepartments:
                departmentRows[0].total,

                activeStudents:
                activeRows[0].total,

                inactiveStudents:
                inactiveRows[0].total
            }
        );
    }
);

app.use('/departments', departmentRoutes);
app.use(authRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/leave', leaveRoutes);


app.listen(PORT, () => {
    console.log(`SMS server running on http://localhost:${PORT}`);
});