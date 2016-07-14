'use strict';

/**
 * Module dependencies
 */
var inquiriesPolicy = require('../policies/inquiries.server.policy'),
  inquiries = require('../controllers/inquiries.server.controller');
  

module.exports = function(app) {
  // Inquiries Routes
  app.route('/api/inquiries').all(inquiriesPolicy.isAllowed)
    .get(inquiries.list)
    .post(inquiries.create);


  app.route('/api/inquiries/:inquiryId').all(inquiriesPolicy.isAllowed)
    .get(inquiries.read)
    .put(inquiries.update)
    .delete(inquiries.delete);

  // Finish by binding the Inquiry middleware
  app.param('inquiryId', inquiries.inquiryByID);
};
