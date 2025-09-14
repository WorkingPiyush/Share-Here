const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const path = require('path');
const PORT = process.env.PORT || 2001;
const db = require('./config/connectDB.js')

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.get('/', (req, res) => {
    // setting up the landing page for the user
    res.sendFile(__dirname + '/public/landingHomePage.html')
})

// working on the routes 
app.use("/signup", express.static(path.join(__dirname, 'public', '/signup.html')))
app.use("/login", express.static(path.join(__dirname, 'public', '/login.html')))
app.use("/home", express.static(path.join(__dirname, 'public', '/homePage.html')))

// file working route
const fileRoutes = require('./routes/fileRoutes.js')
app.use('/api/', fileRoutes)
// auth working route
const authRoutes = require('./routes/authRoutes.js')
app.use('/users/', authRoutes)





app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})