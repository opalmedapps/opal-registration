/**
     Filename     :   form.controller.js
     Description  :   Controlle the form.html data(modal values, event, etc.).
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';

    angular
        .module('myApp')

        .controller('formController', formController);

    formController.$inject = ['$location', '$uibModal', 'formDataModel', 'firebaseFactory'];

    function formController($location, $uibModal, formDataModel, firebaseFactory) {
        var vm = this;
        vm.token = null;
        
        // Store all of our form data in this object
        vm.formData = new formDataModel();

        // Shared function for all the child controllers
        vm.getData = getData;
        vm.displayError = displayError;
        vm.resetFields = resetFields;
        vm.deleteFirebaseAccount = deleteFirebaseAccount;
        vm.deleteFirebaseAccountError = deleteFirebaseAccountError;

        // Display alert on page refresh
        window.onbeforeunload = function (event) {
            debugger;
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

        // Call function on page load to fetch the data.
        vm.$onInit = activate;
        function activate() {
         //   vm.formData.displaySpinner = true;    
        }

        // Shared function to return form data from every pages
        function getData() {
            return vm.formData;
        }

        // Shared function to display error
        function displayError(errorModalPage, error) {
            debugger;
            // Hide display spinner if service get error.
            vm.formData.displaySpinner = true;

            $uibModal.open({
                animation: true,
                templateUrl: errorModalPage,
                windowClass: 'show',
                backdropClass: 'show',
                controller: function ($scope, $uibModalInstance) {
                    $scope.close = function () {
                        debugger;
                        $uibModalInstance.close(false);

                        if (vm.formData.secureForm.flag == 1 || vm.formData.agreementForm.flag == 1) {

                            // Call function to reset the fields value.
                            resetFields(error);

                            // Redirect to first page 
                            //$rootScope.$apply(function () {
                            //    debugger;
                            //    $location.path('/form/search');
                            //});
                            $location.path('/form/search');
                        }

                        else {
                            // Check the flag value if it's 1 no need to delete firebase account because it's not created yet but if it's not 1 it means need to delete firebase account
                            if (flag != 1) {

                                // Call function to delete firebase account
                                deleteFirebaseAccount();
                            }
                        }
                    };
                }
            });
        }

        // Shared function to reset the form fields value
        function resetFields(error) {
            // Delete value of text box.

            vm.formData.formFieldsData.dateofBirth = "";
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
            //vm.formData.formFieldsData.termsandAggreement = "";
            //vm.formData.formFieldsData.termsandAggreementPDF = "";
            vm.formData.formFieldsData.termsandAggreementSign = 0;
            vm.formData.formFieldsData.accessLevelSign = 0;
            vm.formData.formFieldsData.token = "";
            vm.formData.formFieldsData.uniqueId = "";

            // Reset status and message of all fields.
            vm.formData.dateofBirthFormat = { status: null, message: null };
            vm.formData.emailFormat = { status: null, message: null };
            vm.formData.confirmEmailFormat = { status: null, message: null };
            vm.formData.passwordFormat = { status: null, message: null };
            vm.formData.confirmPasswordFormat = { status: null, message: null };
            vm.formData.securityQuestion1Format = { status: null, message: null };
            vm.formData.answer1Format = { status: null, message: null };
            vm.formData.securityQuestion2Format = { status: null, message: null };
            vm.formData.answer2Format = { status: null, message: null };
            vm.formData.securityQuestion3Format = { status: null, message: null };
            vm.formData.answer3Format = { status: null, message: null };
            vm.formData.languageFormat = { status: null, message: null };
            vm.formData.accessLevelFormat = { status: null, message: null };
            vm.formData.allAccessLevelFormat = { status: null, message: null };
            vm.formData.needToKnowAccessLevelFormat = { status: null, message: null };
            vm.formData.accessLevelSignFormat = { status: null, message: null };
            vm.formData.termsandAggreementSignFormat = { status: null, message: null };

            // If success form is loaded or error while registering the patient than delete all the field values
            if (vm.formData.successForm.flag == 1 || error == "unsuccessfulRegistration") {
                vm.formData.formFieldsData.registrationCode = "";
                vm.formData.formFieldsData.ramq = "";
                vm.formData.codeFormat = { status: null, message: null };
                vm.formData.ramqFormat = { status: null, message: null };
            }

        }

        // Shared function to delete temporary user before creating account in firebase with correct details.
        function deleteFirebaseAccount() {
            debugger;
            firebase.auth().currentUser.delete().catch(function (error) {

                debugger;

                // Assign token value to local variable
                var token = vm.formData.formFieldsData.token;

                // Call function to reset fields value
                resetFields();

                // Call function to check the error while deleting fire base account and display the error.
                deleteFirebaseAccountError(error, token);
            });

        }

        // Shared function to check the error while deleting firebase account.
        function deleteFirebaseAccountError(error, token) {
            debugger;
            if (token == undefined || token == "" || token == null) {
                // Call function to display error modal box.
                var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                displayError(errorModalPage);
            }
            else {
                if (error.code == 'auth/requires-recent-login') {
                    debugger;
                    firebaseFactory.signInWithToken(token).then(function (userData) {
                        debugger;

                        if (userData == 'auth/invalid-custom-token') {
                            // Call function to display error modal box.
                            var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                            displayError(errorModalPage);
                        }

                        // check if service is getting right response.
                        else {
                            deleteFirebaseAccount();
                        }

                    }).catch(function (error) {
                        debugger;
                        console.log('error' + error);
                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        displayError(errorModalPage);
                    });
                }
                else if (error.code == 'auth/user-token-expired') {
                    debugger;
                    firebaseFactory.signInWithToken(token).then(function (userData) {
                        debugger;

                        if (userData == 'auth/invalid-custom-token') {
                            // Call function to display error modal box.
                            var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                            displayError(errorModalPage);
                        }

                        // check if service is getting right response.
                        else {
                            deleteFirebaseAccount();
                        }

                    }).catch(function (error) {
                        debugger;
                        console.log('error' + error);
                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        displayError(errorModalPage);
                    });
                }
                else if (error.code == 'auth/argument-error') {
                    debugger;
                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    displayError(errorModalPage);
                }
                else {
                    debugger;
                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    displayError(errorModalPage);
                }
            }
        }
    }

})();


