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

                // Encrypt important information before makeing service call.
                vm.formData.formFieldsData.password = encryptionService.hash(vm.formData.formFieldsData.password);
                vm.formData.formFieldsData.answer1 = encryptionService.hash(vm.formData.formFieldsData.answer1);
                vm.formData.formFieldsData.answer2 = encryptionService.hash(vm.formData.formFieldsData.answer2);
                vm.formData.formFieldsData.answer3 = encryptionService.hash(vm.formData.formFieldsData.answer3);

                debugger;

                vm.sharedErrorMessage = true;

                // Display display spinner before calling service
                vm.formData.displaySpinner = false;

                // Call function to delete temporary firebase account.
                vm.deleteFirebaseAccount();
            }
        }
        
        var deleteAccount = function () {
            firebase.auth().currentUser.delete().catch(function (error) {
                if (error.code == 'auth/requires-recent-login') {
                    // The user's credential is too old. She needs to sign in again.
                    firebase.auth().signOut().then(function () {
                        // The timeout allows the message to be displayed after the UI has
                        // changed to the signed out state.
                        setTimeout(function () {
                            alert('Please sign in again to delete your account.');
                        }, 1);
                    });
                }
            });
        };

        // Function to delete temporary user before creating account in firebase with correct details.
        // Did not use the parent delete firebase account funtion becuse after deleteting a temporary account below function create real firebase account.
        vm.deleteFirebaseAccount = function () {
            debugger;
            var user = firebase.auth().currentUser;

            user.delete().then(function () {
                debugger
                // Create firebase account.
                vm.createFirebaseAccount();

            }, function (error) {
                debugger;
                // An error happened.
                // Call shared function to check the error and display appropriate message.
                vm.parent.deleteFirebaseAccountError(error);
                console.log(error);
            });
            
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

                    debugger;
                    userAuthorizationService.setUserData(encryptionService.hash(vm.formData.formFieldsData.uniqueId), vm.formData.formFieldsData.password, vm.formData.formFieldsData.email);
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

                            // Call function to delete firebase branch
                            vm.deleteFirebaseBranch(vm.formData.branchName);

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