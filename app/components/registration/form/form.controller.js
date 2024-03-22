/**
     Filename     :   form.controller.js
     Description  :   Controlle the form.html data(modal values, event, etc.).
     Created by   :   Jinal Vyas
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

    formController.$inject = ['$rootScope', '$location', '$uibModal', 'formDataModel', 'firebaseFactory', 'requestToListener', 'apiConstants'];

    function formController($rootScope, $location, $uibModal, formDataModel, firebaseFactory, requestToListener, apiConstants) {
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

        vm.STATUS_VALID = 'valid',
        vm.STATUS_INVALID = 'invalid',

        // Display alert on page refresh
        window.onbeforeunload = function (event) {
            if (vm.formData.successForm.flag == 1) {
                // Not display any alert message if user refresh the browser on success form page.
            }
            else {
                // Display alert message on page refrech except success page.
                return "";
            }
        };

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
            vm.formData.formFieldsData.securityQuestion1 = "";
            vm.formData.formFieldsData.answer1 = "";
            vm.formData.formFieldsData.securityQuestion2 = "";
            vm.formData.formFieldsData.answer2 = "";
            vm.formData.formFieldsData.securityQuestion3 = "";
            vm.formData.formFieldsData.answer3 = "";
            vm.formData.formFieldsData.language = "";
            vm.formData.formFieldsData.accessLevel = "";
            vm.formData.formFieldsData.termsandAggreementSign = 0;
            vm.formData.formFieldsData.accessLevelSign = 0;
            vm.formData.formFieldsData.token = "";
            vm.formData.formFieldsData.uniqueId = "";
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
                vm.formData.formFieldsData.ramq = "";
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


