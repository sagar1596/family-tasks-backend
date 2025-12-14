// middleware/auth.js
const admin = require('firebase-admin');

// Use Application Default Credentials (ADC) – works on Render.com
if (!admin.apps.length) {
  admin.initializeApp();
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // Find or create user in MongoDB
    const User = require('../models/User');
    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = new User({
        firebaseUid: decoded.uid,
        email: decoded.email
      });
      await user.save();
    }

    req.user = user;
    next();
  } catch (e) {
    console.error('Token verification error:', e);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = verifyToken;