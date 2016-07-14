(function () {
  'use strict';

  angular
    .module('inquiries')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('inquiries', {
        abstract: true,
        url: '/inquiries',
        template: '<ui-view/>'
      })
      .state('inquiries.list', {
        url: '',
        templateUrl: 'modules/inquiries/client/views/list-inquiries.client.view.html',
        controller: 'InquiriesListController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Inquiries List'
        }
      })
      .state('inquiries.create', {
        url: '/create',
        templateUrl: 'modules/inquiries/client/views/form-inquiry.client.view.html',
        controller: 'InquiriesController',
        controllerAs: 'vm',
        resolve: {
          inquiryResolve: newInquiry
        },
        data: {            
          pageTitle : 'Inquiries Create'
        }
      })
      .state('inquiries.edit', {
        url: '/:inquiryId/edit',
        templateUrl: 'modules/inquiries/client/views/form-inquiry.client.view.html',
        controller: 'InquiriesController',
        controllerAs: 'vm',
        resolve: {
          inquiryResolve: getInquiry
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Inquiry {{ inquiryResolve.name }}'
        }
      })
      .state('inquiries.view', {
        url: '/:inquiryId',
        templateUrl: 'modules/inquiries/client/views/view-inquiry.client.view.html',
        controller: 'InquiriesController',
        controllerAs: 'vm',
        resolve: {
          inquiryResolve: getInquiry
        },
        data:{
          pageTitle: 'Inquiry {{ articleResolve.name }}'
        }
      });
  }

  getInquiry.$inject = ['$stateParams', 'InquiriesService'];

  function getInquiry($stateParams, InquiriesService) {
    return InquiriesService.get({
      inquiryId: $stateParams.inquiryId
    }).$promise;
  }

  newInquiry.$inject = ['InquiriesService'];

  function newInquiry(InquiriesService) {
    return new InquiriesService();
  }
})();
