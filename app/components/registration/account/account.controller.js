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

    accountController.$inject = ['$rootScope', '$location', '$filter', '$scope', '$timeout', 'requestToListener'];

    function accountController($rootScope, $location, $filter, $scope, $timeout, requestToListener) {
        let vm = this;

        // Call function on page load to fetch the data.
        vm.$onInit = function() {
            // get data from the parent component
            vm.formData = vm.parent.getData();
            // Call function to set current form class as active.
            vm.setFormStatus();

            // Hide display spinner on load
            vm.formData.displaySpinner = true;

            // Hide shared error message
            vm.sharedErrorMessage = true;
        }

        // Method to to set current form class as active and set flag for translation.
        vm.setFormStatus = function() {
            vm.formData.searchForm = "";
            vm.formData.accountForm = 'active';
            vm.formData.secureForm.status = "";
            vm.formData.secureForm.flag = null;
            vm.formData.preferenceForm.status = "";
            vm.formData.preferenceForm.flag = null;
            vm.formData.agreementForm.status = "";
            vm.formData.agreementForm.flag = null;
            vm.formData.successForm.status = "";
            vm.formData.successForm.flag = null;
        }

        vm.openAccount = function() {
            vm.formData.formFieldsData.accountExists = 1;
            $location.path('/form/login');
        }

        vm.createAccount = function() {
            vm.formData.formFieldsData.accountExists = 0;
            $location.path('/form/verification');
        }

    };

})();