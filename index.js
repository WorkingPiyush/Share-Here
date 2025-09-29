const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const path = require('path');
const PORT = process.env.PORT || 2001;
const rateLimit = require('express-rate-limit');
const db = require('./config/connectDB.js')


app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const limits = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: {
        status: "error",
        message: "Too many requests from this IP, please try again later."
    }
})



// setting up the landing page for the user
app.get('/', (req, res) => { res.sendFile(__dirname + '/public/landingHomePage.html') })
// something
app.get('/copy/:id', (req, res) => { res.sendFile(__dirname + '/public/sharingTable.html') })
app.get('/verify/:id', (req, res) => { res.sendFile(__dirname + '/public/downloadFile.html') })

// working on the routes 
app.use("/home", express.static(path.join(__dirname, 'public', '/homePage.html')))
app.use("/images", express.static(path.join(__dirname, 'public', '/imageWorking.html')))
app.use("/signup", express.static(path.join(__dirname, 'public', '/signup.html')))
app.use("/login", express.static(path.join(__dirname, 'public', '/login.html')))
app.use("/documents", express.static(path.join(__dirname, 'public', '/docWorking.html')))
app.use("/videos", express.static(path.join(__dirname, 'public', '/videoWorking.html')))
app.use("/myfiles", express.static(path.join(__dirname, 'public', '/fileDashboard.html')))
app.use("/logout", express.static(path.join(__dirname, 'public', '/logout.html')))

// file working route
const fileRoutes = require('./routes/fileRoutes.js')
app.use('/api/', limits, fileRoutes)
// auth working route
const authRoutes = require('./routes/authRoutes.js')
app.use('/users/', authRoutes)



app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})