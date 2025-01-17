// SPDX-FileCopyrightText: Copyright 2020 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   agreement.controller.js
     Description  :   Controlle the agreement.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';
    angular.module('myApp')
        .controller('agreementController', agreementController);

    agreementController.$inject = ['$location', '$filter', '$rootScope', '$timeout', 'requestToListener', 'userAuthorizationService', 'encryptionService'];

    function agreementController($location, $filter, $rootScope, $timeout, requestToListener, userAuthorizationService, encryptionService) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Fetch broadcast event and change the field error message language.
        $rootScope.$on("changeLanguage", function () {
            $timeout(function () {

                // Check the field error values
                vm.validateAgreementSign();
            });
        });

        // Call function on page load to fetch the data.
        vm.$onInit = activate;
        function activate() {
            // get data from the parent component
            vm.formData = vm.parent.getData();

            vm.formData.termsOfUseDisplayed = (vm.formData.selectedLanguage === 'fr') ? vm.formData.termsOfUseBase64_FR : vm.formData.termsOfUseBase64_EN;

            // Hide display spinner
            vm.formData.displaySpinner = false;

            // Call function to set current form class as active.
            vm.setFormStatus();

            // Hide shared error message
            vm.sharedErrorMessage = true;
        }

        //Function to validate aggrementSign checkbox
        vm.validateAgreementSign = function () {
            if (vm.formData.formFieldsData.termsandAggreementSign === undefined || vm.formData.formFieldsData.termsandAggreementSign === null || vm.formData.formFieldsData.termsandAggreementSign === "" || vm.formData.formFieldsData.termsandAggreementSign === false) {
                vm.formData.termsandAggreementSignFormat.status = 'invalid';
                vm.formData.termsandAggreementSignFormat.message = $filter('translate')('AGREEMENT.FIELDERRORMESSAGES.ACCEPTCHECKBOXREQUIRED');

                vm.sharedErrorMessage = false;
            }
            else {
                vm.formData.termsandAggreementSignFormat.status = 'valid';
                vm.formData.termsandAggreementSignFormat.message = null;

                vm.sharedErrorMessage = true;
            }
        }

        // Method to to set current form class as active.
        vm.setFormStatus = function () {
            vm.formData.searchForm = "";
            vm.formData.secureForm.status = "";
            vm.formData.secureForm.flag = 1;
            vm.formData.preferenceForm.status = "";
            vm.formData.preferenceForm.flag = 1;
            vm.formData.agreementForm.status = "active";
            vm.formData.agreementForm.flag = 1;
            vm.formData.successForm.status = "";
            vm.formData.successForm.flag = null;
        }

        //Form on submit method
        vm.agreementFormSubmit = function () {
            if (vm.formData.formFieldsData.termsandAggreementSign === undefined || vm.formData.formFieldsData.termsandAggreementSign === null || vm.formData.formFieldsData.termsandAggreementSign === "" || vm.formData.formFieldsData.termsandAggreementSign === false) {
                vm.formData.termsandAggreementSignFormat.status = 'invalid';
                vm.formData.termsandAggreementSignFormat.message = $filter('translate')('AGREEMENT.FIELDERRORMESSAGES.ACCEPTCHECKBOXREQUIRED');

                vm.sharedErrorMessage = false;
            }
            if (vm.formData.termsandAggreementSignFormat.status === 'valid') {

                vm.sharedErrorMessage = true;

                // Display display spinner before calling service
                vm.formData.displaySpinner = true;

                if (vm.formData.accessToken) {
                    vm.formData.formFieldsData.accessToken = vm.formData.accessToken;
                }

                // Handle security questions if they were shown to the user
                if (vm.formData.formFieldsData.answer1) {
                    // Add question strings to the form
                    for (let i = 1; i <= 3; i++) {
                        let questionId = vm.formData.formFieldsData[`securityQuestion${i}`];
                        vm.formData.formFieldsData[`securityQuestionText${i}`] = vm.formData.securityQuestionList.find(
                            question => question.id === questionId
                        ).value;
                    }

                    // Uppercase and hash answers before sending them to the backend
                    vm.formData.formFieldsData.answer1 = encryptionService.hash(vm.formData.formFieldsData.answer1.toUpperCase());
                    vm.formData.formFieldsData.answer2 = encryptionService.hash(vm.formData.formFieldsData.answer2.toUpperCase());
                    vm.formData.formFieldsData.answer3 = encryptionService.hash(vm.formData.formFieldsData.answer3.toUpperCase());
                }

                vm.registerPatient();
            }
        }

        // Function to call service for register patient
        vm.registerPatient = function () {

            const parameters = vm.formData.formFieldsData;

            // Call service to register user.
            requestToListener.sendRequestWithResponse('RegisterPatient', { Fields: parameters })
                .then(function (response) {
                    if (response === undefined || response === null || response === "") {

                        // Call function to display error modal box.
                        vm.parent.errorPopup('contactUsError');
                    } else {
                        if (response.Data[0].Result === "Successfully Update") {
                            // Hide display spinner after all request get response.
                            vm.formData.displaySpinner = false;

                            // Call function to reset the fields value
                            vm.parent.resetFields();

                            // Call function to clear user authorized value
                            userAuthorizationService.clearUserAuthorizationInfomation();
                            encryptionService.resetEncryptionHash();

                            // Redirect to last successful page
                            $rootScope.$apply(function () {
                                $location.path('/form/registrationSuccessful');
                            });
                        } else {
                            // Call function to display error modal box.
                            vm.parent.errorPopup('contactUsError');
                        }
                    }
                })
                .catch(function (error) {
                    // Call function to display error modal box.
                    vm.parent.errorPopup('contactUsError');
                });
        }

        vm.downloadTermsOfUse = function (event) {
            event.preventDefault();

            const downloadLink = document.createElement('a');

            downloadLink.href = vm.formData.termsOfUseDisplayed;
            downloadLink.download = 'opal-agreement.pdf';
            downloadLink.target = '_blank';
            downloadLink.click();
        }
    }
})();
