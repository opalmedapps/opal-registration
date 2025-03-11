/**
     Filename     :   form.controller.js
     Description  :   Control the search.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';

    angular.module('myApp')
        .controller('searchController', searchController);

    searchController.$inject = ['$filter', '$location', '$rootScope', '$uibModal', '$timeout', '$sce', 'requestToListener', 'searchService', 'firebaseFactory', 'userAuthorizationService', 'encryptionService', 'apiConstants'];

    function searchController($filter, $location, $rootScope, $uibModal, $timeout, $sce, requestToListener, searchService, firebaseFactory, userAuthorizationService, encryptionService, apiConstants) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Fetch broadcast event and change the field error message language.
        $rootScope.$on("changeErrorLanguage", function () {
            $timeout(function () {

                // Call functions to check the both field error values            
                vm.validateRegistrationCode();
                vm.validatePatientId();
            });
        });


        // Call function on page load to fetch the data.
        vm.$onInit = activate;

        // Call function on page load to fetch the data.
        function activate() {
            // get data from the parent component
            vm.formData = vm.parent.getData();
            vm.patientId = undefined;
            vm.patientIdFormat = {};

            if (vm.formData.secureForm.flag != 1)
                vm.formData.selectedLanguage = ((window.navigator.language || window.navigator.userLanguage).slice(0, 2)).toLowerCase();

            // Call function to set current form class as active.
            vm.setFormStatus();
            
            // Hide display spinner on load
            vm.formData.displaySpinner = true;

            // Hide shared error message
            vm.sharedErrorMessage = true;
            
            // Call function to fetch URL query parameters.
            vm.fetchURL();
        }

        // Registration code tooltip image path
        vm.registrationcodeTooltip = {
            templateUrl: 'registrationcodeTooltipTemplate.html',
            content: $filter('translate')('TOOLTIP.REGISTRATIONCODE')
        };

        // Patient id tooltip html path
        vm.patientidTooltip = {
            templateUrl: 'patientidTooltipTemplate.html',
            content: $filter('translate')('TOOLTIP.PATIENTID_CONTENT')
        };

        // Method to fetch URL query parameter to autofill Registration code.
        vm.fetchURL = function () {
          if ($location.search().hasOwnProperty('code')) {
          
                vm.formData.formFieldsData.registrationCode = $location.search()['code'];
              
                vm.validateRegistrationCode();
            }
        }

        // Method to to set current form class as active and set flag for translation.
        vm.setFormStatus = function () {
            vm.formData.searchForm = "active";
            vm.formData.secureForm.status = "";
            vm.formData.secureForm.flag = null;
            vm.formData.preferenceForm.status = "";
            vm.formData.preferenceForm.flag = null;
            vm.formData.agreementForm.status = "";
            vm.formData.agreementForm.flag = null;
            vm.formData.successForm.status = "";
            vm.formData.successForm.flag = null;
        }

        // Validate to registration code format and length.
        vm.validateRegistrationCode = function () {

            if (vm.formData.formFieldsData.registrationCode == undefined || vm.formData.formFieldsData.registrationCode == null || vm.formData.formFieldsData.registrationCode == "") {
                vm.formData.codeFormat.status = 'invalid';
                vm.formData.codeFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.CODEREQUIRED');
            }
            else {
                if (vm.formData.formFieldsData.registrationCode.length < 12) {
                    vm.formData.codeFormat.status = 'invalid';
                    vm.formData.codeFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.SHORTCODELENGTH');
                }

                else if (vm.formData.formFieldsData.registrationCode.length > 12) {
                    vm.formData.codeFormat.status = 'invalid';
                    vm.formData.codeFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.LONGCODELENGTH');
                }
                else {
                    vm.formData.codeFormat.status = 'valid';
                    vm.formData.codeFormat.message = null;

                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        };

        // Validate to patient id format and length.
        vm.validatePatientId = function () {
            if (vm.patientId == undefined || vm.patientId == null || vm.patientId == "") {
                vm.patientIdFormat.status = 'invalid';
                vm.patientIdFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.RAMQREQUIRED');
            } else {
                if (vm.patientId.length != 7 && vm.patientId.length != 12) {
                    vm.patientIdFormat.status = 'invalid';
                    vm.patientIdFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.INVALIDPATIENTID');
                } else {
                    vm.patientIdFormat.status = 'valid';
                    vm.patientIdFormat.message = null;

                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        };

        // Function to display shared error message and enable next button on all fields valid status.
        vm.checkAllFieldsValidStatus = function () {
            if (vm.formData.codeFormat.status == 'valid' && vm.formData.ramqFormat.status == 'valid') {
                // Display shared error message
                vm.sharedErrorMessage = true;
            }
            else {
                // Display shared error message
                vm.sharedErrorMessage = false;
            }
        }

        // Form onsubmit method
        vm.searchFormSubmit = function () {
            
            //Validate all fields as required fields on form submit
            if (vm.formData.formFieldsData.registrationCode == undefined || vm.formData.formFieldsData.registrationCode == null || vm.formData.formFieldsData.registrationCode == "") {
                vm.formData.codeFormat.status = 'invalid';
                vm.formData.codeFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.CODEREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.patientId == undefined || vm.patientId == null || vm.patientId == "") {
                vm.patientIdFormat.status = 'invalid';
                vm.patientIdFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.RAMQREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.codeFormat.status == 'valid' && vm.patientIdFormat.status == 'valid') {
                // Display shared error message
                vm.sharedErrorMessage = true;

                vm.formData.hospitalCode = vm.formData.formFieldsData.registrationCode.substring(0,2);
                vm.patientId = vm.patientId.toUpperCase();

                //Set registration code info
                userAuthorizationService.setUserData(vm.formData.formFieldsData.registrationCode, vm.patientId, vm.formData.hospitalCode);
                //Set the firebase branch name
                userAuthorizationService.setUserBranchName(encryptionService.hash(vm.formData.formFieldsData.registrationCode));

                if (vm.patientId.length == 12) {
                    vm.formData.formFieldsData.ramq = vm.patientId;

                } else if (vm.patientId.length == 7) {
                    vm.formData.formFieldsData.mrn = vm.patientId;
                }
                vm.createBranchName();
            }

        };

        // Call service to check valid branch.
        vm.createBranchName = function () {

            // Call function to get an IP address of user.
            vm.getIP();
        }


        // Call service to get IP address of user.
        vm.getIP = function () {

            // Display display spinner before calling service
            vm.formData.displaySpinner = false;

            // Service call
            searchService.getIP().then(function (response) {
                
                // Check the response status and perform action accordingly
                if (response.status == 200) {
                    var IPAddress = response.data.result;
                    vm.insertIPLog(IPAddress);
                }
                else {

                    // Call function to display error modal box.
                    vm.errorPopup();
                }
            }).catch(function (error) {

                // Call function to display error modal box.
                vm.errorPopup();
            });

        }

        // Method to call service to insert Ip address.
        vm.insertIPLog = function (IPAddress) {
            var parameters = {
                'IPAddress': IPAddress
            };

            // Listener service call.
            requestToListener.sendRequestWithResponse('InsertIPLog', { Fields: parameters })
                .then(function (response) {

                    if (response.Data[0].Result == 'SUCCESS') {
                        // Call function to validate IPAddress.
                        vm.validateIP(IPAddress);
                    }
                    else {

                        // Call function to display error modal box.
                        vm.errorPopup();
                    }

                })
                .catch(function (error) {
                    
                    // Call function to display error modal box.
                    vm.errorPopup();
                });

        }

        // Method to check IP.
        vm.validateIP = function (IPAddress) {

            var parameters = IPAddress;
            
            // Listener service call.
            requestToListener.sendRequestWithResponse('ValidateIP', { Fields: parameters })
                .then(function (response) {

                    // Check length of the variable
                    if (response.Data[0].Result == 'SUCCESS') {
                     
                        // Call function to get user name.
                        vm.validInputs(userAuthorizationService.getUserBranchName());
                    }
                    else {
                     
                        // Call function to display error modal box.
                        vm.errorPopup();
                    }
                })
                .catch(function (error) {

                    // Call function to display error modal box.
                    vm.errorPopup();
                });
        }

        // Method to call service to check valid input.
        vm.validInputs = function (requestObject) {

            // Listener service call.
            const request = {
                method: 'get',
                url: `/api/registration/${vm.formData.formFieldsData.registrationCode}/`,
            };

            requestToListener.apiRequest(request, vm.formData.selectedLanguage)
                .then(function (response) {

                    if (response?.status_code == 200) {
                        // Call function to get user name.
                        const patient = response.data?.patient;
                        const institution = response.data?.institution;

                        if (patient &&  institution) {
                            vm.formData.userName = `${patient?.first_name} ${patient?.last_name}`;
                        } else {
                            vm.formData.userName = `Not found`;
                            var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                            vm.parent.displayError(errorModalPage);
                        }

                        vm.retrieveTermsOfUsePDF()
                            .then(function () {
                                vm.getSecurityQuestionList();
                        })
                        .catch(function (error) {

                            // Hide display spinner if service get error.
                            vm.formData.displaySpinner = true;
        
                            // Call function to display error modal box.
                            var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                            vm.parent.displayError(errorModalPage);
        
                            // Call function to reset value of every text fields.
                            vm.resetFields();
                        });
                    } else {
                        // Call function to display error modal box.
                        vm.errorPopup();
                    }

                })
                .catch(function (error) {

                    // Hide display spinner if service get error.
                    vm.formData.displaySpinner = true;

                    // Call function to display error modal box.
                    vm.errorPopup();

                    // Call function to reset value of every text fields.
                    vm.resetFields();
                });
        }
    
        // Function to load security questions list on service call.
        vm.getSecurityQuestionList = function () {
            
            // Listener service call.
            requestToListener.apiRequest(apiConstants.ROUTES.QUESTIONS, vm.formData.selectedLanguage)
                .then(function (response) {

                    // assing response to temporary variable.
                    let securityQuestions = response?.data?.results;

                    vm.formData.securityQuestionList_EN = [];
                    vm.formData.securityQuestionList_FR = [];

                    // Check length of the variable
                    if (securityQuestions?.length > 1) {
                        // Define loop for passing the value of securityquestions.
                        securityQuestions.forEach((question) => {
                            // Assing in JSON format
                            vm.formData.securityQuestionList_EN.push({
                                "id": question.id,
                                "value": question.title_en,
                            })

                            vm.formData.securityQuestionList_FR.push({
                                "id": question.id,
                                "value": question.title_fr,
                            })
                        })

                        // Check the default selected language.
                        if (vm.formData.selectedLanguage == 'en')
                            vm.formData.securityQuestionList = vm.formData.securityQuestionList_EN;
                        else
                            vm.formData.securityQuestionList = vm.formData.securityQuestionList_FR;
                        
                        // Hide display spinner after all request get response.
                        vm.formData.displaySpinner = true;

                        $rootScope.$apply(function () {
                            $location.path('/form/secureInformation');
                        });

                    } else {
                        // Call function to display error modal box.
                        vm.errorPopup();
                    }
                })
                .catch(function (error) {
                    
                    // Call function to display error modal box.
                    vm.errorPopup();

                });
        }

        vm.retrieveTermsOfUsePDF = async function () {
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

                    vm.formData.termsOfUseBase64 = $sce.trustAsResourceUrl(
                        `data:application/pdf;base64,${termsOfUsePDF}`
                    );

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

                    vm.errorPopup();
                });
            }
        }

        vm.errorPopup = function() {
            const errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
            vm.parent.displayError(errorModalPage, "unsuccessfulRegistration");
        }
    };
})();
