const { Schema, model } = require('mongoose');

const postSchema = new Schema({
author: { type: Schema.Types.ObjectId, ref: 'User' },
content: String,
likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
comments: [
{
user: { type: Schema.Types.ObjectId, ref: 'User' },
text: String,
},
],
});


module.exports = model('Post', postSchema);