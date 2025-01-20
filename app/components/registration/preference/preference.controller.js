// SPDX-FileCopyrightText: Copyright 2020 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   preference.controller.js
     Description  :   Controlle the preference.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   Opal Health Informatics Group
     Date         :   June 2019
 **/

(function () {
    'use strict';
    angular.module('myApp')
        .controller('preferenceController', preferenceController);

    preferenceController.$inject = ['$location', '$filter', '$rootScope', '$timeout'];

    function preferenceController($location, $filter, $rootScope, $timeout) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Fetch broadcast event and change the field error message language.
        $rootScope.$on("changeLanguage", function () {
            $timeout(function () {

                // Check the field error values
                vm.validateLanguage();
            });
        });

        vm.allAccess = [
            {
                "ID": 1,
                "VALUE_FR": "Notes cliniques",
                "VALUE_EN": "Clinical Notes"
            },
            {
                "ID": 2,
                "VALUE_FR": "Résultats d’examens de laboratoire",
                "VALUE_EN": "Lab test results"
            },
            {
                "ID": 3,
                "VALUE_FR": "Rendez-vous",
                "VALUE_EN": "Appointment schedule"
            },
            {
                "ID": 4,
                "VALUE_FR": "Matériel éducatif",
                "VALUE_EN": "Educational material"
            }
        ];

        // Call function on page load to fetch the data.
        vm.$onInit = function() {
            // get data from the parent component
            vm.formData = vm.parent.getData();
            vm.formData.formFieldsData.accessLevel = 3;
            vm.formData.accessLevelFormat.status = 'valid';

            if (vm.formData.formFieldsData.language === undefined || vm.formData.formFieldsData.language === null || vm.formData.formFieldsData.language === "") {
                vm.formData.formFieldsData.language = vm.formData.selectedLanguage;
            }
            vm.formData.languageFormat.status = 'valid';

            // Call function to set current form class as active.
            vm.setFormStatus();

            // Call function to get level of access
            vm.getAccessLevel();

            // Hide shared error message
            vm.sharedErrorMessage = true;
        }

        // Method to to set current form class as active.
        vm.setFormStatus = function () {
            vm.formData.searchForm = "";
            vm.formData.accountForm = '';
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
            if (vm.parent.isEmpty(vm.formData.formFieldsData.language)) {
                vm.formData.languageFormat.status = 'invalid';
                vm.formData.languageFormat.message = $filter('translate')('PREFERENCE.FIELDERRORMESSAGES.LANGUAGEREQUIRED');
            } else {
                vm.formData.languageFormat.status = 'valid';
                vm.formData.languageFormat.message = null;

                if (vm.formData.languageFormat.status === 'valid') {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        };

        // Function to get level of access .
        vm.getAccessLevel = function () {
            // Define loop for passing the value of language option.
            vm.formData.allAccessLevelList_EN = [];
            vm.formData.allAccessLevelList_FR = [];
            vm.allAccess.forEach(function(access) {
                // Assing in JSON format
                vm.formData.allAccessLevelList_EN.push({
                    "ID": access.Id,
                    "VALUE": access.VALUE_EN
                });

                vm.formData.allAccessLevelList_FR.push({
                    "ID": access.Id,
                    "VALUE": access.VALUE_FR
                });
            });
            // Check the default selected language.
            if (vm.formData.selectedLanguage === 'en')
                vm.formData.allAccessLevelList = vm.formData.allAccessLevelList_EN;
            else
                vm.formData.allAccessLevelList = vm.formData.allAccessLevelList_FR;
        }

        // Form onsubmit method
        vm.preferenceFormSubmit = function () {
            // Validate all fields as required fields
            if (vm.formData.formFieldsData.language === undefined || vm.formData.formFieldsData.language === null || vm.formData.formFieldsData.language === "") {
                vm.formData.languageFormat.status = 'invalid';
                vm.formData.languageFormat.message = $filter('translate')('PREFERENCE.FIELDERRORMESSAGES.LANGUAGEREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.languageFormat.status === 'valid') {

                // Hide shared error message
                vm.sharedErrorMessage = true;

                // Redirect to last successful page
                $location.path('/form/termsofUsageAgreement');
            }
        }
    }
})();
