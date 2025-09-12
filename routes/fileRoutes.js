const express = require('express');
const multer = require('multer');
const path = require('path');

const { uploadFile } = require('../controllers/fileController');
const router = express.Router();
const { docStorage, docFilter, imgStorage, imgFilter, Vdostorage, VdoFilter } = require('../storageSetup.js')



const docMiddleware = multer({ storage: docStorage, fileFilter: docFilter, limits: { fileSize: 1073741824 } });
const imgMiddleware = multer({ storage: imgStorage, fileFilter: imgFilter, limits: { fileSize: 1073741824 } });
const VdoMiddleware = multer({ storage: Vdostorage, fileFilter: VdoFilter, limits: { fileSize: 1073741824 } });

// for documents only
router.post('/uploadDoc', docMiddleware.array('files'), uploadFile)
// for images only
router.post('/uploadImg', imgMiddleware.array('files',), uploadFile)
// for videos only
router.post('/uploadVdo', VdoMiddleware.array('files',), uploadFile)


module.exports = router;