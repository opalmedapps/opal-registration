// SPDX-FileCopyrightText: Copyright (C) 2022 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
        vm.showCodeMessage= false;
        vm.verifyCode = false;
        vm.isCodeValid = false;
        vm.countdownSeconds = 60;

        const textContent = document.getElementById('count_down')?.textContent;
        document.getElementById('resend_btn').setAttribute('disabled','disabled');

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

        vm.setFormStatus = function() {
            vm.formData.searchForm = "";
            vm.formData.secureForm.flag = null;
            vm.formData.preferenceForm.status = "";
            vm.formData.preferenceForm.flag = null;
            vm.formData.agreementForm.status = "";
            vm.formData.agreementForm.flag = null;
            vm.formData.successForm.status = "";
            vm.formData.successForm.flag = null;
        }

        vm.checkEmailAndSendVerificationCode = function() {
            requestToListener.sendRequestWithResponse('CheckEmailExistsInFirebase', { Fields: {'email': vm.email} })
                .then(function (response) {
                    if (response?.Data?.errorInfo?.code == 'auth/user-not-found') {
                        vm.sendVerificationCode();
                    } else if (response?.Data?.uid) {
                        vm.parent.errorPopup('emailExistingError');
                        $timeout(() => {
                            $location.path('/form/login');
                        });
                    } else {
                        vm.parent.errorPopup('contactUsError');
                    }
                })
                .catch(function (error) {
                    // Call function to display error modal box.
                    vm.parent.errorPopup('contactUsError');
                });
        }

        vm.sendVerificationCode = async function() {
            const request = {
                method: 'post',
                url: `/api/registration/${vm.formData.formFieldsData.registrationCode}/verify-email/`,
            };
            try {
                await requestToListener.apiRequest(request, vm.formData.selectedLanguage, {'email': vm.email});
                document.getElementById('resend_btn').setAttribute('disabled','disabled');

                $timeout(() => {
                    vm.sendCode = true;
                    vm.showCodeMessage= true;
                    let countDown = vm.countdownSeconds;
                    let time = setInterval(function () {
                        if (document.getElementById('count_down')) {
                            document.getElementById('count_down').textContent = countDown + textContent;
                            countDown--;
                            if (countDown < 0) {
                                clearInterval(time);
                                document.getElementById('count_down').textContent = '';
                                document.getElementById('resend_btn').removeAttribute('disabled');
                            }
                        }
                    }, 1000);
                });

            } catch(error) {
                console.log(error);
                if (error.status_code === 400) {
                    vm.parent.errorPopup('emailExistingError');
                }
                else {
                    vm.parent.errorPopup('contactUsError');
                }
            }
        }

        vm.checkVerificationCode = async function() {
            // Listener service call.
            const request = {
                method: 'post',
                url: `/api/registration/${vm.formData.formFieldsData.registrationCode}/verify-email-code/`,
            };
            try {
                const response = await requestToListener.apiRequest(
                    request,
                    vm.formData.selectedLanguage,
                    {'code': vm.inputCode, 'email': vm.email}
                );
                $timeout(() => {
                    vm.verifyCode = true;
                    vm.isCodeValid = response?.status_code === "200";
                    vm.showCodeMessage= false;
                });
            } catch (error) {
                $timeout(() => {
                    console.error(error);
                    vm.verifyCode = true;
                    vm.showCodeMessage= false;
                });
            }
        }

        vm.resendVerificationCode = function() {
            vm.isCodeValid = false;
            vm.sendCode = false;
            vm.verifyCode = false;
            vm.sendCode = false;
            vm.showCodeMessage= false;
        }

        vm.verificationFormSubmit = function() {
            vm.formData.formFieldsData.email = vm.email;
            $location.path('/form/secureInformation');
            vm.showCodeMessage = false;

        }
        vm.resetCodeValidity = function() {
            vm.verifyCode = false;
            vm.isCodeValid = false;
        };
    };

})();
