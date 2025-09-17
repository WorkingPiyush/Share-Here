// let's Work !!
const db = require('../config/connectDB.js')

const uploadFile = (req, res) => {
    // collecting user's files
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const userID = req.user.id
    // console.log(userID)

    // the limit of for uploading a file is 1GB.
    const maxSize = 1073741824;
    const tooLarge = req.files.find(f => f.size > maxSize);
    // throw the error while the size exceeds
    if (tooLarge) {
        return res.status(400).json({ error: `${tooLarge.originalname} exceeds max size of 1GB` });
    }
    // confirmation of file upload
    if (req.files) {
        res.json({
            success: true,
            message: "Files uploaded successfully!",
            files: req.files
        });
        let files = req.files
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            // console.log(files)
            const query = 'INSERT INTO Userfiles (User_ID, filename,filepath) VALUES (?, ?, ?)';
            const value = [userID, file.filename, file.path]
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
};


module.exports = {
    uploadFile
};
