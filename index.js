const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT;

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/homePage.html')
})



const fileRoutes = require('./routes/fileRoutes.js')
app.use('/api/', fileRoutes)







app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})