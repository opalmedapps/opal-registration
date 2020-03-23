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
            
            // PHP service to create firebase token
            searchAPI.createToken = function () {
                debugger;
                return $http.post(
                    "php/validation/get.token.php",
                    {
                        headers: { 'Content-Type': 'application/json' },
                    }
                );
            }

            // PHP service to create branch name
            searchAPI.createBranchName = function (registrationCode, ramq) {
                debugger;
                return $http.post(
                    "php/validation/create.branch.name.php",
                    $.param({
                        code: registrationCode,
                        ramq: ramq,
                    }),
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' },
                    }
                );
            }

            // PHP service to validate firebase branch name
            searchAPI.validateFirebaseBranch = function (branchName) {
                debugger;
                return $http.post(
                    "php/validation/validate.branch.name.php",
                    $.param({
                        branch: branchName
                    }),
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' },
                    }
                );
            }

            // PHP service call to get user IP address.
            searchAPI.getIP = function () {
                debugger;
                return $http.post(
                    "php/validation/get.ip.address.php",
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' },
                    }
                );
            }

            return searchAPI;
        })
})();
