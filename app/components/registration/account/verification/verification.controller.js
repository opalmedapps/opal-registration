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
            let parameters = {
                'email': vm.email,
            };

            // Listener service call.
            requestToListener.sendRequestWithResponse('SendVerificationCode', parameters)
            .then(function (response) {

                if (response.Data[0].Result == 'SUCCESS') {
                    // Call function to validate IPAddress.

                } else {

                    // Call function to display error modal box.
                    const errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                    vm.parent.displayError(errorModalPage);
                }

            })
            .catch(function (error) {

                // Call function to display error modal box.
                const errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                vm.parent.displayError(errorModalPage);
            });
        }
        vm.checkVerificationCode = function() {
            vm.verifyCode = true;
            let parameters = {
                'email': vm.email,
            };
            // Listener service call.
            requestToListener.sendRequestWithResponse('verifyVerificationCode', parameters)
            .then(function (response) {

                if (response.Data[0].Result == 'SUCCESS') {
                    // Call function to validate IPAddress.
                    vm.isCodeValid = true;
                } else {

                    vm.isCodeValid = false;
                    const errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                    vm.parent.displayError(errorModalPage);
                }

            })
            .catch(function (error) {

                vm.isCodeValid = false;
                const errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                vm.parent.displayError(errorModalPage);
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