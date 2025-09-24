// it will collect the error given by the multer's file filter and then it will be served to the frontend
const handleUploadError = (mw) => {
    return (req, res, next) => {
        mw(req, res, (err) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            next()
        })
    }
}

module.exports = handleUploadError;