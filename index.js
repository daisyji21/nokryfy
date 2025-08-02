const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const app = express();
connectDB();
app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

const cors = require("cors");
app.use(cors());

app.use("/api/users", require("./routes/user.Routes.js"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
