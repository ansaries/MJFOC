///</// <reference path="angularjs/angular.d.ts" />

(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);
  HomeController.$inject = ['$scope', '$state', 'Authentication', 'adminData'];

  function HomeController($scope, $state, Authentication, adminData) {
      var vm = this;
      $scope.categories;
      
      adminData.getCategories().then(function(data){
        $scope.categories = data.data.result;
      });

      
      $scope.$watch('categories',function(){
        console.log("Categories:",JSON.stringify($scope.categories));
      });

  }
}());
