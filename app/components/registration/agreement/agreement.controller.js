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

    agreementController.$inject = ['$location', '$filter', '$rootScope', '$timeout', 'requestToListener', 'firebaseFactory', 'userAuthorizationService', 'encryptionService', 'apiConstants'];

    function agreementController($location, $filter, $rootScope, $timeout, requestToListener, firebaseFactory, userAuthorizationService, encryptionService, apiConstants) {
        var vm = this;

        vm.isTermsLoaded = false;  // This is for showing the terms of use

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Base64 encoded PDF of terms of use
        vm.termsOfUsePDFData = undefined;

        vm.downloadTermsOfUse = downloadTermsOfUse;

        // Fetch broadcast event and change the field error message language.
        $rootScope.$on("changeErrorLanguage", function () {
            $timeout(function () {

                // Call functions to check the both field error values            
                vm.validateAgreementSign();
            });
        });

        // Call function on page load to fetch the data.
        vm.$onInit = activate;
        function activate() {
            // get data from the parent component
            vm.formData = vm.parent.getData();

            // Display display spinner before calling service
            vm.formData.displaySpinner = false;

            // Call function to set current form class as active.
            vm.setFormStatus();

            // Hide shared error message
            vm.sharedErrorMessage = true;

            retrieveTermsOfUsePDF();
        }

        // Display alert on page refresh
        //window.onbeforeunload = function () {
        //    return "";
        //};

        //Function to validate aggrementSign checkbox
        vm.validateAgreementSign = function () {
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
            if (vm.formData.formFieldsData.termsandAggreementSign == undefined || vm.formData.formFieldsData.termsandAggreementSign == null || vm.formData.formFieldsData.termsandAggreementSign == "" || vm.formData.formFieldsData.termsandAggreementSign == false) {
                vm.formData.termsandAggreementSignFormat.status = 'invalid';
                vm.formData.termsandAggreementSignFormat.message = $filter('translate')('AGREEMENT.FIELDERRORMESSAGES.ACCEPTCHECKBOXREQUIRED');

                vm.sharedErrorMessage = false;
            }
            if (vm.formData.termsandAggreementSignFormat.status == 'valid') {
                
                vm.sharedErrorMessage = true;

                // Display display spinner before calling service
                vm.formData.displaySpinner = false;

                // Encrypt important information before making service call.
                vm.formData.formFieldsData.answer1 = encryptionService.hash(vm.formData.formFieldsData.answer1);
                vm.formData.formFieldsData.answer2 = encryptionService.hash(vm.formData.formFieldsData.answer2);
                vm.formData.formFieldsData.answer3 = encryptionService.hash(vm.formData.formFieldsData.answer3);
                
                vm.formData.formFieldsData.termsandAggreementSign = 1;
                vm.formData.formFieldsData.accessLevelSign = 1;

                // Call function to register patient
                vm.registerPatient();
            }
        }

        // Function to call service for register patient
        vm.registerPatient = function () {
            
            var parameters = vm.formData.formFieldsData;
            var email = vm.formData.formFieldsData.email;
            var language = vm.formData.formFieldsData.language;

            // Call service to register user.
            requestToListener.sendRequestWithResponse('RegisterPatient', { Fields: parameters })
                .then(function (response) {
                    if (response == undefined || response == null || response == "") {

                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        vm.parent.displayError(errorModalPage, "unsuccessfulRegistration");
                    }
                    else {
                        if (response.Data[0].Result == "Successfully Update") {     
                            // Hide display spinner after all request get response.
                            vm.formData.displaySpinner = true;

                            // Call function to reset the fields value
                            vm.parent.resetFields();

                            // Call function to user authorized value
                            userAuthorizationService.clearuserAuthorizationInfomation();

                            // Redirect to last successful page
                            $rootScope.$apply(function () {
                                $location.path('/form/registrationSuccessful');
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
                   
                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage, "unsuccessfulRegistration");
                });
        }

        /**
         * @name retrieveTermsOfUsePDF
         * @desc This function loads base64 encoded terms of use that is set in the new backend
         */
        async function retrieveTermsOfUsePDF() {
            try {
                const terms_response = await requestToListener.apiRequest(
                    apiConstants.ROUTES.TERMS_OF_USE,
                    vm.formData.selectedLanguage
                );

                $timeout(() => {
                    const termsOfUsePDF = terms_response?.data?.terms_of_use;

                    if (termsOfUsePDF === undefined || termsOfUsePDF === "") {
                        console.error(
                            'Unable to retrieve the terms of use from the api-backend.'
                        );

                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        vm.parent.displayError(errorModalPage, "unsuccessfulRegistration");
                    }

                    vm.termsOfUsePDFData = "data:application/pdf;base64," + termsOfUsePDF;

                    vm.isTermsLoaded = true;

                    // Hide display spinner after all request get response.
                    vm.formData.displaySpinner = true;
                });
            } catch (error) {
                $timeout(() => {
                    console.error(
                        'Unable to retrieve the terms of use from the api-backend:',
                        error
                    );

                    // Hide display spinner after all request get response.
                    vm.formData.displaySpinner = true;

                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage, "unsuccessfulRegistration");
                });
            }
        }

        function downloadTermsOfUse(event) {
            event.preventDefault();

            const downloadLink = document.createElement('a');

            downloadLink.href = vm.termsOfUsePDFData;
            downloadLink.download = 'opal-agreement.pdf';
            downloadLink.target = '_blank';
            downloadLink.click();
        }
    }
})();