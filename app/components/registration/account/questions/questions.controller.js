// SPDX-FileCopyrightText: Copyright (C) 2022 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
     Filename     :   questions.controller.js
     Description  :   Control the login.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   LL
     Date         :   2022-04-07
 **/

(function () {
    'use strict';

    angular.module('myApp')
        .controller('questionsController', questionsController);

    questionsController.$inject = ['$rootScope', '$location', '$filter', '$scope', '$timeout', 'requestToListener', 'apiConstants'];

    function questionsController($rootScope, $location, $filter, $scope, $timeout, requestToListener, apiConstants) {
        let vm = this;
        vm.submitError = undefined;

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

        //
        vm.allStatusValid = function() {
            return vm.formData.phoneFormat.status === vm.parent.STATUS_VALID &&
                vm.formData.securityQuestion1Format.status === vm.parent.STATUS_VALID &&
                vm.formData.answer1Format.status === vm.parent.STATUS_VALID &&
                vm.formData.securityQuestion2Format.status === vm.parent.STATUS_VALID &&
                vm.formData.answer2Format.status === vm.parent.STATUS_VALID &&
                vm.formData.securityQuestion3Format.status === vm.parent.STATUS_VALID &&
                vm.formData.answer3Format.status === vm.parent.STATUS_VALID;
        }

        // Function to validate phone
        vm.validatePhone = function () {

            //Variable to set field status and message.
            const phone = vm.formData.formFieldsData.phone;

            if (vm.parent.isEmpty(phone)) {
                vm.formData.phoneFormat.status = vm.parent.STATUS_INVALID;
                //vm.formData.passwordFormat.message = null;
                vm.formData.phoneFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PHONEREQUIRED');
            } else {
                if (phone.toString().length < 12) {
                    vm.formData.phoneFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.phoneFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PHONEINVALID');
                    return;
                } else if (phone.toString().length > 12) {
                    vm.formData.phoneFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.phoneFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PHONEINVALID');
                    return;
                } else {
                    vm.formData.phoneFormat.status = vm.parent.STATUS_VALID;
                    vm.formData.phoneFormat.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;

                    }
                }
            }
        }

        vm.securityQuestion1 = function (securityQuestion) {
            return (!(vm.formData.formFieldsData.securityQuestion1 && vm.formData.formFieldsData.securityQuestion1) || securityQuestion.id != vm.formData.formFieldsData.securityQuestion1);
        };
        vm.securityQuestion2 = function (securityQuestion) {
            return (!(vm.formData.formFieldsData.securityQuestion2 && vm.formData.formFieldsData.securityQuestion2) || securityQuestion.id != vm.formData.formFieldsData.securityQuestion2);
        };
        vm.securityQuestion3 = function (securityQuestion) {
            return (!(vm.formData.formFieldsData.securityQuestion3 && vm.formData.formFieldsData.securityQuestion3) || securityQuestion.id != vm.formData.formFieldsData.securityQuestion3);
        };

        // Function to validate security question1.
        vm.validateSecurityQuestion1 = function () {

            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion1)) {
                vm.formData.securityQuestion1Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            } else {
                vm.formData.securityQuestion1Format.status = vm.parent.STATUS_VALID;
                vm.formData.securityQuestion1Format.message = null;

                // Trim the space in security answers
                if (vm.allStatusValid()) {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer1.
        vm.validateAnswer1 = function () {

            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer1)) {
                vm.formData.answer1Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            } else {
                if (vm.formData.formFieldsData.answer1 === vm.formData.formFieldsData.answer2 ||
                    vm.formData.formFieldsData.answer1 === vm.formData.formFieldsData.answer3) {
                    vm.formData.answer1Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                } else if (vm.formData.formFieldsData.answer1.length < 3) {
                    vm.formData.answer1Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                } else {
                    vm.formData.answer1Format.status = vm.parent.STATUS_VALID;
                    vm.formData.answer1Format.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }

        // Function to validate security question2.
        vm.validateSecurityQuestion2 = function () {

            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion2)) {
                vm.formData.securityQuestion2Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            } else {
                vm.formData.securityQuestion2Format.status = vm.parent.STATUS_VALID;
                vm.formData.securityQuestion2Format.message = null;

                if (vm.allStatusValid()) {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer2.
        vm.validateAnswer2 = function () {

            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer2)) {
                vm.formData.answer2Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            } else {
                if (vm.formData.formFieldsData.answer2 === vm.formData.formFieldsData.answer1 ||
                    vm.formData.formFieldsData.answer2 === vm.formData.formFieldsData.answer3) {
                    vm.formData.answer2Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                } else if (vm.formData.formFieldsData.answer2.length < 3) {
                    vm.formData.answer2Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                } else {
                    vm.formData.answer2Format.status = vm.parent.STATUS_VALID;
                    vm.formData.answer2Format.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }


        // Function to validate security question3.
        vm.validateSecurityQuestion3 = function () {

            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion3)) {
                vm.formData.securityQuestion3Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            } else {
                vm.formData.securityQuestion3Format.status = vm.parent.STATUS_VALID;
                vm.formData.securityQuestion3Format.message = null;

                if (vm.allStatusValid()) {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer3.
        vm.validateAnswer3 = function () {

            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer3)) {
                vm.formData.answer3Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            } else {
                if (vm.formData.formFieldsData.answer3 === vm.formData.formFieldsData.answer1 ||
                    vm.formData.formFieldsData.answer3 === vm.formData.formFieldsData.answer2) {
                    vm.formData.answer3Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                } else if (vm.formData.formFieldsData.answer3.length < 3) {
                    vm.formData.answer3Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                } else {
                    vm.formData.answer3Format.status = vm.parent.STATUS_VALID;
                    vm.formData.answer3Format.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }

        vm.questionsFormSubmit = function() {
            if (vm.parent.isEmpty(vm.formData.formFieldsData.phone)) {
                vm.formData.phoneFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.phoneFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PHONEREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion1)) {
                vm.formData.securityQuestion1Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer1)) {
                vm.formData.answer1Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion2)) {
                vm.formData.securityQuestion2Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer2)) {
                vm.formData.answer2Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion3)) {
                vm.formData.securityQuestion3Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer3)) {
                vm.formData.answer3Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.allStatusValid()) {

                // Hide shared error message
                vm.sharedErrorMessage = true;

                // Call function to get language list
                vm.parent.languageListForPreference();
            }
        }
    }

})();
