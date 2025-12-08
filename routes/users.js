// routes/users.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const User = require('../models/User');

router.post('/sync', verifyToken, async (req, res) => {
  try {
    const { uid, email } = req.user;
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = new User({ firebaseUid: uid, email });
      await user.save();
    }
    res.json({ message: 'User synced', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;