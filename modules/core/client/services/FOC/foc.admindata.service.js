(function () {
    'use strict';

    angular
      .module('core')
      .factory('adminData', adminData);

    adminData.$inject = ['$http'];

    function adminData($http) {
        return {
            getCategories: function(){
            return $http({
                method:"POST",
                url: 'http://192.168.99.153:6280/api/services/app/adminDataAppServices/GetBusinessCategories?input=',
                dataType:'json',
                contentType:'application/json',
                data:JSON.stringify({})               
            });
        
        },
            getServices:function(){
            return "null";   
            }

            

                
        }

        
    };


})();