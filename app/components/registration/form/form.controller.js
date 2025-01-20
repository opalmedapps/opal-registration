// SPDX-FileCopyrightText: Copyright 2019 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   form.controller.js
     Description  :   Controlle the form.html data(modal values, event, etc.).
     Date         :   June 2019
 **/
import contactUsErrorTemplate from '../shared/modalBox/contactUsError.html';
import emailExistingErrorTemplate from '../shared/modalBox/emailExistingError.html';
import notFoundErrorTemplate from '../shared/modalBox/notFoundError.html';

(function () {
    'use strict';

    angular
        .module('myApp')

        .controller('formController', formController);

    formController.$inject = ['$location', '$rootScope', '$uibModal', 'apiConstants', 'formDataModel', 'requestToListener', 'siteState'];

    function formController($location, $rootScope, $uibModal, apiConstants, formDataModel, requestToListener, siteState) {
        var vm = this;
        vm.token = null;

        // Store all of our form data in this object
        vm.formData = new formDataModel();

        // Shared function for all the child controllers
        vm.getData = getData;
        vm.displayError = displayError;
        vm.resetFields = resetFields;
        vm.errorPopup = errorPopup;
        vm.isEmpty = isEmpty;
        vm.languageListForPreference = languageListForPreference;

        vm.STATUS_VALID = 'valid';
        vm.STATUS_INVALID = 'invalid';

        // Set the site state to initialized to later detect page reloads (see app.js for details)
        siteState.setInitialized(true);

        // Display an alert to warn users that reloading/refreshing the page might cause a loss of data
        // See: https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
        window.onbeforeunload = function () {
            // Display the alert on all pages except the success page (at that point, it's safe to refresh)
            if (vm.formData.successForm.flag !== 1) {
                return true;
            }
        };

        // Prevent users from pressing the back button during the registration process
        window.onpopstate = function (event) {
            window.history.forward(1);
        }

        // Shared function to return form data from every pages
        function getData() {
            return vm.formData;
        }

        // Shared function to display error
        function displayError(errorModalTemplate, error) {
            // Hide display spinner if service get error.
            vm.formData.displaySpinner = false;

            $uibModal.open({
                animation: true,
                template: errorModalTemplate,
                windowClass: 'show',
                backdropClass: 'show',
                controller: function ($scope, $uibModalInstance) {
                    $scope.close = function () {
                        $uibModalInstance.close(false);

                        if (vm.formData.secureForm.flag == 1 || vm.formData.agreementForm.flag == 1) {

                            // Call function to reset the fields value.
                            resetFields(error);
                            $location.path('/form/search');
                        }
                    };
                }
            });
        }

        // Shared function to reset the form fields value
        function resetFields(error) {
            // Delete value of text box.

            vm.formData.formFieldsData.email = "";
            vm.formData.confirmEmail = "";
            vm.formData.formFieldsData.password = "";
            vm.formData.confirmPassword = "";
            vm.formData.passwordMeter = "";
            vm.formData.formFieldsData.securityQuestion1 = "";
            vm.formData.formFieldsData.answer1 = "";
            vm.formData.formFieldsData.securityQuestion2 = "";
            vm.formData.formFieldsData.answer2 = "";
            vm.formData.formFieldsData.securityQuestion3 = "";
            vm.formData.formFieldsData.answer3 = "";
            vm.formData.formFieldsData.language = "";
            vm.formData.formFieldsData.accessLevel = "";
            vm.formData.formFieldsData.phone = "";

            // Reset status and message of all fields.
            vm.formData.emailFormat = { status: null, message: null };
            vm.formData.phoneFormat = { status: null, message: null };
            vm.formData.passwordFormat = { status: null, message: null };
            vm.formData.confirmPasswordFormat = { status: null, message: null };
            vm.formData.securityQuestion1Format = { status: null, message: null };
            vm.formData.answer1Format = { status: null, message: null };
            vm.formData.securityQuestion2Format = { status: null, message: null };
            vm.formData.answer2Format = { status: null, message: null };
            vm.formData.securityQuestion3Format = { status: null, message: null };
            vm.formData.answer3Format = { status: null, message: null };
            vm.formData.languageFormat = { status: null, message: null };
            vm.formData.termsandAggreementSignFormat = { status: null, message: null };

            // If success form is loaded or error while registering the patient than delete all the field values
            if (vm.formData.successForm.flag == 1 || error == "unsuccessfulRegistration") {
                vm.formData.formFieldsData.registrationCode = "";
                vm.formData.ramq = "";
                vm.formData.mrn = "";
                vm.formData.codeFormat = { status: null, message: null };
                vm.formData.ramqFormat = { status: null, message: null };
            }

        }

        // Error dialog popup
        function errorPopup(error) {
            switch (error) {
                case 'contactUsError':
                    vm.displayError(contactUsErrorTemplate, "unsuccessfulRegistration");
                    break;
                case 'notFoundError':
                    vm.displayError(notFoundErrorTemplate);
                    break;
                case 'emailExistingError':
                    vm.displayError(emailExistingErrorTemplate);
                    break;
            }
        }

        // Check empty string, null, undefined
        function isEmpty(value) {
            return value == undefined || value == null || value == "";
        }

        // Function to call service to get language list.
        function languageListForPreference() {
            requestToListener.apiRequest(apiConstants.ROUTES.LANGUAGES, 'en')
                .then(function (response) {
                    if (response?.data) {
                        vm.formData.languageList['en'] = response.data;
                        requestToListener.apiRequest(apiConstants.ROUTES.LANGUAGES, 'fr')
                            .then(function (response) {
                                if (response?.data) {
                                    vm.formData.languageList['fr'] = response.data;
                                    vm.formData.displaySpinner = false;

                                    $rootScope.$apply(function () {
                                        $location.path('/form/opalPreference');
                                    });
                                } else {
                                    vm.errorPopup('contactUsError');
                                }
                            })
                            .catch(function (error) {
                                // Call function to display error modal box.
                                vm.errorPopup('contactUsError');
                            });
                    } else {
                        vm.errorPopup('contactUsError');
                    }
                })
                .catch(function (error) {
                    // Call function to display error modal box.
                    vm.errorPopup('contactUsError');
                });
        }
    }

})();


