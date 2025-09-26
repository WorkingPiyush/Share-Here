const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const path = require('path');
const PORT = process.env.PORT || 2001;
const db = require('./config/connectDB.js')


app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




// setting up the landing page for the user
app.get('/', (req, res) => { res.sendFile(__dirname + '/public/landingHomePage.html') })
// something
app.get('/copy/:id', (req, res) => { res.sendFile(__dirname + '/public/sharingTable.html') })

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
app.use('/api/', fileRoutes)
// auth working route
const authRoutes = require('./routes/authRoutes.js')
app.use('/users/', authRoutes)



app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})