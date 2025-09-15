const express = require('express');
const multer = require('multer');
const path = require('path');


const docStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/documents/")
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
        cb(new Error("Only Documents are allowed!!"))
    }
};
const imgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/images/")
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const name = path.basename(file.originalname, extname);
        cb(null, Date.now() + "-" + name + extname);
    },
});

const imgFilter = (req, file, cb) => {
    const allowedExt = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExt.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error("Only images are allowed!"));
    }
};
const Vdostorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/videos/")
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const name = path.basename(file.originalname, extname);
        cb(null, Date.now() + "-" + name + extname);
    },
});
const VdoFilter = (req, file, cb) => {
    const allowedExt = [".mp4", ".mkv", ".mov", ".avi", ".wmv", ".flv", ".webm"];
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExt.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error("Only Videos are allowed!"));
    }
};

module.exports = {
    docStorage,
    docFilter,
    imgStorage,
    imgFilter,
    Vdostorage,
    VdoFilter
}