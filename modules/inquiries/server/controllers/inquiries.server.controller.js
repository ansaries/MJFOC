'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Inquiry = mongoose.model('Inquiry'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Inquiry
 */
exports.create = function(req, res) {
  var inquiry = new Inquiry(req.body);
  inquiry.user = req.user;

  inquiry.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inquiry);
    }
  });
};

/**
 * Show the current Inquiry
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var inquiry = req.inquiry ? req.inquiry.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  inquiry.isCurrentUserOwner = req.user && inquiry.user && inquiry.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(inquiry);
};

/**
 * Update a Inquiry
 */
exports.update = function(req, res) {
  var inquiry = req.inquiry ;

  inquiry = _.extend(inquiry , req.body);

  inquiry.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inquiry);
    }
  });
};

/**
 * Delete an Inquiry
 */
exports.delete = function(req, res) {
  var inquiry = req.inquiry ;

  inquiry.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inquiry);
    }
  });
};

/**
 * List of Inquiries
 */
exports.list = function(req, res) { 
  Inquiry.find().sort('-created').populate('user', 'displayName').exec(function(err, inquiries) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(inquiries);
    }
  });
};

/**
 * Inquiry middleware
 */
exports.inquiryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Inquiry is invalid'
    });
  }

  Inquiry.findById(id).populate('user', 'displayName').exec(function (err, inquiry) {
    if (err) {
      return next(err);
    } else if (!inquiry) {
      return res.status(404).send({
        message: 'No Inquiry with that identifier has been found'
      });
    }
    req.inquiry = inquiry;
    next();
  });
};
