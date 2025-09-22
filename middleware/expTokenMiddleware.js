const db = require('../config/connectDB.js');


const expToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({ message: `Token is missing or wrong!!` })
    }
    const token = authHeader.split(" ")[1];

    const query1 = 'SELECT * FROM exptoken WHERE token = ?';
    db.query(query1, [token], async (err, result) => {
        if (err) {
            return res.json({ message: 'Database error', error: err.message })
        }
        if (result) {
            return res.json({ message: 'Your Session already expired' })
        }
        else {
            next()
        }
    });
}

module.exports = expToken;