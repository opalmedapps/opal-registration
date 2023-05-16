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
            vm.formData.patientId = undefined;
            vm.formData.patientIdFormat = {};

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

        // Registration code tooltip template path
        vm.registrationcodeTooltip = {
            templateUrl: 'registrationcodeTooltipTemplate.html',
        };

        // Patient id tooltip template path
        vm.patientidTooltip = {
            templateUrl: 'patientidTooltipTemplate.html',
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
            if (vm.formData.patientId == undefined || vm.formData.patientId == null || vm.formData.patientId == "") {
                vm.formData.patientIdFormat.status = 'invalid';
                vm.formData.patientIdFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.PATIENTIDREQUIRED');
            } else {
                if (vm.formData.patientId.length != 7 && vm.formData.patientId.length != 12) {
                    vm.formData.patientIdFormat.status = 'invalid';
                    vm.formData.patientIdFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.INVALIDPATIENTID');
                } else {
                    vm.formData.patientIdFormat.status = 'valid';
                    vm.formData.patientIdFormat.message = null;

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
            if (vm.formData.patientId == undefined || vm.formData.patientId == null || vm.formData.patientId == "") {
                vm.formData.patientIdFormat.status = 'invalid';
                vm.formData.patientIdFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.PATIENTIDREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.codeFormat.status == 'valid' && vm.formData.patientIdFormat.status == 'valid') {
                // Display shared error message
                vm.sharedErrorMessage = true;

                vm.formData.hospitalCode = vm.formData.formFieldsData.registrationCode.substring(0,2);
                vm.formData.patientId = vm.formData.patientId.toUpperCase();

                //Set registration code info
                userAuthorizationService.setUserData(vm.formData.formFieldsData.registrationCode, vm.formData.patientId, vm.formData.hospitalCode);
                if (vm.formData.patientId.length == 12) {
                    vm.formData.formFieldsData.ramq = vm.formData.patientId;

                } else if (vm.formData.patientId.length == 7) {
                    vm.formData.formFieldsData.mrn = vm.formData.patientId;
                }
                vm.createBranchName();
            }
        };

        // Call service to check valid branch.
        vm.createBranchName = function () {
            //Set the firebase branch name
            userAuthorizationService.setUserBranchName(encryptionService.hash(vm.formData.formFieldsData.registrationCode));

            // Display display spinner before calling service
            vm.formData.displaySpinner = false;

            // Call function to get an IP address of user.
            vm.validInputs(userAuthorizationService.getUserBranchName());
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
                            vm.formData.hospitalName = institution.name;
                            vm.formData.institutionId = institution.id;
                            vm.formData.firstName = patient.first_name;
                            vm.formData.lastName = patient.last_name;
                            vm.formData.userName = `${patient?.first_name} ${patient?.last_name}`;
                        } else if (response?.status_code == 403) {
                            vm.formData.userName = `Forbidden`;
                            vm.parent.errorPopup('forbiddenError');
                        } else {
                            vm.formData.userName = `Not found`;
                            vm.parent.errorPopup('notFoundError');
                        }

                        vm.retrieveTermsOfUsePDF()
                            .then(function () {
                                vm.getSecurityQuestionList();
                        })
                        .catch(function (error) {

                            // Hide display spinner if service get error.
                            vm.formData.displaySpinner = true;
        
                            // Call function to display error modal box.
                            vm.parent.errorPopup('notFoundError');
        
                            // Call function to reset value of every text fields.
                            vm.parent.resetFields();
                        });
                    } else {
                        // Call function to display error modal box.
                        vm.parent.errorPopup('contactUsError');
                    }

                })
                .catch(function (error) {

                    // Hide display spinner if service get error.
                    vm.formData.displaySpinner = true;

                    // Call function to display error modal box.
                    vm.parent.errorPopup('contactUsError');

                    // Call function to reset value of every text fields.
                    vm.parent.resetFields();
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
                            $location.path('/form/account');
                        });

                    } else {
                        // Call function to display error modal box.
                        vm.parent.errorPopup('contactUsError');
                    }
                })
                .catch(function (error) {
                    
                    // Call function to display error modal box.
                    vm.parent.errorPopup('contactUsError');

                });
        }

        vm.retrieveTermsOfUsePDF = async function () {
            try {
                const request = {
                    method: 'get',
                    url: `/api/institutions/${vm.formData.institutionId}/terms-of-use/`,
                };
                const terms_response = await requestToListener.apiRequest(
                    request,
                    vm.formData.selectedLanguage
                );
                
                $timeout(() => {
                    const termsOfUsePDF = terms_response?.data?.terms_of_use;

                    if (termsOfUsePDF === undefined || termsOfUsePDF === "") {
                        console.error(
                            'Unable to retrieve the terms of use from the api-backend.'
                        );

                        // Call function to display error modal box.
                        vm.parent.errorPopup('contactUsError');
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

                    vm.parent.errorPopup('contactUsError');
                });
            }
        }
    };
})();
