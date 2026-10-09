const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    deviceType: { type: String, required: true },
    brand: { type: String, required: true }, // Apple, Samsung, etc.
    model: { type: String }, // iPhone 13, etc.
    issue: { type: String, required: true }, // Screen, Battery...
    imageUrl: { type: String }, // Path to uploaded file
    date: { type: Date, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: String, default: 'Pending' }, // Pending, Confirmed, Completed
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
