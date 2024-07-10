const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const router = require('./routes/index');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
})

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "exp://192.168.1.25:8081",
    credentials: true,
}))

app.use('/', router)

app.listen(process.env.API_PORT, () => {
    console.log("Server started")
})

module.exports = app;