// routes/families.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../middleware/auth');
const User = require('../models/User');
const Family = require('../models/Family');

router.post('/', verifyToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ msg: 'Family name required' });

    const code = uuidv4().slice(0, 8).toUpperCase();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const family = new Family({
      name,
      creator: req.user._id,  // ← from middleware
      members: [req.user._id],
      inviteCodes: [{ code, expiresAt }]
    });
    await family.save();

    // Add family to user
    await User.findByIdAndUpdate(req.user._id, { $push: { families: family._id } });

    res.json({ family, inviteCode: code });
  } catch (err) {
    console.error('Create family error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;