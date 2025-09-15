// For throwing the error to the client side if wrong file uploaded on the wrong route..
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