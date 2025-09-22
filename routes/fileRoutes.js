const express = require('express');
const app = express()
const multer = require('multer');
const checkUser = require('../middleware/checkUserMiddleware.js');
const path = require('path');
const handleUploadError = require('../middleware/fileErrorMiddleware.js');
const expTokenMW = require('../middleware/expTokenMiddleware.js')
const { uploadFile, userFiles, downloadFiles, deleteFile } = require('../controllers/fileController');
const router = express.Router();
const { docStorage, docFilter, imgStorage, imgFilter, Vdostorage, VdoFilter } = require('../storageSetup.js')



const docMiddleware = multer({ storage: docStorage, fileFilter: docFilter, limits: { fileSize: 1073741824 } });
const imgMiddleware = multer({ storage: imgStorage, fileFilter: imgFilter, limits: { fileSize: 1073741824 } });
const VdoMiddleware = multer({ storage: Vdostorage, fileFilter: VdoFilter, limits: { fileSize: 1073741824 } });

app.use(expTokenMW);
// for documents only
router.post('/uploadDoc', checkUser, handleUploadError(docMiddleware.array('files')), uploadFile)
// for images only
router.post('/uploadImg', checkUser, handleUploadError(imgMiddleware.array('files')), uploadFile)
// for videos only
router.post('/uploadVdo', checkUser, handleUploadError(VdoMiddleware.array('files')), uploadFile)

router.get('/getFiles', checkUser, userFiles)
router.get('/downloadFiles/:id', downloadFiles)
router.delete('/delete/:id', checkUser, deleteFile)

module.exports = router;