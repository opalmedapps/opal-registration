/**
     Filename     :   search.service.js
     Description  :   File to make PHP API service call.
     Created by   :   Jinal Vyas
     Date         :   August 2019
 **/

(function () {
    'use strict';
    angular.module('myApp')
        .factory('agreementService', function ($http) {

            var agreementAPI = {};

            // PHP service to send email on successfull registration
            agreementAPI.sendEmail = function (firstName, lastName,email,language) {
                debugger;
                return $http.post(
                    "php/validation/send.email.php",
                    $.param({
                        FirstName: firstName,
                        LastName: lastName,
                        Email: email,
                        Language: language
                    }),
                    {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' },
                    }
                );
            }
            

            return agreementAPI;
        })
})();
