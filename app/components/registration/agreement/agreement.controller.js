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

    agreementController.$inject = ['$location', '$filter', '$rootScope', '$timeout', 'agreementService', 'requestToListener', 'firebaseFactory', 'userAuthorizationService', 'encryptionService'];

    function agreementController($location, $filter, $rootScope, $timeout, agreementService, requestToListener, firebaseFactory, userAuthorizationService, encryptionService) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Fetch broadcast event and change the field error message language.
        $rootScope.$on("changeErrorLanguage", function () {
            debugger;
            $timeout(function () {

                // Call functions to check the both field error values            
                vm.validateAgreementSign();
            });
        });

        // Call function on page load to fetch the data.
        vm.$onInit = activate;
        function activate() {
            // get data from the parent component
            debugger;
            vm.formData = vm.parent.getData();
            
            // Call function to set current form class as active.
            vm.setFormStatus();

            // Hide shared error message
            vm.sharedErrorMessage = true;
        }

        // Display alert on page refresh
        //window.onbeforeunload = function () {
        //    return "";
        //};
        
        //Function to validate aggrementSign checkbox
        vm.validateAgreementSign = function () {
            debugger;
            if (vm.formData.formFieldsData.termsandAggreementSign == undefined || vm.formData.formFieldsData.termsandAggreementSign == null || vm.formData.formFieldsData.termsandAggreementSign == "" || vm.formData.formFieldsData.termsandAggreementSign == false) {
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
            debugger;

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
            debugger;
            if (vm.formData.formFieldsData.termsandAggreementSign == undefined || vm.formData.formFieldsData.termsandAggreementSign == null || vm.formData.formFieldsData.termsandAggreementSign == "" || vm.formData.formFieldsData.termsandAggreementSign == false) {
                vm.formData.termsandAggreementSignFormat.status = 'invalid';
                vm.formData.termsandAggreementSignFormat.message = $filter('translate')('AGREEMENT.FIELDERRORMESSAGES.ACCEPTCHECKBOXREQUIRED');

                vm.sharedErrorMessage = false;
            }
            if (vm.formData.termsandAggreementSignFormat.status == 'valid') {
                
                debugger;
                vm.sharedErrorMessage = true;

                // Display display spinner before calling service
                vm.formData.displaySpinner = false;

                // Encrypt important information before makeing service call.
                vm.formData.formFieldsData.password = encryptionService.hash(vm.formData.formFieldsData.password);
                vm.formData.formFieldsData.answer1 = encryptionService.hash(vm.formData.formFieldsData.answer1);
                vm.formData.formFieldsData.answer2 = encryptionService.hash(vm.formData.formFieldsData.answer2);
                vm.formData.formFieldsData.answer3 = encryptionService.hash(vm.formData.formFieldsData.answer3);

                debugger;
                vm.formData.formFieldsData.termsandAggreementSign = 1;
                vm.formData.formFieldsData.accessLevelSign = 1;

                // Call function to register patient
                vm.registerPatient();
            }
        }
        
        // Function to create firebase account
        vm.createFirebaseAccount = function () {
            debugger;

            // Before registering user create account in firebase to get unique ID. Call firebase method
            firebaseFactory.createFirebaseAccount(vm.formData.formFieldsData.email, vm.formData.formFieldsData.password).then(function (data) {
                debugger;

                // check if service is getting right response.
                if (data.code == "auth/email-already-in-use") {

                    // Hide display spinner if service get error.
                    vm.formData.displaySpinner = true;

                    console.log('The email address is already in use by another account.');

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage);

                }
                else if (data.code == "auth/invalid-email") {
                    // Hide display spinner if service get error.
                    vm.formData.displaySpinner = true;

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage);
                }
                // Store uniqueId and allow to register patient.
                else {
                    debugger;
                    vm.formData.formFieldsData.uniqueId = data.uid;

                    // Encrypt important information before makeing service call.
                    vm.formData.formFieldsData.password = encryptionService.hash(vm.formData.formFieldsData.password);
                    vm.formData.formFieldsData.answer1 = encryptionService.hash(vm.formData.formFieldsData.answer1);
                    vm.formData.formFieldsData.answer2 = encryptionService.hash(vm.formData.formFieldsData.answer2);
                    vm.formData.formFieldsData.answer3 = encryptionService.hash(vm.formData.formFieldsData.answer3);

                    debugger;
                    vm.formData.formFieldsData.termsandAggreementSign = 1;
                    vm.formData.formFieldsData.accessLevelSign = 1;

                    // Call function to register patient
                    vm.registerPatient();
                }
            }).catch(function (error) {
                debugger;
                console.log('error' + error);

                // Call function to display error modal box.
                var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                vm.parent.displayError(errorModalPage);
            });
        }

        // Function to call service for register patient
        vm.registerPatient = function () {

            debugger;
            var parameters = vm.formData.formFieldsData;
            var email = vm.formData.formFieldsData.email;
            var language = vm.formData.formFieldsData.language;
           
            // Call service to register user.
            requestToListener.sendRequestWithResponse('RegisterPatient', { Fields: parameters })
                .then(function (response) {
                    debugger;

                    if (response == undefined || response == null || response == "") {

                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        vm.parent.displayError(errorModalPage, "unsuccessfulRegistration");
                    }
                    else {
                        if (response.Data[0].Result == "Successfully Update") {
                            console.log('response: ' + response.Data);

                            debugger;
                            // Hide display spinner after all request get response.
                            vm.formData.displaySpinner = true;

                            // Call function to send email.
                            vm.sendEmail(email, language);

                            // Call function to reset the fields value
                            vm.parent.resetFields();

                            // Call function to user authorized value
                            userAuthorizationService.clearuserAuthorizationInfomation();

                            // Redirect to last successful page
                            $rootScope.$apply(function () {
                                debugger;
                                $location.path('/form/registrationSuccessful');
                                console.log($location.path());
                            });
                        }
                        else {

                            // Call function to display error modal box.
                            var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                            vm.parent.displayError(errorModalPage, "unsuccessfulRegistration");
                        }
                    }
                })
                .catch(function (error) {
                    debugger;
                    console.log(error);

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage, "unsuccessfulRegistration");
                });
        }

        // Function to delete firebase branch refrence
        vm.deleteFirebaseBranch = function () {
            debugger;
            // Call firebase factory function
            firebaseFactory.deleteFirebaseBranch(vm.formData.branchName).then(function (response) {
                debugger;
                console.log('Delete branch');
                console.log(response);
            }).catch(function (error) {
                debugger;
                console.log('Error while deleting firebase branch: ' + error);
            });
        }

        // Function to send email
        vm.sendEmail = function (email, language) {
            agreementService.sendEmail(vm.formData.firstName, vm.formData.lastName, email, language).then(function (response) {
                debugger;
                if (response.status == 200) {
                    console.log('Email sent');

                    // Call function to reset value of every text fields.
                    vm.parent.resetFields();

                }
            })
                .catch(function (error) {
                    debugger;
                });
        }
    }
})();