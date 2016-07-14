'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Inquiries Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/inquiries',
      permissions: '*'
    }, {
      resources: '/api/inquiries/:inquiryId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/inquiries',
      permissions: ['get', 'post']
    }, {
      resources: '/api/inquiries/:inquiryId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/inquiries',
      permissions: ['post']
    }, {
      resources: '/api/inquiries/:inquiryId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Inquiries Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Inquiry is being processed and the current user created it then allow any manipulation
  if (req.inquiry && req.user && req.inquiry.user && req.inquiry.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
