'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Inquiry Schema
 */
var InquirySchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Inquiry name',
    trim: true
  },
  description: {
      type: String,
      default: '',
      required: 'Please fill Inquiry description',
      trim: true
  },
  makani: {
      type: Number,
      default: '',
      trim: true
  },
  address: {
      type: String,
      default: '',
      trim: true
  },
  city: {
      type: String,
      default: '',
      trim: true
  },
  state: {
      type: String,
      default: '',
      trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Inquiry', InquirySchema);
