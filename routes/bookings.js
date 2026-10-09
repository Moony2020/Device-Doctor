const router = require('express').Router();
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');
const multer = require('multer');
const path = require('path');

// Configure Multer for File Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Save to public/uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const verifyAdmin = (req, res, next) => {
    // ... same as before
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json("Token is not valid!");
            if (user.isAdmin) next();
            else return res.status(403).json("Admin only!");
        });
    } else return res.status(401).json("Not authenticated!");
};

// CREATE Booking (Public) - WITH FILE UPLOAD
// Use upload.single('image') to handle the file
router.post('/', upload.single('deviceImage'), async (req, res) => {
    try {
        const bookingData = {
            ...req.body,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : null
        };

        const newBooking = new Booking(bookingData);
        const savedBooking = await newBooking.save();

        // Send Email Confirmation
        const msg = `Hej ${savedBooking.customerName},\n\nTack för din bokning av ${savedBooking.brand} ${savedBooking.deviceType}.\nVi återkommer snarast!\n\nMvh, ValfriMobil`;
        await sendEmail(savedBooking.email, "Bokningsbekräftelse", msg);

        res.status(200).json(savedBooking);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// GET & DELETE (Same as before)
router.get('/', verifyAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (err) { res.status(500).json(err); }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json("Deleted");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;
