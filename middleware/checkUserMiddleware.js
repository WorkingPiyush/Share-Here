const jwt = require('jsonwebtoken');

const checkUser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(404).json({ message: `Token is missing or wrong!!` })
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // check jwt.exp time for its validity
        const exptime = decoded.exp * 1000
        const exp = new Date(exptime).toLocaleTimeString()
        const currentDate = new Date(Date.now()).toLocaleTimeString()
        if (exp < currentDate) {
            return res.status(401).json({ message: "Your Session is expired please login again !!" })
        }
        if (decoded) {
            req.user = decoded.user;
        }
        else {
            return res.status(401).json({ message: "Invalid token" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: `Server Error !!`, error: error.message })
    }
}
module.exports = checkUser;
