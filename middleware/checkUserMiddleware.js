const jwt = require('jsonwebtoken');

const checkUser = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ message: `Token is missing or wrong!!` })
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        if (decoded) {
            req.user = decoded.user;
        } else {
            return res.json({ message: "Invalid token" });
        }
        next();
    } catch (error) {
        return res.json({ message: `Server Error !!`, error: error.message })
    }
}
module.exports = checkUser ;
