const mongoose = require("mongoose");
const Hosting = require("../models/hosting.model");
const Place = require("../models/place.model");

require("dotenv").config();

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
      if (err) return reject(err);
      resolve(userData);
    });
  });
}

class HostingController {
  static async createHosting(req, res) {
    mongoose.connect(process.env.MONGO_URL);
    const userData = await getUserDataFromReq(req);
    const { place, checkIn, checkOut, username, phone, numberOfGuests, price } =
      req.body;
    Hosting.create({
      place,
      checkIn,
      checkOut,
      username,
      phone,
      numberOfGuests,
      price,
      user: userData.id,
    })
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        res.status(422).json({ error: err.message });
        throw err;
      });
  }

  static async getHosting(req, res) {
    mongoose.connect(process.env.MONGO_URL);
    const userData = await getUserDataFromReq(req);
    res.json(await Hosting.find({ user: userData.id }).populate("place"));
  }

  static async getHostedPlaces(req, res) {
    mongoose.connect(process.env.MONGO_URL);
    const userData = await getUserDataFromReq(req);
    const places = await Place.find({ owner: userData.id });

    const placeIds = places.map((place) => place._id);

    res.json(
      await Hosting.find({ place: { $in: placeIds } }).populate("place")
    );
  }

  static async deleteHosting(req, res) {
    mongoose.connect(process.env.MONGO_URL);
    const userData = await getUserDataFromReq(req);
    const { id } = req.params;
    try {
      const hosting = await Hosting.findOne({ _id: id, user: userData.id });
      if (!hosting) {
        return res.status(404).json({ error: "Hosting not found" });
      }

      await Hosting.deleteOne({ _id: id });
      res.status(200).json({ success: true });
    } catch (err) {
      console.log("Error deleting hosting:", err);
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = HostingController;
