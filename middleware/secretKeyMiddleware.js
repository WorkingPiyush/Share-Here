const db = require('../config/connectDB.js');

// check the is the secretKey required or not
const validatKey = (req, res, next) => {
    const fileId = req.params.id;
    const query2 = ("SELECT * FROM Userfiles WHERE id = ?");
    db.query(query2, [fileId], (err, result2) => {
        if (err) {
            return res.status(500).json({ message: "DB Error", err })
        }
        if (result2.length === 0) {
            return res.status(404).json({ message: "File Not Found" })
        }
        const file = result2[0];

        if (file.secret_key) {
            return res.redirect(`/verify/${fileId}`)
        } else {
            next()

        }
    })
}

module.exports = validatKey;