
/**
     Filename     :   Header.controller.js
     Description  :   Change the dropdown fields language
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('headerController', headerController);

    headerController.$inject = ['$translate', '$sce', '$rootScope'];

    function headerController($translate, $sce, $rootScope) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Default opal logo in header.
        vm.opalLogo = 'images/logos/navbar-logo.png';

        // Call function on page load to fetch the data.
        vm.$onInit = activate;
        function activate() {
            
            // get data from the parent component
            vm.formData = vm.parent.getData();
        }

        // Change language function.
        vm.changeLanguage = function (language) {

            // Slice first two charcters and convert it into lowercase.
            vm.lan_key = (language.slice(0, 2)).toLowerCase();

            $translate.use(vm.lan_key)
                .then(function (languageId) {
                    vm.formData.selectedLanguage = languageId;

                    // Call function to change language of data in child forms
                    vm.changeDataLanguage();

                    $rootScope.$broadcast("changeErrorLanguage");
                });
        };

        // Common function to the change languages of data in child forms
        vm.changeDataLanguage = function () {
            
            // If global variable selectedlanguage is set to french
            if (vm.formData.selectedLanguage == 'fr') {
                
                // Check if secure form is loaded. If yes assign french questions to dropdown modal
                if (vm.formData.secureForm.flag == 1) {
                    vm.formData.securityQuestionList = vm.formData.securityQuestionList_FR;
                    for (var i = 0; i < vm.formData.securityQuestionList.length; i++) {
                        if (vm.formData.securityQuestionList[i].id == vm.formData.formFieldsData.securityQuestion1.id) {
                            vm.formData.formFieldsData.securityQuestion1 = vm.formData.securityQuestionList[i];
                        }
                        if (vm.formData.securityQuestionList[i].id == vm.formData.formFieldsData.securityQuestion2.id) {
                            vm.formData.formFieldsData.securityQuestion2 = vm.formData.securityQuestionList[i];
                        }
                        if (vm.formData.securityQuestionList[i].id == vm.formData.formFieldsData.securityQuestion3.id) {
                            vm.formData.formFieldsData.securityQuestion3 = vm.formData.securityQuestionList[i];
                        }
                    }
                }

                // Check if preference form is loaded. If yes assign french value to language and levelofaccess dropdown modal
                if (vm.formData.preferenceForm.flag == 1) {
                    vm.formData.allAccessLevelList = vm.formData.allAccessLevelList_FR;
                }

                // Check if aggreement form is loaded. If yes assign french document
                if (vm.formData.agreementForm.flag == 1) { 
                    vm.formData.termsOfUseDisplayed = vm.formData.termsOfUseBase64_FR;
                }
            }

            // If global variable selectedlanguage is set to english
            if (vm.formData.selectedLanguage === 'en') {
                
                // Check if secure form is loaded. If yes assign english questions to dropdown modal
                if (vm.formData.secureForm.flag === 1) {
                    vm.formData.securityQuestionList = vm.formData.securityQuestionList_EN;
                    for (var i = 0; i < vm.formData.securityQuestionList.length; i++) {
                        if (vm.formData.securityQuestionList[i].id === vm.formData.formFieldsData.securityQuestion1.id) {
                            vm.formData.formFieldsData.securityQuestion1 = vm.formData.securityQuestionList[i];
                        }
                        if (vm.formData.securityQuestionList[i].id === vm.formData.formFieldsData.securityQuestion2.id) {
                            vm.formData.formFieldsData.securityQuestion2 = vm.formData.securityQuestionList[i];
                        }
                        if (vm.formData.securityQuestionList[i].id === vm.formData.formFieldsData.securityQuestion3.id) {
                            vm.formData.formFieldsData.securityQuestion3 = vm.formData.securityQuestionList[i];
                        }
                    }
                }

                // Check if preference form is loaded. If yes assign english value to language and levelofaccess dropdown modal
                if (vm.formData.preferenceForm.flag === 1) {
                    vm.formData.allAccessLevelList = vm.formData.allAccessLevelList_EN;
                }

                // Check if aggreement form is loaded. If yes assign english document
                if (vm.formData.agreementForm.flag === 1) { 
                    vm.formData.termsOfUseDisplayed = vm.formData.termsOfUseBase64_EN;
                }
            }
        }
    }
})();


