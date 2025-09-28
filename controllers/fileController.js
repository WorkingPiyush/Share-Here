// let's Work !!
const path = require('path');
const fs = require('fs');
const db = require('../config/connectDB.js');
const dotenv = require('dotenv').config();

const uploadFile = (req, res) => {
    // collecting user's files
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // max limit of file uploading is 1GB.
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
            res.status(201).json({
                success: true,
                message: "Files uploaded successfully!",
            });
            const userID = req.user.id
            let files = req.files
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const query = 'INSERT INTO Userfiles (size, type, User_id, filename, filepath) VALUES (?, ?, ?,?,?)';
                const value = [file.size, file.mimetype, userID, file.filename, file.path]
                db.query(query, value, (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: 'Database error', error: err.message });
                    }
                    console.log("File added in the DB");
                })
            }
        } else {
            res.status(500).json({ message: "Error in file upload!" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error", error });
    }
};

const userFiles = (req, res) => {
    try {
        // user id of current user
        const userID = req.user.id
        const query1 = `SELECT * FROM Userfiles WHERE User_ID = ?`;
        const value1 = [userID];
        db.query(query1, value1, (err, result2) => {
            if (err) {
                res.status(500).json({ message: "DB Error", err })
            }
            res.status(201).json(result2)
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error", error });
    }
}

const downloadFiles = async (req, res) => {
    // file id and secretKey for download
    const fileId = req.params.id;
    const key = req.query.key;
    // console.log(fileId)
    // console.log(key)
    try {
        const query2 = ("SELECT * FROM Userfiles WHERE id = ?");
        db.query(query2, [fileId], async (err, result2) => {
            if (err) {
                return res.status(500).json({ message: "DB Error", err })
            }
            if (result2.length === 0) {
                return res.status(404).json({ message: "File Not Found" })
            }
            const file = result2[0];
            // check wether the key exists or not in DB.
            if (file.secret_key) {
                if (file.secret_key !== key) {
                    return res.status(401).json({ message: "Your Secret Key is wrong. Please enter right one !!" })
                }
            }
            // for now the final path where all the files are stored
            const filepath = path.resolve(process.env.BASE_PATH, file.filepath)
            // console.log("BASE_PATH",process.env.BASE_PATH)
            // console.log("file.filepath",file.filepath)
            // checking file existence
            if (!fs.existsSync(filepath)) {
                console.error("File not found at:", filepath);
                return res.status(404).send("File not found on server");
            }
            const query3 = ("UPDATE Userfiles SET download_count = download_count + 1 WHERE id = ?");
            db.query(query3, [fileId], (err, result3) => {
                if (err) {
                    return res.status(500).json({ message: "DB Error", err })
                }
                if (result3.affectedRows === 0) {
                    return res.status(404).json({ message: "File Not Found" })
                }
            })
            res.download(filepath, file.filename, (err) => {
                if (err) {
                    console.error("Download error:", err.message);
                    return res.status(404).send("File not found on server");
                }
            })
        })
    } catch (error) {
        console.log("error", error)
    }
}

const deleteFile = (req, res) => {
    // file id
    const fileId = req.params.id;
    const query3 = "DELETE FROM Userfiles WHERE id = ?"

    db.query(query3, fileId, (err, result4) => {
        if (err) {
            res.status(500).json({ message: "DB Error", err })
        }
        if (result4.length === 0) {
            res.status(404).json({ message: "File Not Found" })
        }
        res.status(200).json({
            message: 'Your Selected file deleted'
        })
    })

}

const addSecretKey = (req, res) => {
    const fileID = req.params.id;
    const { secretKey } = req.body;
    try {
        if (secretKey) {
            console.log("secretKey", secretKey)
            const query1 = `UPDATE Userfiles SET secret_key = ? WHERE id = ?`;
            const value1 = [secretKey, fileID]
            db.query(query1, value1, (err, result1) => {
                if (err) {
                    return res.status(500).json({ message: "DB Error", err })
                }
                if (result1.length === 0) {
                    return res.status(404).json({ message: "File Not Found" })
                }
                res.json({ success: true, message: "Secret Key Added" })
            })
        }
    } catch (error) {
        res.status(400).json({ message: "Error", err: error });
    }
}
module.exports = {
    uploadFile,
    userFiles,
    downloadFiles,
    deleteFile,
    addSecretKey
};
