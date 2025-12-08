// models/User.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  families: [{ type: Schema.Types.ObjectId, ref: 'Family' }]
});

module.exports = model('User', userSchema);