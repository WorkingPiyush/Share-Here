const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/connectDB.js');


// signup user
const signup = async (req, res) => {
    // getting user info.
    const { username, email, password } = req.body;
    // searching email in the db
    const query1 = 'SELECT * FROM users WHERE email = ?';
    db.query(query1, [email], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message })
        }
        if (result.length > 0) {
            // if user's email already exists in db.
            return res.status(409).json({ message: 'User already exists. Please sign in' })
        } else {
            try {
                const userid = crypto.randomBytes(4).toString('hex');
                const hashPassword = await bcrypt.hash(password, 10);
                // adding user's info in the db
                const query2 = 'INSERT INTO users (User_ID,username, email,password) VALUES (?, ?, ?, ?)';
                const values2 = [userid, username, email, hashPassword];
                db.query(query2, values2, (err, result2) => {
                    if (err) {
                        console.error(err);
                        return res.json({ message: 'Database error', error: err.message });
                    }
                    res.status(201).json({
                        success: true,
                        message: 'User created successfully',
                    });
                })
            } catch (error) {
                console.log(error.message)
                res.status(500).json({ error: `User already exist` });
            }
        }
    })


}
// login user
const login = async (req, res) => {
    const { email, password } = req.body;
    // checking email and password
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    // checking user's existence in the db
    const query1 = 'SELECT * FROM users WHERE email = ?';
    db.query(query1, [email], async (err, result) => {
        if (err) {
            return res.json({ message: 'Database error', error: err.message })
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' })
        }
        const user = result[0];
        try {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid password' });
            }
            // giving payload for jwt creation
            const payload = {
                user: {
                    id: user.User_id
                }
            };
            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.status(201).json({
                success: true,
                message: "Login successful",
                token: token,
                UserID: user.User_id
            })
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    });
}
// logout user
const logout = async (req, res) => {
    // checking jwt token
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(400).json({ message: "Token is missing !!" })
    try {
        const token = authHeader.split(' ')[1];
        // decoding jwt token
        const decodedToken = jwt.decode(token);
        const userid = decodedToken.user.id
        if (!decodedToken || !decodedToken.exp) {
            return res.json({ message: "Invalid token" });
        }
        // adding the token in DB for rejection
        const query1 = 'INSERT INTO exptoken (token,User_id) VALUES (?, ?)';
        const values1 = [token, userid];
        db.query(query1, values1, async (err, result1) => {
            if (err) {
                res.status(500).json({ message: 'Database error', error: err.message })
            }
            res.status(200).json({ message: "Logout Successfully !!" })
        })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = {
    signup,
    login,
    logout
}