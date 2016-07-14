(function () {
  'use strict';

  // Inquiries controller
  angular
    .module('inquiries')
    .controller('InquiriesController', InquiriesController);

  InquiriesController.$inject = ['$scope', '$state', 'Authentication', 'inquiryResolve'];

  function InquiriesController ($scope, $state, Authentication, inquiry) {
    var vm = this;

    vm.authentication = Authentication;
    vm.inquiry = inquiry;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Inquiry
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.inquiry.$remove($state.go('inquiries.list'));
      }
    }

    // Save Inquiry
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.inquiryForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.inquiry._id) {
        vm.inquiry.$update(successCallback, errorCallback);
      } else {
        vm.inquiry.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('inquiries.view', {
          inquiryId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
