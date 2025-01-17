// SPDX-FileCopyrightText: Copyright 2022 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   account.controller.js
     Description  :   Control the account.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   LL
     Date         :   2022-04-07
 **/

(function () {
    'use strict';

    angular.module('myApp')
        .controller('accountController', accountController);

    accountController.$inject = ['$rootScope', '$location', '$filter', '$scope', '$timeout', 'requestToListener', 'userAuthorizationService', 'encryptionService'];

    function accountController($rootScope, $location, $filter, $scope, $timeout, requestToListener, userAuthorizationService, encryptionService) {
        let vm = this;

        // Call function on page load to fetch the data.
        vm.$onInit = function() {
            // get data from the parent component
            vm.formData = vm.parent.getData();
            // Call function to set current form class as active.
            vm.setFormStatus();

            // Hide display spinner on load
            vm.formData.displaySpinner = false;

            // Hide shared error message
            vm.sharedErrorMessage = true;
        }

        // Method to to set current form class as active and set flag for translation.
        vm.setFormStatus = function() {
            vm.formData.searchForm = "";
            vm.formData.secureForm.status = "active";
            vm.formData.secureForm.flag = null;
            vm.formData.preferenceForm.status = "";
            vm.formData.preferenceForm.flag = null;
            vm.formData.agreementForm.status = "";
            vm.formData.agreementForm.flag = null;
            vm.formData.successForm.status = "";
            vm.formData.successForm.flag = null;
        }

        vm.openAccount = function() {
            $location.path('/form/login');
        }

        vm.createAccount = function() {
            $location.path('/form/verification');
        }

        vm.onPrev = function() {
            // Hide the display spinner upon error
            vm.formData.displaySpinner = false;

            // Clear the form data
            vm.parent.resetFields();

            // Call function to clear user authorized value
            userAuthorizationService.clearUserAuthorizationInfomation();
            encryptionService.resetEncryptionHash();
        }

    }

})();
