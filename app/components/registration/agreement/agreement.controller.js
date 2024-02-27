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

    agreementController.$inject = ['$location', '$filter', '$rootScope', '$timeout', 'requestToListener', 'firebaseFactory', 'userAuthorizationService', 'encryptionService'];

    function agreementController($location, $filter, $rootScope, $timeout, requestToListener, firebaseFactory, userAuthorizationService, encryptionService) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

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

            // Hide display spinner
            vm.formData.displaySpinner = false;

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
                vm.formData.displaySpinner = true;
                if (vm.formData.alreadyRegistered == false) {
                // Add question strings to the form, to be saved in the backend
                    for (let i = 1; i <= 3; i++) {
                        let questionId = vm.formData.formFieldsData[`securityQuestion${i}`];
                        vm.formData.formFieldsData[`securityQuestionText${i}`] = vm.formData.securityQuestionList.find(
                            question => question.id === questionId
                        ).value;
                    }

                    // Encrypt important information before making service call.
                    vm.formData.formFieldsData.answer1 = encryptionService.hash(vm.formData.formFieldsData.answer1);
                    vm.formData.formFieldsData.answer2 = encryptionService.hash(vm.formData.formFieldsData.answer2);
                    vm.formData.formFieldsData.answer3 = encryptionService.hash(vm.formData.formFieldsData.answer3);
                }

                vm.formData.formFieldsData.termsandAggreementSign = 1;
                vm.formData.formFieldsData.accessLevelSign = 1;

                // Call function to register patient
                vm.registerPatient();
            }
        }

        // Function to call service for register patient
        vm.registerPatient = function () {
            
            const parameters = vm.formData.formFieldsData;

            // Call service to register user.
            requestToListener.sendRequestWithResponse('RegisterPatient', { Fields: parameters })
                .then(function (response) {
                    if (response == undefined || response == null || response == "") {

                        // Call function to display error modal box.
                        vm.parent.errorPopup('contactUsError');
                    } else {
                        if (response.Data[0].Result == "Successfully Update") {
                            // Hide display spinner after all request get response.
                            vm.formData.displaySpinner = false;

                            // Call function to reset the fields value
                            vm.parent.resetFields();

                            // Call function to user authorized value
                            userAuthorizationService.clearUserAuthorizationInfomation();

                            // Redirect to last successful page
                            $rootScope.$apply(function () {
                                $location.path('/form/registrationSuccessful');
                            });
                        } else {
                            // Call function to display error modal box.
                            vm.parent.errorPopup('contactUsError');
                        }
                    }
                })
                .catch(function (error) {
                    // Call function to display error modal box.
                    vm.parent.errorPopup('contactUsError');
                });
        }

        vm.downloadTermsOfUse = function (event) {
            event.preventDefault();

            const downloadLink = document.createElement('a');

            downloadLink.href = vm.formData.termsOfUseDisplayed;
            downloadLink.download = 'opal-agreement.pdf';
            downloadLink.target = '_blank';
            downloadLink.click();
        }
    }
})();