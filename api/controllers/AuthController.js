const mongoose = require("mongoose");
const User = require("../models/user.model");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(10);



class AuthController {
  static async register(req, res) {
    mongoose.connect(process.env.MONGO_URL);
    const { username, email, password, addedPhotos } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
      const userDoc = await User.create({
        username,
        email,
        password: hashedPassword,
        pictureProfile: addedPhotos,
      });
      console.log("userDoc", userDoc);
      res.json(userDoc);
    } catch (e) {
      console.error("Registration error:", e);
      res.status(422).json({ error: e.message });
    }
  }


  static async login(req, res) {
    mongoose.connect(process.env.MONGO_URL);
    const { email, password } = req.body;
    try {
      const userDoc = await User.findOne({ email });
      console.log("userDoc", userDoc);
      if (!userDoc) {
        return res.status(404).json({ error: "Email not found" });
      }
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (!passOk) {
        return res.status(401).json({ error: "Invalid password" });
      }
  
      if (!jwtSecret) {
        console.log('JWT_SECRET not set');
        return res.status(500).json({ error: 'Server error' });
      }
      
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) {
            console.error("Error signing token:", err);
            return res.status(500).json({ error: "Server error" });
          }
          res.cookie('token', token, { httpOnly: true }).json({ token, user: userDoc });
          console.log("token", token);
        }
      );
    } catch (e) {
      console.error("Error logging in:", e);
      res.status(500).json({ error: e.message });
    }
  }
  

  static async logout(req, res) {
    res.cookie('token', "").json(true);
  }

  static async getProfile(req, res) {
    mongoose.connect(process.env.MONGO_URL);
    const {token} = req.cookies;
    console.log("Token in cookies:", token);
    if (!jwtSecret) {
      console.log('JWT_SECRET not set');
      return res.status(500).json({ error: 'Server error' });
    }
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({ error: "Unauthorized" });
      }
      const user = await User.findById(userData.id);
      const { _id, email, username, pictureProfile } = user;
      res.json({ _id, email, username, pictureProfile });
     });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

module.exports = AuthController;
