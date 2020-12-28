const mongoose = require('mongoose');

/** Mongoose Schema - Sauce model **/

const sauceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: [20, '20 caractères maximum']
  },
  manufacturer: {
    type: String,
    required: true,
    maxlength: [40, '40 caractères maximum']
  },
  description: {
    type: String,
    required: true
  },
  mainPepper: {
    type: String,
    required: true,
    maxlength: [20, '20 caractères maximum']
  },
  imageUrl: {
    type: String,
    required: true
  },
  heat: {
    type: Number,
    required: true
  },
  likes: {
    type: Number,
    required: false,
    default: 0
  },
  dislikes: {
    type: Number,
    required: false,
    default: 0
  },
  usersLiked: {
    type: [String],
    required: false
  },
  usersDisliked: {
    type: [String],
    required: false
  },
});

module.exports = mongoose.model('Sauce', sauceSchema);