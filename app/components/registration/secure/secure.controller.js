// SPDX-FileCopyrightText: Copyright 2019 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   secure.controller.js
     Description  :   Controlle the secure.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   Opal Health Informatics Group
     Date         :   June 2019
 **/
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import * as zxcvbnFrPackage from '@zxcvbn-ts/language-fr';

(function () {
    'use strict';
    angular.module('myApp')

        .directive('passwordChecker', [function() {
            return {
                // restrict to only attribute and class
                restrict: 'AC',

                // use the NgModelController
                require: 'ngModel',

                // add the NgModelController as a dependency to your link function
                link: function ($scope, $element) {
                    $element.on('blur change keydown paste', function (evt) {
                        $scope.$evalAsync(function ($scope) {
                            // Get a reference to the parent scope which expects the password strength
                            let $parentScope = $scope.$parent?.$parent;
                            if(!$parentScope) throw new Error('Could not access parent scope for the password strength checker');

                            // update the $scope.password with the element's value
                            $scope.password = $element.val();

                            // Extract user's email address and username
                            const email = angular.element('input[name="email"]').val();
                            const username = email.substring(0, email.indexOf("@"));
                            // resolve password strength score using zxcvbn service
                            if ($scope.password.length >= 1 && $scope.password.length <= 50)
                                $parentScope.passwordStrength = zxcvbn($scope.password, [email, username]).score;
                            else
                                $parentScope.passwordStrength = null;
                        });
                    });
                }
            };
        }])

        // Secure page controller
        .controller('secureController', secureController);

    secureController.$inject = ['$rootScope', '$location', '$filter', '$scope', '$timeout'];

    function secureController($rootScope, $location, $filter, $scope, $timeout) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Fetch broadcast event and change the field error message language.
        $rootScope.$on("changeLanguage", function () {
            $timeout(function () {

                // Check the field error values
                vm.validatePassword();
                vm.validateConfirmPassword();
                vm.validatePhone();
                vm.validateSecurityQuestion1();
                vm.validateAnswer1();
                vm.validateSecurityQuestion2();
                vm.validateAnswer2();
                vm.validateSecurityQuestion3();
                vm.validateAnswer3();
            });
        });

        // Call function on page load to fetch the data.
        vm.$onInit = activate;
        function activate() {
            // get data from the parent component
            vm.formData = vm.parent.getData();

            // Call function to set current form class as active.
            vm.setFormStatus();

            // Setup zxcvbn password strength estimator
            const options = {
                graphs: zxcvbnCommonPackage.adjacencyGraphs,
                dictionary: {
                    ...zxcvbnCommonPackage.dictionary,
                    ...zxcvbnEnPackage.dictionary,
                    ...zxcvbnFrPackage.dictionary,
                },
            }
            zxcvbnOptions.setOptions(options);

            // Hide display spinner on load
            vm.formData.displaySpinner = false;

            // Hide shared error message
            vm.sharedErrorMessage = true;

        }

        vm.allStatusValid = function() {
            return vm.formData.passwordFormat.status == vm.parent.STATUS_VALID &&
                vm.formData.confirmPasswordFormat.status == vm.parent.STATUS_VALID &&
                vm.formData.phoneFormat.status == vm.parent.STATUS_VALID &&
                vm.formData.securityQuestion1Format.status == vm.parent.STATUS_VALID &&
                vm.formData.answer1Format.status == vm.parent.STATUS_VALID &&
                vm.formData.securityQuestion2Format.status == vm.parent.STATUS_VALID &&
                vm.formData.answer2Format.status == vm.parent.STATUS_VALID &&
                vm.formData.securityQuestion3Format.status == vm.parent.STATUS_VALID &&
                vm.formData.answer3Format.status == vm.parent.STATUS_VALID;
        }

        // Method to to set current form class as active.
        vm.setFormStatus = function () {
            vm.formData.searchForm = "";
            vm.formData.secureForm.status = "active";
            vm.formData.secureForm.flag = 1;
            vm.formData.preferenceForm.status = "";
            vm.formData.preferenceForm.flag = null;
            vm.formData.agreementForm.status = "";
            vm.formData.agreementForm.flag = null;
            vm.formData.successForm.status = "";
            vm.formData.successForm.flag = null;
        }

        // Controls the placement of the eye icon in the password field
        vm.passwordEyeStyle = () => {
            let basicOffset = -2;
            let validityOffset = vm.formData.passwordFormat.status ? -1.4 : 0;

            // The length counter becomes wider every time a digit is added (e.g. 1 vs 10 vs 100)
            let passwordLength = vm.formData.formFieldsData.password?.length || 0;
            let digitsInPasswordLength = passwordLength.toString().length;
            let lengthCounterOffset = passwordLength > 0 ? (-2 - 0.4 * digitsInPasswordLength) : 0;

            return {
                'margin-left': `${lengthCounterOffset + validityOffset + basicOffset}em`,
            };
        }

        // Controls the placement of the eye icon in the confirm password field
        vm.confirmPasswordEyeStyle = () => {
            let basicOffset = -2;
            let validityOffset = vm.formData.confirmPasswordFormat.status ? -1.4 : 0;

            return {
                'margin-left': `${validityOffset + basicOffset}em`,
            };
        }

        // Function to validate password
        vm.validatePassword = function () {
            // If the password is strong via zxcvbn, but invalid via our own requirements,
            // lower the strength to the highest invalid level. This makes the UI clearer
            // by showing a low strength for passwords we consider invalid.
            const minPasswordStrength = 3;

            //Variable to set field status and message.
            vm.passwordFormat = { status: null, message: null };
            vm.formData.passwordMeter = $scope.passwordStrength;
            if (vm.parent.isEmpty(vm.formData.formFieldsData.password)) {
                vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                //vm.formData.passwordFormat.message = null;
                vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDREQUIRED');
            } else {
                if (vm.formData.formFieldsData.password.length < 10) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SHORTPASSWORDLENGTH');
                    vm.formData.passwordMeter = $scope.passwordStrength >= minPasswordStrength ? minPasswordStrength - 1 : $scope.passwordStrength;
                    return;
                } else if (vm.passwordContainsDomainName(vm.formData.formFieldsData.password)) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDINVALIDDOMAINNAME');
                    vm.formData.passwordMeter = $scope.passwordStrength >= minPasswordStrength ? minPasswordStrength - 1 : $scope.passwordStrength;
                    return;
                } else if (vm.passwordContainsPersonalInformation(vm.formData.formFieldsData.password)) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDPERSONALINFORMATION');
                    vm.formData.passwordMeter = $scope.passwordStrength >= minPasswordStrength ? minPasswordStrength - 1 : $scope.passwordStrength;
                    return;
                } else if (vm.formData.formFieldsData.password.length > 50) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.LONGPASSWORDLENGTH');
                    vm.formData.passwordMeter = $scope.passwordStrength >= minPasswordStrength ? minPasswordStrength - 1 : $scope.passwordStrength;
                    return;
                } else if (vm.formData.formFieldsData.password.search(/\d/) === -1) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDINVALIDNUMBER');
                    vm.formData.passwordMeter = $scope.passwordStrength >= minPasswordStrength ? minPasswordStrength - 1 : $scope.passwordStrength;
                    return;
                } else if (vm.formData.formFieldsData.password.search(/[A-Z]/) === -1) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDINVALIDCAPITAL');
                    vm.formData.passwordMeter = $scope.passwordStrength >= minPasswordStrength ? minPasswordStrength - 1 : $scope.passwordStrength;
                    return;
                } else if (vm.formData.formFieldsData.password.search(/[a-z]/) === -1) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDINVALIDLOWERCASE');
                    vm.formData.passwordMeter = $scope.passwordStrength >= minPasswordStrength ? minPasswordStrength - 1 : $scope.passwordStrength;
                    return;
                } else if (vm.formData.formFieldsData.password.search(/\W|_{1}/) === -1) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDINVALIDSPECIALCHAR');
                    vm.formData.passwordMeter = $scope.passwordStrength >= minPasswordStrength ? minPasswordStrength - 1 : $scope.passwordStrength;
                    return;
                } else if ($scope.passwordStrength < 3) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDINVALIDSTRENGTH');
                    return;
                } else {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_VALID;
                    vm.formData.passwordFormat.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;

                    }
                }
            }
        }
        // Function that limits the user from entering the Opal domain name in their passowrd
        vm.passwordContainsDomainName = function(password) {
            var opalRegex = /[0o@&]p[a@&4][l1!]/;              // edge cases for the word opal
            return opalRegex.test(password.toLowerCase());     // returns true if one of the case is detected
        }

        // Function that checks for the user's personal information in the password
        vm.passwordContainsPersonalInformation = function(password){
            var userMRN = vm.formData.mrn;
            var userRAMQ = vm.formData.ramq.toLowerCase();
            var RAMQLetters = userRAMQ.substring(0,4);
            var RAMQNumbers = userRAMQ.substring(4,12);

            let firstName = vm.formData.firstName.toLowerCase();
            let lastName = vm.formData.lastName.toLowerCase();
            let caregiverFirstName = vm.formData.caregiverFirstName.toLowerCase();
            let caregiverLastName = vm.formData.caregiverLastName.toLowerCase();

            const [emailUsername, emailDomain] = vm.formData.formFieldsData.email.toLowerCase().split('@');

            // List of string that should not be contained in the user's password
            let blacklist = [userMRN, RAMQLetters, RAMQNumbers, firstName, lastName, caregiverFirstName, caregiverLastName, emailUsername, emailDomain];

            for (const term of blacklist){
                // A term can be an empty string in some cases, e.g., if the patient has no RAMQ
                if (term && password.toLowerCase().includes(term)){
                    return true;
                }
            }
            return false;
        }

        // Function to compare password and confirm password fields.
        vm.validateConfirmPassword = function () {
            if (vm.parent.isEmpty(vm.formData.confirmPassword)) {
                vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.CONFIRMPASSWORDREQUIRED');
            } else {
                if (vm.formData.formFieldsData.password != vm.formData.confirmPassword) {
                    vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.COMPAREPASSWORD');
                }
                else {
                    vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_VALID;
                    vm.formData.confirmPasswordFormat.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }

            }
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
                } else if (!phone.match(/^\+(?:[0-9] ?){6,14}[0-9]$/)) {
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
                if (vm.formData.formFieldsData.answer1 == vm.formData.formFieldsData.answer2 || vm.formData.formFieldsData.answer1 == vm.formData.formFieldsData.answer3) {
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
                if (vm.formData.formFieldsData.answer2 == vm.formData.formFieldsData.answer1 || vm.formData.formFieldsData.answer2 == vm.formData.formFieldsData.answer3) {
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
            vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion3)
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
                vm.formData.answer3Format.status = vm.parent.STATUS_INVALID,
                    vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            } else {
                if (vm.formData.formFieldsData.answer3 == vm.formData.formFieldsData.answer1 || vm.formData.formFieldsData.answer3 == vm.formData.formFieldsData.answer2) {
                    vm.formData.answer3Format.status = vm.parent.STATUS_INVALID,
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

        // Secure form onsubmit method
        vm.secureFormSubmit = function () {
            //Validate all fields as required fields
            if (vm.parent.isEmpty(vm.formData.formFieldsData.email)) {
                vm.formData.emailFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.emailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.EMAILREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.confirmEmail)) {
                vm.formData.confirmEmailFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.confirmEmailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.CONFIRMEMAILREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.password)) {
                vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.confirmPassword)) {
                vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.CONFIRMPASSWORDREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
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

                // Call function ot language list
                vm.parent.languageListForPreference();
            }
        }
    };
})();
