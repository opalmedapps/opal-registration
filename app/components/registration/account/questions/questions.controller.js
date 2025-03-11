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

    questionsController.$inject = ['$rootScope', '$location', '$filter', '$scope', '$timeout', 'requestToListener'];

    function questionsController($rootScope, $location, $filter, $scope, $timeout, requestToListener) {
        let vm = this;
        vm.submitError = undefined;
        $scope.email = undefined;

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

        // Function to validate security question1.
        vm.validateSecurityQuestion1 = function () {

            if (vm.formData.formFieldsData.securityQuestion1 == undefined || vm.formData.formFieldsData.securityQuestion1 == null || vm.formData.formFieldsData.securityQuestion1 == "") {
                vm.formData.securityQuestion1Format.status = 'invalid';
                vm.formData.securityQuestion1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            }
            else {
                vm.formData.securityQuestion1Format.status = 'valid';
                vm.formData.securityQuestion1Format.message = null;

                // Trim the space in security answers
                if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer1.
        vm.validateAnswer1 = function () {

            if (vm.formData.formFieldsData.answer1 == undefined || vm.formData.formFieldsData.answer1 == null || vm.formData.formFieldsData.answer1 == "") {
                vm.formData.answer1Format.status = 'invalid';
                vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            }
            else {
                if ((vm.formData.formFieldsData.answer1 == vm.formData.formFieldsData.answer2) || (vm.formData.formFieldsData.answer1 == vm.formData.formFieldsData.answer3)) {
                    vm.formData.answer1Format.status = 'invalid';
                    vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                }
                else if (vm.formData.formFieldsData.answer1.length < 3) {
                    vm.formData.answer1Format.status = 'invalid';
                    vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                }
                else {
                    vm.formData.answer1Format.status = 'valid';
                    vm.formData.answer1Format.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }

        // Function to validate security question2.
        vm.validateSecurityQuestion2 = function () {

            if (vm.formData.formFieldsData.securityQuestion2 == undefined || vm.formData.formFieldsData.securityQuestion2 == null || vm.formData.formFieldsData.securityQuestion2 == "") {
                vm.formData.securityQuestion2Format.status = 'invalid';
                vm.formData.securityQuestion2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            }
            else {
                vm.formData.securityQuestion2Format.status = 'valid';
                vm.formData.securityQuestion2Format.message = null;

                if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer2.
        vm.validateAnswer2 = function () {

            if (vm.formData.formFieldsData.answer2 == undefined || vm.formData.formFieldsData.answer2 == null || vm.formData.formFieldsData.answer2 == "") {
                vm.formData.answer2Format.status = 'invalid';
                vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            }
            else {
                if ((vm.formData.formFieldsData.answer2 == vm.formData.formFieldsData.answer1) || (vm.formData.formFieldsData.answer2 == vm.formData.formFieldsData.answer3)) {
                    vm.formData.answer2Format.status = 'invalid';
                    vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                }
                else if (vm.formData.formFieldsData.answer2.length < 3) {
                    vm.formData.answer2Format.status = 'invalid';
                    vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                }
                else {
                    vm.formData.answer2Format.status = 'valid';
                    vm.formData.answer2Format.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }


        // Function to validate security question3.
        vm.validateSecurityQuestion3 = function () {

            if (vm.formData.formFieldsData.securityQuestion3 == undefined || vm.formData.formFieldsData.securityQuestion3 == null || vm.formData.formFieldsData.securityQuestion3 == "") {
                vm.formData.securityQuestion3Format.status = 'invalid';
                vm.formData.securityQuestion3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            }
            else {
                vm.formData.securityQuestion3Format.status = 'valid';
                vm.formData.securityQuestion3Format.message = null;

                if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer3.
        vm.validateAnswer3 = function () {

            if (vm.formData.formFieldsData.answer3 == undefined || vm.formData.formFieldsData.answer3 == null || vm.formData.formFieldsData.answer3 == "") {
                vm.formData.answer3Format.status = 'invalid',
                    vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            }
            else {
                if ((vm.formData.formFieldsData.answer3 == vm.formData.formFieldsData.answer1) || (vm.formData.formFieldsData.answer3 == vm.formData.formFieldsData.answer2)) {
                    vm.formData.answer3Format.status = 'invalid',
                        vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                }
                else if (vm.formData.formFieldsData.answer3.length < 3) {
                    vm.formData.answer3Format.status = 'invalid';
                    vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                }
                else {
                    vm.formData.answer3Format.status = 'valid';
                    vm.formData.answer3Format.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }

        vm.questionsFormSubmit = function() {
            if (vm.formData.formFieldsData.securityQuestion1 == undefined || vm.formData.formFieldsData.securityQuestion1 == null || vm.formData.formFieldsData.securityQuestion1 == "") {
                vm.formData.securityQuestion1Format.status = 'invalid';
                vm.formData.securityQuestion1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.answer1 == undefined || vm.formData.formFieldsData.answer1 == null || vm.formData.formFieldsData.answer1 == "") {
                vm.formData.answer1Format.status = 'invalid';
                vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.securityQuestion2 == undefined || vm.formData.formFieldsData.securityQuestion2 == null || vm.formData.formFieldsData.securityQuestion2 == "") {
                vm.formData.securityQuestion2Format.status = 'invalid';
                vm.formData.securityQuestion2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.answer2 == undefined || vm.formData.formFieldsData.answer2 == null || vm.formData.formFieldsData.answer2 == "") {
                vm.formData.answer2Format.status = 'invalid';
                vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.securityQuestion3 == undefined || vm.formData.formFieldsData.securityQuestion3 == null || vm.formData.formFieldsData.securityQuestion3 == "") {
                vm.formData.securityQuestion3Format.status = 'invalid';
                vm.formData.securityQuestion3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.answer3 == undefined || vm.formData.formFieldsData.answer3 == null || vm.formData.formFieldsData.answer3 == "") {
                vm.formData.answer3Format.status = 'invalid';
                vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.securityQuestion1Format.status == 'valid' &&
                vm.formData.answer1Format.status == 'valid' &&
                vm.formData.securityQuestion2Format.status == 'valid' &&
                vm.formData.answer2Format.status == 'valid' &&
                vm.formData.securityQuestion3Format.status == 'valid' &&
                vm.formData.answer3Format.status == 'valid') {

                // Hide shared error message
                vm.sharedErrorMessage = true;


                vm.formData.formFieldsData.answer1 = vm.formData.formFieldsData.answer1.toUpperCase();
                vm.formData.formFieldsData.answer2 = vm.formData.formFieldsData.answer2.toUpperCase();
                vm.formData.formFieldsData.answer3 = vm.formData.formFieldsData.answer3.toUpperCase();

                // Call function ot language list
                vm.languageList();
            }
        }

        // Function to call service to get language list.
        vm.languageList = function () {

            // Method to get security questions list from database
            let parameters = vm.formData.formFieldsData.ramq;

            requestToListener.sendRequestWithResponse('LanguageList', { Fields: parameters })
                .then(function (response) {

                    // Get the value from result response and bind values into dropdown
                    var languageList = response.Data[0];

                    // Check length of the variable
                    if (languageList.length > 1) {

                        // Define loop for passing the value of language option.
                        for (var i = 0; i < languageList.length; i++) {

                            // Assing in JSON format
                            vm.formData.languageList_EN[i] = {
                                "ID": languageList[i].Id,
                                "PREFIX": languageList[i].Prefix,
                                "VALUE": languageList[i].LanguageName_EN
                            }

                            vm.formData.languageList_FR[i] = {
                                "ID": languageList[i].Id,
                                "PREFIX": languageList[i].Prefix,
                                "VALUE": languageList[i].LanguageName_FR
                            }
                        }

                        // Check the default selected language.
                        if (vm.formData.selectedLanguage == 'en')
                            vm.formData.languageList = vm.formData.languageList_EN;
                        else
                            vm.formData.languageList = vm.formData.languageList_FR;

                        // Hide display spinner if service get error.
                        vm.formData.displaySpinner = true;

                        $rootScope.$apply(function () {
                            $location.path('/form/opalPreference');
                        });
                    }

                    else {
                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        vm.parent.displayError(errorModalPage);

                    }

                })
                .catch(function (error) {

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage);
                });
        }
    };

})();