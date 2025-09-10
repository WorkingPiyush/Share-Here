// let's Work !!
const express = require('express');
const multer = require('multer');
const path = require('path');
const uploadFile = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const maxSize = 1073741824;
    const tooLarge = req.files.find(f => f.size > maxSize);
    if (tooLarge) {
        return res.status(400).json({ error: `${tooLarge.originalname} exceeds max size of 1GB` });
    }
    if (req.files) {
        res.json({
            message: "Files uploaded successfully!",
            files: req.files
        });
    } else {
        res.status(400).json({ message: "Files uploaded unsuccessfull!" })
    }
};


module.exports = {
    uploadFile
};
