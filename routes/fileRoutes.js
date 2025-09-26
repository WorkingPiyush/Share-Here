const express = require('express');
const app = express()
const multer = require('multer');
const checkUser = require('../middleware/checkUserMiddleware.js');
const path = require('path');
const expTokenMW = require('../middleware/expTokenMiddleware.js')
const handleUploadError = require('../middleware/fileErrorMiddleware.js');
const { uploadFile, userFiles, downloadFiles, deleteFile, addSecretKey } = require('../controllers/fileController');
const router = express.Router();
const { docStorage, docFilter, imgStorage, imgFilter, Vdostorage, VdoFilter } = require('../storageSetup.js')



const docMiddleware = multer({ storage: docStorage, fileFilter: docFilter, limits: { fileSize: 1073741824 } });
const imgMiddleware = multer({ storage: imgStorage, fileFilter: imgFilter, limits: { fileSize: 1073741824 } });
const VdoMiddleware = multer({ storage: Vdostorage, fileFilter: VdoFilter, limits: { fileSize: 1073741824 } });

// for documents only
router.post('/uploadDoc', checkUser, expTokenMW, handleUploadError(docMiddleware.array('files')), uploadFile)
// for images only
router.post('/uploadImg', checkUser, expTokenMW, handleUploadError(imgMiddleware.array('files')), uploadFile)
// for videos only
router.post('/uploadVdo', checkUser, expTokenMW, handleUploadError(VdoMiddleware.array('files')), uploadFile)

// for user's file
router.get('/getFiles', checkUser, expTokenMW, userFiles)
// for files download
router.get('/downloadFiles/:id', downloadFiles)
// for deleting the file of the user
router.delete('/delete/:id', expTokenMW, checkUser, deleteFile)
router.get('/copy/:id', expTokenMW, checkUser, addSecretKey)

module.exports = router;