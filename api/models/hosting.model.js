const mongoose = require("mongoose");
const { Schema } = mongoose;

const hostingSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    username: { type: String, required: true },
    phone: { type: String, required: true },
    price: { type: Number, required: true },
}, { timestamps: true });

const Hosting = mongoose.model("Hosting", hostingSchema);

module.exports = Hosting;