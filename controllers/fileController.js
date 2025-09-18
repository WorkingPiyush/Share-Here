// let's Work !!
const db = require('../config/connectDB.js')

const uploadFile = (req, res) => {
    // collecting user's files
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    // console.log(userID)

    // the limit of for uploading a file is 1GB.
    const maxSize = 1073741824;
    const tooLarge = req.files.find(f => f.size > maxSize);
    // throw the error while the size exceeds
    if (tooLarge) {
        return res.status(400).json({ error: `${tooLarge.originalname} exceeds max size of 1GB` });
    }
    // confirmation of file upload
    console.log(req.files)
    try {
        if (req.files) {
            res.json({
                success: true,
                message: "Files uploaded successfully!",
                files: req.files
            });
            const userID = req.user.id
            let files = req.files
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                // console.log(files)
                const query = 'INSERT INTO Userfiles (size, type, User_id, filename, filepath) VALUES (?, ?, ?,?,?)';
                const value = [file.size, file.mimetype, userID, file.filename, file.path]
                db.query(query, value, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.json({ message: 'Database error', error: err.message });
                    }
                    console.log("query Done: ", result);
                })
            }
        } else {
            res.json({ message: "Files uploaded unsuccessful!" })
        }
    } catch (error) {
        console.log(error)
        res.json({ message: "Server Error", error });
    }
};

const userFiles = (req, res) => {
    try {
        const userID = req.user.id
        const query1 = `SELECT * FROM Userfiles WHERE User_ID = ?`;
        const value1 = [userID];
        db.query(query1, value1, (err, result2) => {
            if (err) {
                res.json({ message: "DB Error", err })
            }
            console.log(result2)
            res.json(result2)
        })
    } catch (error) {
        console.log(error)
        res.json({ message: "Error", error });
    }
}

module.exports = {
    uploadFile,
    userFiles
};
