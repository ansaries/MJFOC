(function () {
  'use strict';

  angular
    .module('inquiries')
    .controller('InquiriesListController', InquiriesListController);

  InquiriesListController.$inject = ['InquiriesService'];

  function InquiriesListController(InquiriesService) {
    var vm = this;

    vm.inquiries = InquiriesService.query();
  }
})();
