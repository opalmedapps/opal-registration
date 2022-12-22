/**
     Filename     :   perference.service.js
     Description  :   Loading JSON files.
     Created by   :   Jinal Vyas
     Date         :   August 2019
**/

(function () {
    'use strict';
    angular.module('myApp')
        .factory('preferenceService', function ($http) {

            var preferenceAPI = {};

            // Function to call all level of access data.
            preferenceAPI.allAccess = function () {
                return $http({
                    method: 'GET',
                    url: "json/allLevelofAccess.json"
                });
            }
            return preferenceAPI;
        })
})();
