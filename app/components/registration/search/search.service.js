/**
     Filename     :   search.service.js
     Description  :   File to make PHP API service call.
     Created by   :   Jinal Vyas
     Date         :   August 2019
 **/
 
(function () {
    'use strict';
    angular.module('myApp')
        .factory('searchService', function ($http) {

            var searchAPI = {};
            
            // PHP service call to get user IP address.
            searchAPI.getIP = function () {
                
                return $http.post(
                    "php/validation/get.ip.address.php",
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' },
                    }
                );
            };

            return searchAPI;
        })
})();
