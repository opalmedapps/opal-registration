/**
     Filename     :   verification.controller.js
     Description  :   Control the verification.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   LL
     Date         :   2022-04-13
 **/

(function () {
    'use strict';

    angular.module('myApp')
        .controller('verificationController', verificationController);

    verificationController.$inject = ['$rootScope', '$location', '$filter', '$scope', '$timeout', 'requestToListener', 'userAuthorizationService', 'encryptionService'];

    function verificationController($rootScope, $location, $filter, $scope, $timeout, requestToListener, userAuthorizationService, encryptionService) {
        let vm = this;
        vm.verificationCode = undefined;
        vm.inputCode = undefined;
        vm.sendCode = false;
        vm.verifyCode = false;
        vm.isCodeValid = false;

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

        vm.sendVerificationCode = function() {
            vm.sendCode = true;

            const request = {
                method: 'post',
                url: '/api/registration/${vm.formData.formFieldsData.registrationCode}/verify-email/',
            };

            requestToListener.apiRequest(request, vm.formData.selectedLanguage, {'email': vm.email})
                .then(function (response) {
                })
                .catch(function (error) {
                    vm.parent.errorPopup();
                });
        }
        vm.checkVerificationCode = function() {
            // Listener service call.
            const request = {
                method: 'post',
                url: '/api/registration/${vm.formData.formFieldsData.registrationCode}/verify-email-code/',
            };
            requestToListener.apiRequest(request, vm.formData.selectedLanguage, {'code': vm.inputCode, 'email': vm.email})
                .then(function (response) {
                    $timeout(() => {
                        vm.verifyCode = true;
                        vm.isCodeValid = response?.status_code === 200;
                    })
                })
                .catch(function (error) {
                    vm.parent.errorPopup();
                });
        }
        vm.resendVerificationCode = function() {
            vm.isCodeValid = false;
            vm.sendCode = false;
            vm.verifyCode = false;
        }
        vm.verificationFormSubmit = function() {
            vm.formData.formFieldsData.email = vm.email;
            $location.path('/form/secureInformation');

        }
    };

})();