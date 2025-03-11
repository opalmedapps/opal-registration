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
           @name  MUHCApp.service.#userRAMQ
           @propertyOf MUHCApp.service:userAuthorizationService
           @description code property
        **/
        var userRAMQ = '';

        /**
         @ngdoc property
         @name  MUHCApp.service.#userMRN
         @propertyOf MUHCApp.service:userAuthorizationService
         @description code property
         **/
        var userMRN = '';

        /**
         @ngdoc property
         @name  MUHCApp.service.#encryptionTYpe
         @propertyOf MUHCApp.service:userAuthorizationService
         @description code property
         **/
        var encryptionType = '';

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
            setUserData: function (code, hospitalcode) {
                userCode = code;      // Registration code
                hospitalCode = hospitalcode;    //hospitalcode
            },

            /**
             @ngdoc method
             @name setUserRAMQ
             @methodOf MUHCApp.service:userAuthorizationService
             @description Sets all the user authorization.
             **/
            setUserRAMQ: function (ramq) {
                userRAMQ = ramq;    //RAMQ
                this.setEncryptionType('ramq');
            },

            /**
             @ngdoc method
             @name setUserMRN
             @methodOf MUHCApp.service:userAuthorizationService
             @description Sets all the user authorization.
             **/
            setUserMRN: function (mrn) {
                userMRN = mrn;    //MRN
                this.setEncryptionType('mrn');
            },

            /**
             @ngdoc method
             @name setEncryptionType
             @methodOf MUHCApp.service:userAuthorizationService
             @description Sets all the user authorization.
             **/
            setEncryptionType: function (type) {
                encryptionType = type;    // ramq or mrn
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
               @name getUserRAMQ
               @methodOf MUHCApp.service:userAuthorizationService
               @returns {string} Returns Firebase branch name.
           **/
            getUserRAMQ: function () {
                return userRAMQ;

            },

            /**
             @ngdoc method
             @name getUserMRN
             @methodOf MUHCApp.service:userAuthorizationService
             @returns {string} Returns Firebase branch name.
             **/
            getUserMRN: function () {
                return userMRN;

            },

            /**
             @ngdoc method
             @name getEncryptionType
             @methodOf MUHCApp.service:userAuthorizationService
             @returns {string} Returns Firebase branch name.
             **/
            getEncryptionType: function () {
                return encryptionType;
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
                @name clearuserAuthorizationInformation
                @methodOf MUHCApp.service:userAuthorizationService
                @description Clears service
            **/
            clearuserAuthorizationInfomation: function () {
                userCode = '';
                userRAMQ = '';
                userMRN = '';
                encryptionType = '';
                userBranchName = '';
            }
        }
    }
})();

