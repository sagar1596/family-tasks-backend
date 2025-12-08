// middleware/auth.js
const admin = require('firebase-admin');

const serviceAccount = require('../family-tasks-d47c0-firebase-adminsdk-fbsvc-4f439b6e56.json'); // download from Firebase

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
      const user = await User.findOneAndUpdate(
        { firebaseUid: decoded.uid },
        { $setOnInsert: { firebaseUid: decoded.uid, email: decoded.email } },
        { upsert: true, new: true }
      );
      req.user = user;
      next();
    } catch (e) {
      res.status(401).json({ msg: 'Invalid token' });
    }
  };

module.exports = verifyToken;