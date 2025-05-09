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
         @description code property
         **/
        var userCode = '';


        /**
         @ngdoc property
         @description code property
         **/
        var userBranchName = '';

        /**
         @ngdoc property
         @description code property
         **/
        var userSalt = '';

        /**
         @ngdoc property
         @description code property
         **/
        var hospitalCode = '';

        return {

            /**
             @ngdoc method
             @description Sets all the user authorization.
             **/
            setUserData: function (code, salt, hospitalcode) {
                userCode = code;      // Registration code
                userSalt = salt;    //RAMQ or MRN
                hospitalCode = hospitalcode;    //hospitalcode
            },

            /**
             @ngdoc method
             @param {String} branchName
             @description Sets all the user authorization.
             **/
            setUserBranchName: function (branchName) {
                userBranchName = branchName;    // Firebase branch name
            },

            /**
             @ngdoc method
             @returns {string} Returns hospital code.
             **/
            getHospitalCode: function () {
                return hospitalCode;

            },

            /**
             @ngdoc method
             @returns {string} Returns Firebase branch name.
             **/
            getUserBranchName: function () {
                return userBranchName;

            },

            /**
             @ngdoc method
             @returns {string} Returns Firebase branch name.
             **/
            getUserSalt: function () {
                return userSalt;

            },

            /**
             @ngdoc method
             @returns {string} Returns unique ID.
             **/
            getuserCode: function () {
                return userCode;
            },

            /**
             @ngdoc method
             @description Clears service
             **/
            clearUserAuthorizationInformation: function () {
                userCode = '';
                userSalt = '';
                userBranchName = '';
                hospitalCode = '';
            }
        }
    }
})();
