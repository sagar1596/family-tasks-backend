// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// CORS – allow Flutter web + Render.com
app.use(cors({
  origin: true, // allows any origin (dev + prod)
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => res.json({ status: 'Backend alive!' }));

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Routes
const userRoutes = require('./routes/users');
const familyRoutes = require('./routes/families');
app.use('/api/users', userRoutes);
app.use('/api/families', familyRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on https://family-tasks-backend.onrender.com`);
  console.log(`Health check: https://family-tasks-backend.onrender.com/`);
});