const { Schema, model } = require('mongoose');


const userSchema = new Schema({
username: { type: String, required: true, unique: true },
bio: String,
followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});


module.exports = model('User', userSchema);