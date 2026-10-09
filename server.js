const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
// Helmet helps secure the app, but we disable CSP to avoid blocking external scripts/images for this demo
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(morgan('common'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
// We use a try-catch-like approach with .catch to ensure server doesn't crash on initial connection fail
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error (Check .env MONGO_URI):', err.message);
        // We do NOT exit the process, so the frontend can still be served
    });

// Routes
// Wrap in try-catch to avoid crashing if routes have syntax errors
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/products', require('./routes/products'));
    app.use('/api/bookings', require('./routes/bookings'));
} catch (error) {
    console.error("Error loading routes:", error);
}

// Serve Frontend for any unknown route (SPA fallback)
app.use((req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (err) {
        res.status(500).send("Error serving frontend");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});
