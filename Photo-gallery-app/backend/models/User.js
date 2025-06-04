[span_101](start_span)const mongoose = require(‘mongoose’);[span_101](end_span)
[span_102](start_span)const bcrypt = require(‘bcryptjs’);[span_102](end_span)

[span_103](start_span)const UserSchema = new mongoose.Schema({[span_103](end_span)
  Email: { type: String, required: true, unique: true }, // Corrected Email to email
  Password: { type: String, required: true }, // Corrected Password to password
  [span_104](start_span)isAdmin: { type: Boolean, default: false },[span_104](end_span)
  [span_105](start_span)createdAt: { type: Date, default: Date.now }[span_105](end_span)
});

[span_106](start_span)UserSchema.pre(‘save’, async function(next) {[span_106](end_span)
  If (!this.isModified(‘password’)) return next(); // Corrected If to if
  This.password = await bcrypt.hash(this.password, 12); // Corrected This to this
  Next(); // Corrected Next() to next()
});

[span_107](start_span)module.exports = mongoose.model(‘User’, UserSchema);[span_107](end_span)
