const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
// const employer = require('./models/companyProfile');


const app = express();
connectDB();
app.get('/', (req, res) => {
  res.send('Server is running...');
});
 

app.use(express.json()); 

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));
// For parsing JSON
//cloudinaary
//const fileUpload = require('express-fileupload');
const cors = require('cors');
app.use(cors());

//Routes

 // app.use("/api/employers", require( "./routes/employer.Routes"));
app.use("/api/users", require( "./routes/user.Routes.js"));
//app.use("/api/jobSeeker", require( "./routes/jobSeeker.Routes"))
// start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

