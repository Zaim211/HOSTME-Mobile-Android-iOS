const mongoose = require("mongoose");
const Place = require("../models/place.model");
require("dotenv").config();

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

class PlaceController {
  static async createPlaces(req, res) {
    mongoose.connect(process.env.MONGO_URL);

    const { token } = req.cookies;

    const {
      title,
      address,
      description,
      price,
      selectedPerks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      addedPhotos,
    } = req.body;

    // Log incoming request data
    console.log("Incoming place data:", req.body);

    // Handle JWT verification and place creation
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(401).json({ error: "Unauthorized" });
      }

      try {
        // Create or update place document
        const placeDoc = await Place.create({
          owner: userData.id,
          price,
          title,
          address,
          description,
          selectedPerks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
          photos: addedPhotos,
        });

        console.log("Created place:", placeDoc);
        res.json(placeDoc);
      } catch (error) {
        console.error("Error creating place:", error);
        res
          .status(500)
          .json({ error: "Failed to create place. Please try again later." });
      }
    });
  }

  static async getUserPlaces(req, res) {
    // Fetch the places owned by the current user
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;

    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        const places = await Place.find({ owner: id });
        res.json(places);
      });
    } else {
      res.status(401).json({ error: "Unauthorized" });
      console.log("no token found");
    }
  }

  static async getAllPlaces(req, res) {
    mongoose.connect(process.env.MONGO_URL);
    try {
      const { search } = req.query;
      let query = {};

      if (search) {
        query = {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
          ],
        };
      }

      const places = await Place.find(query);
      res.json(places);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPlaceById(req, res) {
     // Fetch a place by ID
     mongoose.connect(process.env.MONGO_URL);
     const { id } = req.params;
     res.json(await Place.findById(id));
  }

  static async deletePlace(req, res) {
    mongoose.connect(process.env.MONGO_URL);
    const { token } = req.cookies;
    const { id } = req.params;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.findById(id);
      if (userData.id === placeDoc.owner.toString()) {
        await Place.findByIdAndDelete(id);
        res.status(200).json({ message: "Place deleted" });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    });
  }

  static async getLatestPlaces(req, res) {
    mongoose.connect(process.env.MONGO_URL);
    try {
      const latestPlaces = await Place.find({}).sort({ createdAt: -1 }).limit(4);
      res.json(latestPlaces);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch latest places." });
    }
  }
}

module.exports = PlaceController;
