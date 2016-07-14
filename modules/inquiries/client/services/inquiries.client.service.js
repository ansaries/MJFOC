//Inquiries service used to communicate Inquiries REST endpoints
(function () {
  'use strict';

  angular
    .module('inquiries')
    .factory('InquiriesService', InquiriesService);

  InquiriesService.$inject = ['$resource'];

  function InquiriesService($resource) {
    return $resource('api/inquiries/:inquiryId', {
      inquiryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
