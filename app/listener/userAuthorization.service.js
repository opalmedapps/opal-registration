(function () {
    'use strict';
    angular.module('myApp')
        .service('userAuthorizationService', userAuthorizationService);

    userAuthorizationService.$inject = [];

    function userAuthorizationService() {
        /**
            @ngdoc property
            @name  MUHCApp.service.#username
            @propertyOf MUHCApp.service:userAuthorizationService
            @description Firebase Username property 
        **/
        var username = '';

        /**
            @ngdoc property
            @name  MUHCApp.service.#expires
            @propertyOf MUHCApp.service:userAuthorizationService
            @description Firebase Username property 
        **/
        var expires = '';

        /**
            @ngdoc property
            @name  MUHCApp.service.#password
            @propertyOf MUHCApp.service:userAuthorizationService
            @description Firebase session time expiration in milliseconds since epoch 
        **/
        var password = '';

        /**
            @ngdoc property
            @name  MUHCApp.service.#token
            @propertyOf MUHCApp.service:userAuthorizationService
            @description Hashed of password property
        **/
        var token = '';

        /**
            @ngdoc property
            @name  MUHCApp.service.#identifier
            @propertyOf MUHCApp.service:userAuthorizationService
            @description Device identifier property
        **/
        var identifier = '';

        /**
            @ngdoc property
            @name  MUHCApp.service.#email
            @propertyOf MUHCApp.service:userAuthorizationService
            @description Email property
         **/
        var email = '';

        /**
            @ngdoc property
            @name  MUHCApp.service.#uniqueCode
            @propertyOf MUHCApp.service:userAuthorizationService
            @description code property
         **/
        var uniqueCode = '';


        /**
            @ngdoc property
            @name  MUHCApp.service.#branchName
            @propertyOf MUHCApp.service:userAuthorizationService
            @description code property
         **/
        var firebaseBranchName = '';

        /**
           @ngdoc property
           @name  MUHCApp.service.#userRAMQ
           @propertyOf MUHCApp.service:userAuthorizationService
           @description code property
        **/
        var userRAMQ = '';

        return {
            /**
                @ngdoc method
                @name setUserAuthData
                @methodOf MUHCApp.service:userAuthorizationService
                @param {String} user Username
                @param {String} pass Hashed of password
                @param {String} exp  Expires
                @param {String} tok  Authentication token
                @description Sets all the user authorization.
            **/
            setUserAuthData: function (user, pass, exp, tok, Email) {
                username = user;
                password = pass;
                expires = exp;
                token = tok;
                email = Email;
            },

            /**
                @ngdoc method
                @name setUserData
                @methodOf MUHCApp.service:userAuthorizationService
                @param {String} user Username
                @param {String} pass Hashed of password
                @param {String} Email  Email
                @description Sets all the user authorization.

                For registration this method will use to set the user data not the above on setUserAuthData
            **/
            setUserData: function (user, pass, Email) {
                username = user;
                password = pass;
                email = Email;
            },

            /**
                @ngdoc method
                @name setFirebaseUser
                @methodOf MUHCApp.service:userAuthorizationService
                @param {String} tok  Authentication token
                @description Sets all the user authorization.
            **/
            setFirebaseUser: function (uniqueId, code, firebaseToken, ramq) {
                debugger;
                username = uniqueId;    // Firebase unique ID
                uniqueCode = code;      // Registration code
                token = firebaseToken;  // Firebase token
                userRAMQ = ramq;
            },

            /**
                @ngdoc method
                @name setFirebaseBranchName
                @methodOf MUHCApp.service:userAuthorizationService
                @param {String} branchName
                @description Sets all the user authorization.
            **/
            setFirebaseBranchName: function (branchName) {
                debugger;
                firebaseBranchName = branchName;    // Firebase branch name
            },

            /**
                @ngdoc method
                @name setPassword
                @methodOf MUHCApp.service:userAuthorizationService
                @param {String} pass Hashed of password
                @description Sets the user hashed password representation.
            **/
            setPassword: function (pass) {
                //Encode password
                pass = CryptoJS.SHA512(pass).toString();
                password = pass;

            },

            /**
                @ngdoc method
                @name getUserAuthData
                @methodOf MUHCApp.service:userAuthorizationService
                @returns {Object} Returns all the properties of the service as a single object.
            **/
            getUserAuthData: function () {
                return {
                    UserName: username,
                    Expires: expires,
                    Password: password,
                    Token: token
                };
            },

            /**
                @ngdoc method
                @name getFirebaseUserAuthData
                @methodOf MUHCApp.service:userAuthorizationService
                @returns {Object} Returns all the properties of the service as a single object.
            **/
            getFirebaseUserAuthData: function () {
                return {
                    UserName: username,
                    Token: token
                };
            },

            /**
               @ngdoc method
               @name getFirebaseBranchName
               @methodOf MUHCApp.service:userAuthorizationService
               @returns {string} Returns Firebase branch name.
           **/
            getFirebaseBranchName: function () {
                debugger;
                return firebaseBranchName;

            },

            /**
               @ngdoc method
               @name getUserRAMQ
               @methodOf MUHCApp.service:userAuthorizationService
               @returns {string} Returns Firebase branch name.
           **/
            getUserRAMQ: function () {
                debugger;
                return userRAMQ;

            },

            /**
                @ngdoc method
                @name getUserName
                @methodOf MUHCApp.service:userAuthorizationService
                @returns {string} Returns Firebase username.
            **/
            getUsername: function () {
                debugger;
                return username;
            },

            /**
                @ngdoc method
                @name getUserName
                @methodOf MUHCApp.service:userAuthorizationService
                @returns {string} Returns device identifier.
            **/
            getDeviceIdentifier: function () {
                var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
                if (app) {
                    identifier = device.uuid;
                } else {
                    identifier = 'browser';
                }
                return identifier;
            },

            /**
                @ngdoc method
                @name getPassword
                @methodOf MUHCApp.service:userAuthorizationService
                @returns {string} Returns hashed of user password for encryption
            **/
            getPassword: function () {
                debugger;
                return password;
            },
            /**
            *@ngdoc method
            *@name getExpires
            *@methodOf MUHCApp.service:userAuthorizationService
            *@returns {number} Returns date in milliseconds
            */
            getExpires: function () {
                return expires;
            },

            /**
                @ngdoc method
                @name getToken
                @methodOf MUHCApp.service:userAuthorizationService
                @returns {string} Returns authentication token
            **/
            getToken: function () {
                debugger;
                return token;
            },

            /**
                @ngdoc method
                @name getuniqueCode
                @methodOf MUHCApp.service:userAuthorizationService
                @returns {string} Returns unique ID.
            **/
            getuniqueCode: function () {
                debugger;
                return uniqueCode;
            },

            /**
                @ngdoc method
                @name getEmail
                @methodOf MUHCApp.service:userAuthorizationService
                @returns {string} Returns user email
             **/
            getEmail: function () {
                debugger;
                return email;
            },

            /**
                @ngdoc method
                @name setEmail
                @methodOf MUHCApp.service:userAuthorizationService
                @description  Sets user email
             **/
            setEmail: function (Email) {
                debugger;
                email = Email;
            },

            /**
                @ngdoc method
                @name clearuserAuthorizationInformation
                @methodOf MUHCApp.service:userAuthorizationService
                @description Clears service
            **/
            clearuserAuthorizationInfomation: function () {
                username = '';
                expires = '';
                password = '';
                token = '';
                identifier = '';
            }
        }
    }
})();

