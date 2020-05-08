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

            // Function to load language JSON file
            preferenceAPI.getlanguage = function () {
                return $http({
                    method: 'GET',
                    url: "/json/language.json"
                });
            }

            // Function to opal access level file
            preferenceAPI.getlevelofAccess = function () {
                return $http({
                    method: 'GET',
                    url: "/json/levelofAccess.json"
                });
            }

            // Function to call all level of access data.
            preferenceAPI.allAccess = function () {
                return $http({
                    method: 'GET',
                    url: "json/allLevelofAccess.json"
                });
            }

            // Function to call need to know leve of access data.
            preferenceAPI.needToKnowAccess = function () {
                return $http({
                    method: 'GET',
                    url: "json/needToKnowLevelofAccess.json"
                });
            }
            return preferenceAPI;
        })
})();
