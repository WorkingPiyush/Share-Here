const express = require('express');
const multer = require('multer');
const path = require('path');

const { uploadFile } = require('../controllers/fileController');
const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const name = path.basename(file.originalname, extname);
        cb(null, Date.now() + "-" + name + extname);
    },
});
const docFilter = (req, file, cb) => {
    const allowedExt = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"];
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExt.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error("Only Pdfs and Images are allowed!!"))
    }
};

const imgFilter = (req, file, cb) => {
    const allowedExt = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExt.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};
const VdoFilter = (req, file, cb) => {
    const allowedExt = [".mp4", ".mkv", ".mov", ".avi", ".wmv", ".flv", ".webm"];
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExt.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error("Only Videos are allowed!"));
    }
};


const docMiddleware = multer({ storage, fileFilter: docFilter, limits: { fileSize: 1073741824 } });
const imgMiddleware = multer({ storage, fileFilter: imgFilter, limits: { fileSize: 1073741824 } });
const VdoMiddleware = multer({ storage, fileFilter: VdoFilter, limits: { fileSize: 1073741824 } });


router.post('/uploadDoc', docMiddleware.array('files'), uploadFile)
router.post('/uploadImg', imgMiddleware.array('files',), uploadFile)
router.post('/uploadVdo', VdoMiddleware.array('files',), uploadFile)


module.exports = router;