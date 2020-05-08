/**
     Filename     :   preference.controller.js
     Description  :   Controlle the preference.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';
    angular.module('myApp')
        .controller('preferenceController', preferenceController);

    preferenceController.$inject = ['$location', '$filter', '$rootScope', '$timeout', 'preferenceService', 'requestToListener'];

    function preferenceController($location, $filter, $rootScope, $timeout, preferenceService, requestToListener) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Fetch broadcast event and change the field error message language.
        $rootScope.$on("changeErrorLanguage", function () {
            $timeout(function () {

                // Call functions to check the both field error values            
                vm.validateLanguage();
                vm.validateAccessLevel();
                vm.validateaccessLevelSign();
            });
        });

        // Call function on page load to fetch the data.
        vm.$onInit = activate;
        function activate() {
            // get data from the parent component
            vm.formData = vm.parent.getData();

            // Call function to set current form class as active.
            vm.setFormStatus();

            // Call function to get level of access
            vm.getAccessLevel();

            // Hide shared error message
            vm.sharedErrorMessage = true;
        }

        // Display alert on page refresh
        //window.onbeforeunload = function () {
        //    return "";
        //};

        // Level of Access ToolTip Message
        vm.accessLevelTooltip = {
            templateUrl: 'accessLevelTooltipTemplate.html',
            content: 'Your Opal access level has two options'
        };

        // Method to to set current form class as active.
        vm.setFormStatus = function () {
            vm.formData.searchForm = "";
            vm.formData.secureForm.status = "";
            vm.formData.secureForm.flag = 1;
            vm.formData.preferenceForm.status = "active";
            vm.formData.preferenceForm.flag = 1;
            vm.formData.agreementForm.status = "";
            vm.formData.agreementForm.flag = null;
            vm.formData.successForm.status = "";
            vm.formData.successForm.flag = null;
        }

        // Validate to language preference field.
        vm.validateLanguage = function () {
            if (vm.formData.formFieldsData.language == undefined || vm.formData.formFieldsData.language == null || vm.formData.formFieldsData.language == "") {
                vm.formData.languageFormat.status = 'invalid';
                vm.formData.languageFormat.message = $filter('translate')('PREFERENCE.FIELDERRORMESSAGES.LANGUAGEREQUIRED');
            }
            else {
                vm.formData.languageFormat.status = 'valid';
                vm.formData.languageFormat.message = null;

                if (vm.formData.languageFormat.status == 'valid' && vm.formData.accessLevelFormat.status == 'valid' && vm.formData.accessLevelSignFormat.status == 'valid') {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        };

        // Function to get level of access .
        vm.getAccessLevel = function () {
            preferenceService.allAccess().then(function (results) {
                // Get the value from result response and bind values into dropdown
                var allAccess = results.data.all;

                // Check length of the variable
                if (allAccess.length > 1) {

                    // Define loop for passing the value of language option.
                    for (var i = 0; i < allAccess.length; i++) {

                        // Assing in JSON format
                        vm.formData.allAccessLevelList_EN[i] = {
                            "ID": allAccess[i].Id,
                            "VALUE": allAccess[i].VALUE_EN
                        }

                        vm.formData.allAccessLevelList_FR[i] = {
                            "ID": allAccess[i].Id,
                            "VALUE": allAccess[i].VALUE_FR
                        }
                    }

                    // Check the default selected language.
                    if (vm.formData.selectedLanguage == 'en')
                        vm.formData.allAccessLevelList = vm.formData.allAccessLevelList_EN;
                    else
                        vm.formData.allAccessLevelList = vm.formData.allAccessLevelList_FR;


                }
                else {
                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage);
                }



            }).catch(function (error) {

                // Call function to display error modal box.
                var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                vm.parent.displayError(errorModalPage);
            });

            preferenceService.needToKnowAccess().then(function (results) {

                // Get the value from result response and bind values into dropdown
                var needToKnowAccess = results.data.needToKnow;

                // Check length of the variable
                if (needToKnowAccess.length > 1) {

                    // Define loop for passing the value of language option.
                    for (var i = 0; i < needToKnowAccess.length; i++) {

                        // Assing in JSON format
                        vm.formData.needToKnowAccessLevelList_EN[i] = {
                            "ID": needToKnowAccess[i].Id,
                            "VALUE": needToKnowAccess[i].VALUE_EN
                        }

                        vm.formData.needToKnowAccessLevelList_FR[i] = {
                            "ID": needToKnowAccess[i].Id,
                            "VALUE": needToKnowAccess[i].VALUE_FR
                        }
                    }

                    // Check the default selected language.
                    if (vm.formData.selectedLanguage == 'en')
                        vm.formData.needToKnowAccessLevelList = vm.formData.needToKnowAccessLevelList_EN;
                    else
                        vm.formData.needToKnowAccessLevelList = vm.formData.needToKnowAccessLevelList_FR;
                }
                else {
                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage);
                }

            }).catch(function (error) {
                // Call function to display error modal box.
                var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                vm.parent.displayError(errorModalPage);
            });
        }


        // Validate to level of access field.
        vm.validateAccessLevel = function () {
            if (vm.formData.formFieldsData.accessLevel == undefined || vm.formData.formFieldsData.accessLevel == null || vm.formData.formFieldsData.accessLevel == "") {
                vm.formData.accessLevelFormat.status = 'invalid';
                vm.formData.accessLevelFormat.message = $filter('translate')('PREFERENCE.FIELDERRORMESSAGES.ACCESSLEVELREQUIRED');
            }
            else {
                if (vm.formData.formFieldsData.accessLevel == "3") {
                    vm.formData.allAccessLevelFormat.status = 'valid';
                    vm.formData.allAccessLevelFormat.message = null;

                    vm.formData.needToKnowAccessLevelFormat.status = null;
                    vm.formData.needToKnowAccessLevelFormat.message = null;

                    vm.formData.accessLevelFormat.status = 'valid';
                    vm.formData.accessLevelFormat.message = null;
                }
                if (vm.formData.formFieldsData.accessLevel == "1") {
                    vm.formData.allAccessLevelFormat.status = null;
                    vm.formData.allAccessLevelFormat.message = null;

                    vm.formData.needToKnowAccessLevelFormat.status = 'valid';
                    vm.formData.needToKnowAccessLevelFormat.message = null;

                    vm.formData.accessLevelFormat.status = 'valid';
                    vm.formData.accessLevelFormat.message = null;
                }

                if (vm.formData.languageFormat.status == 'valid' && vm.formData.accessLevelFormat.status == 'valid' && vm.formData.accessLevelSignFormat.status == 'valid') {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        //Function to validate aggrementSign checkbox
        vm.validateaccessLevelSign = function () {
            if (vm.formData.formFieldsData.accessLevelSign == undefined || vm.formData.formFieldsData.accessLevelSign == null || vm.formData.formFieldsData.accessLevelSign == "" || vm.formData.formFieldsData.accessLevelSign == false) {
                vm.formData.accessLevelSignFormat.status = 'invalid';
                vm.formData.accessLevelSignFormat.message = $filter('translate')('PREFERENCE.FIELDERRORMESSAGES.AUTHORIZETRANSMISSIONREQUIRED');
            }
            else {
                vm.formData.accessLevelSignFormat.status = 'valid';
                vm.formData.accessLevelSignFormat.message = null;

                if (vm.formData.languageFormat.status == 'valid' && vm.formData.accessLevelFormat.status == 'valid' && vm.formData.accessLevelSignFormat.status == 'valid') {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Form onsubmit method
        vm.preferenceFormSubmit = function () {
            // Validate all fields as required fields
            if (vm.formData.formFieldsData.language == undefined || vm.formData.formFieldsData.language == null || vm.formData.formFieldsData.language == "") {
                vm.formData.languageFormat.status = 'invalid';
                vm.formData.languageFormat.message = $filter('translate')('PREFERENCE.FIELDERRORMESSAGES.LANGUAGEREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.accessLevel == undefined || vm.formData.formFieldsData.accessLevel == null || vm.formData.formFieldsData.accessLevel == "") {
                vm.formData.accessLevelFormat.status = 'invalid';
                vm.formData.accessLevelFormat.message = $filter('translate')('PREFERENCE.FIELDERRORMESSAGES.ACCESSLEVELREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.accessLevelSign == undefined || vm.formData.formFieldsData.accessLevelSign == null || vm.formData.formFieldsData.accessLevelSign == "" || vm.formData.formFieldsData.accessLevelSign == false) {
                vm.formData.accessLevelSignFormat.status = 'invalid';
                vm.formData.accessLevelSignFormat.message = $filter('translate')('PREFERENCE.FIELDERRORMESSAGES.AUTHORIZETRANSMISSIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.languageFormat.status == 'valid' && vm.formData.accessLevelFormat.status == 'valid' && vm.formData.accessLevelSignFormat.status == 'valid') {

                // Hide shared error message
                vm.sharedErrorMessage = true;

                // Redirect to last successful page
                $location.path('/form/termsofUsageAgreement');
            }
        }
    }
})();