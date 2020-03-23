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
            debugger;
            // Function to load language JSON file
            preferenceAPI.getlanguage = function () {
                debugger;
                return $http({
                    method: 'GET',
                    url: "/json/language.json"
                });
            }

            // Function to opal access level file
            preferenceAPI.getlevelofAccess = function () {
                debugger;
                return $http({
                    method: 'GET',
                    url: "/json/levelofAccess.json"
                });
            }

            // Function to call all level of access data.
            preferenceAPI.allAccess = function () {
                debugger;
                return $http({
                    method: 'GET',
                    url: "json/allLevelofAccess.json"
                });
            }

            // Function to call need to know leve of access data.
            preferenceAPI.needToKnowAccess = function () {
                debugger;
                return $http({
                    method: 'GET',
                    url: "json/needToKnowLevelofAccess.json"
                });
            }
            return preferenceAPI;
        })
})();
