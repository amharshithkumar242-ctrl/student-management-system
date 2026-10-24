const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.showLogin = (req, res) => {

    res.render('login');
};

exports.login = async (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        const [admins] =
            await db.query(
                'SELECT * FROM admins WHERE username = ?',
                [username]
            );

        if (admins.length === 0) {

            return res.send(
                'Invalid Username'
            );
        }

        const admin = admins[0];

        const match =
            await bcrypt.compare(
                password,
                admin.password_hash
            );

        if (!match) {

            return res.send(
                'Invalid Password'
            );
        }

        req.session.adminId =
            admin.admin_id;

        req.session.username =
            admin.username;

        res.redirect('/dashboard');

    } catch (error) {

        console.error(error);

        res.send(
            'Login Failed'
        );
    }
};

exports.logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect('/login');
    });
};