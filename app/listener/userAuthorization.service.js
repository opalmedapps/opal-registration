// SPDX-FileCopyrightText: Copyright (C) 2020 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

(function () {
    'use strict';
    angular.module('myApp')
        .service('userAuthorizationService', userAuthorizationService);

    userAuthorizationService.$inject = [];

    function userAuthorizationService() {
        /**
         @ngdoc property
         @name  MUHCApp.service.#userCode
         @propertyOf MUHCApp.service:userAuthorizationService
         @description code property
         **/
        var userCode = '';


        /**
         @ngdoc property
         @name  MUHCApp.service.#userBranchName
         @propertyOf MUHCApp.service:userAuthorizationService
         @description code property
         **/
        var userBranchName = '';

        /**
         @ngdoc property
         @name  MUHCApp.service.#userSalt
         @propertyOf MUHCApp.service:userAuthorizationService
         @description code property
         **/
        var userSalt = '';

        /**
         @ngdoc property
         @name  MUHCApp.service.#hospitalCode
         @propertyOf MUHCApp.service:userAuthorizationService
         @description code property
         **/
        var hospitalCode = '';

        return {

            /**
             @ngdoc method
             @name setUserData
             @methodOf MUHCApp.service:userAuthorizationService
             @description Sets all the user authorization.
             **/
            setUserData: function (code, salt, hospitalcode) {
                userCode = code;      // Registration code
                userSalt = salt;    //RAMQ or MRN
                hospitalCode = hospitalcode;    //hospitalcode
            },

            /**
             @ngdoc method
             @name setFirebaseBranchName
             @methodOf MUHCApp.service:userAuthorizationService
             @param {String} branchName
             @description Sets all the user authorization.
             **/
            setUserBranchName: function (branchName) {
                userBranchName = branchName;    // Firebase branch name
            },

            /**
             @ngdoc method
             @name getHospitalCode
             @methodOf MUHCApp.service:userAuthorizationService
             @returns {string} Returns hospital code.
             **/
            getHospitalCode: function () {
                return hospitalCode;

            },

            /**
             @ngdoc method
             @name getUserBranchName
             @methodOf MUHCApp.service:userAuthorizationService
             @returns {string} Returns Firebase branch name.
             **/
            getUserBranchName: function () {
                return userBranchName;

            },

            /**
             @ngdoc method
             @name getUserSalt
             @methodOf MUHCApp.service:userAuthorizationService
             @returns {string} Returns Firebase branch name.
             **/
            getUserSalt: function () {
                return userSalt;

            },

            /**
             @ngdoc method
             @name getuniqueCode
             @methodOf MUHCApp.service:userAuthorizationService
             @returns {string} Returns unique ID.
             **/
            getuserCode: function () {
                return userCode;
            },

            /**
             @ngdoc method
             @name clearUserAuthorizationInformation
             @methodOf MUHCApp.service:userAuthorizationService
             @description Clears service
             **/
            clearUserAuthorizationInfomation: function () {
                userCode = '';
                userSalt = '';
                userBranchName = '';
                hospitalCode = '';
            }
        }
    }
})();

