const db = require('../config/connectDB.js');


const expToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.json({ message: `Token is missing or invalid!!` })
    }
    const token = authHeader.split(" ")[1];

    const query1 = 'SELECT * FROM exptoken WHERE token = ?';
    db.query(query1, [token], (err, result) => {
        if (err) {
            return res.json({ message: 'Database error', error: err.message })
        }
        if (result.length > 0) {
            return res.status(403).json({ error: 'Your session has already expired' });
        }
        next()
    });
}

module.exports = expToken;