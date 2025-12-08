// models/Family.js
const { Schema, model } = require('mongoose');

const familySchema = new Schema({
  name: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  inviteCodes: [{
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = model('Family', familySchema);