const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/connectDB.js');


// registering user
const register = async (req, res) => {
    // getting user info.
    const { username, email, password } = req.body;
    // console.log("User Data: ", username, email, password);
    // Query running
    const query1 = 'SELECT * FROM users WHERE email = ?';
    db.query(query1, [email], async (err, result) => {
        if (err) {
            // if DB creates any error
            return res.json({ message: 'Database error', error: err.message })
        }
        if (result.length > 0) {
            // if user's email already exists in db.
            return res.json({ message: 'User already exists. Please sign in' })
        } else {
            try {
                const userid = crypto.randomBytes(4).toString('hex');
                // genrating a shortid by crypto as user's id;
                const hashPassword = await bcrypt.hash(password, 10);
                // hasing the password of the user b4 storing in DB
                const query2 = 'INSERT INTO users (User_ID,username, email,password) VALUES (?, ?, ?, ?)';
                const values2 = [userid, username, email, hashPassword];
                console.log(values2)
                db.query(query2, values2, (err, result2) => {
                    if (err) {
                        console.error(err);
                        return res.json({ message: 'Database error', error: err.message });
                    }
                    res.json({
                        // response after the user created
                        message: 'User created successfully',
                        data: result2
                    });
                })
            } catch (error) {
                console.log(error.message)
                res.status(500).json({ error: `User already exist` });
            }
        }
    })


}
// registered user can access their account
const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    const query1 = 'SELECT * FROM users WHERE username = ?';
    db.query(query1, [username], async (err, result) => {
        if (err) {
            return res.json({ message: 'Database error', error: err.message })
        }
        if (result.length === 0) {
            return res.json({ message: 'User not found' })
        }
        const user = result[0];
        const unHashPassword = await bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.json({ message: "Error while comparing password !!" });
            }
            if (!isMatch) {
                return res.json({ message: 'Invalid password' });
            }
            const token = jwt.sign(
                { userId: user.id, password: unHashPassword },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({
                message: "Login successful",
                token: token,
                user: {
                    username: user.username,
                    email: user.email
                }
            })

        })
    })
}


module.exports = {
    register,
    login
}