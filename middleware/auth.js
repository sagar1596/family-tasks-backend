// middleware/auth.js
const admin = require('firebase-admin');
const User = require('../models/User');

const serviceAccount = require('../serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'No token' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);

    // Find or create user in MongoDB
    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = new User({
        firebaseUid: decoded.uid,
        email: decoded.email
      });
      await user.save();
    }

    req.user = user; // ← this has _id
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = verifyToken;