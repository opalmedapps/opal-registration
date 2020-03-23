/**
     Filename     :   form.controller.js
     Description  :   Controlle the search.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';

    angular.module('myApp')
        .controller('searchController', searchController);

    searchController.$inject = ['$filter', '$location', '$rootScope', '$uibModal', '$timeout' , 'requestToListener', 'searchService', 'firebaseFactory', 'userAuthorizationService', 'encryptionService'];

    function searchController($filter, $location, $rootScope, $uibModal, $timeout, requestToListener, searchService, firebaseFactory, userAuthorizationService, encryptionService) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Fetch broadcast event and change the field error message language.
        $rootScope.$on("changeErrorLanguage", function () {
            debugger;
            $timeout(function () {

                // Call functions to check the both field error values            
                vm.validateRegistrationCode();
                vm.validateRAMQ();
            });
        });
        
        // Declare global variable to store branch name.
        //var branchName = '';

        // Call function on page load to fetch the data.
        vm.$onInit = activate;

        // Call function on page load to fetch the data.
        function activate() {
            debugger;

            // get data from the parent component
            vm.formData = vm.parent.getData();

            vm.formData.selectedLanguage = ((window.navigator.language || window.navigator.userLanguage).slice(0, 2)).toLowerCase();

            // Call function to set current form class as active.
            vm.setFormStatus();

            debugger;
            // Hide display spinner on load
            vm.formData.displaySpinner = true;

            // Hide shared error message
            vm.sharedErrorMessage = true;

            // Call common function to check valid status of all the fields.
            // vm.checkAllFieldsValidStatus();
            vm.sharedErrorMessage = true;

            // Call functio to fetch URL query parameters.
            vm.fetchURL();
        }

        // Registration code tooltip image path
        vm.registrationcodeTooltip = {
            templateUrl: 'registrationcodeTooltipTemplate.html',
            content: $filter('translate')('TOOLTIP.REGISTRATIONCODE')
        };

        // RAMQ tooltip image path
        vm.ramqTooltip = {
            templateUrl: 'ramqTooltipTemplate.html',
            image: 'images/tooltip/ramq.jpg'
        };

        // Method to fetch URL query parameter to autofill Registration code.
        vm.fetchURL = function () {
            debugger;
            if ($location.search().hasOwnProperty('code')) {

                vm.formData.formFieldsData.registrationCode = $location.search()['code'];

                vm.validateRegistrationCode();
                //vm.formData.codeFormat.status = 'valid';
                //vm.formData.codeFormat.message = null;
            }
        }

        // Method to to set current form class as active and set flag for translation.
        vm.setFormStatus = function () {
            debugger;
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

            //Disable Confirm button.
            //vm.searchFormValid = true;

            if (vm.formData.formFieldsData.registrationCode == undefined || vm.formData.formFieldsData.registrationCode == null || vm.formData.formFieldsData.registrationCode == "") {
                vm.formData.codeFormat.status = 'invalid';
                vm.formData.codeFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.CODEREQUIRED');
            }
            else {
                if (vm.formData.formFieldsData.registrationCode.length < 10) {
                    vm.formData.codeFormat.status = 'invalid';
                    vm.formData.codeFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.SHORTCODELENGTH');
                }

                else if (vm.formData.formFieldsData.registrationCode.length > 10) {
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

        // Validate to RAMQ format and length.
        vm.validateRAMQ = function () {

            if (vm.formData.formFieldsData.ramq == undefined || vm.formData.formFieldsData.ramq == null || vm.formData.formFieldsData.ramq == "") {
                vm.formData.ramqFormat.status = 'invalid';
                vm.formData.ramqFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.RAMQREQUIRED');
            }
            else {
                if (vm.formData.formFieldsData.ramq.length < 12) {
                    vm.formData.ramqFormat.status = 'invalid';
                    vm.formData.ramqFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.SHORTRAMQLENGTH');
                }

                else if (vm.formData.formFieldsData.ramq.length > 12) {
                    vm.formData.ramqFormat.status = 'invalid';
                    vm.formData.ramqFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.LONGRAMQLENGTH');
                }
                else {
                    vm.formData.ramqFormat.status = 'valid';
                    vm.formData.ramqFormat.message = null;

                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        };

        // Function to display shared error message and enable next button on all fields valid status.
        vm.checkAllFieldsValidStatus = function () {
            debugger;
            if (vm.formData.codeFormat.status == 'valid' && vm.formData.ramqFormat.status == 'valid') {
                // Display shared error message
                vm.sharedErrorMessage = true;

                // Enable form confirm button
                //vm.searchFormValid = false;
            }
            else {
                // Display shared error message
                vm.sharedErrorMessage = false;

                // Enable form confirm button
                //vm.searchFormValid = true;
            }
        }

        // Form onsubmit method
        vm.searchFormSubmit = function () {

            debugger;
            //Validate all fields as required fields on form submit
            if (vm.formData.formFieldsData.registrationCode == undefined || vm.formData.formFieldsData.registrationCode == null || vm.formData.formFieldsData.registrationCode == "") {
                vm.formData.codeFormat.status = 'invalid';
                vm.formData.codeFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.CODEREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.ramq == undefined || vm.formData.formFieldsData.ramq == null || vm.formData.formFieldsData.ramq == "") {
                vm.formData.ramqFormat.status = 'invalid';
                vm.formData.ramqFormat.message = $filter('translate')('SEARCH.FIELDERRORMESSAGES.RAMQREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.codeFormat.status == 'valid' && vm.formData.ramqFormat.status == 'valid') {
                // Display shared error message
                vm.sharedErrorMessage = true;

                // Enable form confirm button
                //vm.searchFormValid = false;
                var ramq = vm.formData.formFieldsData.ramq;
                vm.formData.formFieldsData.ramq = ramq.toUpperCase();



                // Call function load config
                vm.createToken();
            }

        };


        // Function to create firebase token and sign in with same token.
        vm.createToken = function () {
            debugger;

            // Display display spinner before calling service
            vm.formData.displaySpinner = false;

            // Call form service
            searchService.createToken().then(function (results) {
                debugger;
                // Get the value from result response and store into token variable which is globally access for this file
                vm.formData.formFieldsData.token = results.data.result;

                // Call function to signIn in firebase.
                debugger;
                vm.firebaseSignIn(vm.formData.formFieldsData.token);

            }).catch(function (error) {
                debugger;
                // Get error response and display it.
                vm.data = error;
                // Call function to display error modal box.
                var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                vm.parent.displayError(errorModalPage);
            });

        }

        // Function to signin in firebase with recently created token.
        vm.firebaseSignIn = function (token) {
            debugger;
            firebaseFactory.signInWithToken(token).then(function (userData) {
                debugger;

                // check if service is getting right response.
                if (userData != undefined) {

                    vm.formData.formFieldsData.uniqueId = userData.uid;

                    //Set the authorized user once we get unique Id from firebase
                    userAuthorizationService.setFirebaseUser(encryptionService.hash(userData.uid), vm.formData.formFieldsData.registrationCode, token, vm.formData.formFieldsData.ramq);

                    // Check user input in backend.
                    vm.createBranchName();
                }

            }).catch(function (error) {
                debugger;
                console.log('error' + error);

                var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                var flag = 1;
                // Call function to display error modal box.
                vm.parent.displayError(errorModalPage, flag);

            });
        }

        // Call service to check valid branch.
        vm.createBranchName = function () {
            debugger;
            //$.ajax({
            //    type: "POST",
            //    data:
            //    {
            //        "code": vm.formData.formFieldsData.registrationCode,
            //        "ramq": vm.formData.formFieldsData.ramq
            //    },
            //    url: 'php/validation/create.branch.name.php',
            //    success: function (response) {
            //        debugger;
            //        console.log('success');
            //    },
            //    error: function (response) {
            //        debugger;
            //    }
            //});

            vm.formData.branchName = encryptionService.hash(vm.formData.formFieldsData.registrationCode);

            //Set the firebase branch name
            userAuthorizationService.setFirebaseBranchName(vm.formData.branchName);

            // Call function to get an IP address of user.
            vm.getIP();

          
            // Service call
            //searchService.createBranchName(vm.formData.formFieldsData.registrationCode, vm.formData.formFieldsData.ramq).then(function (response) {
            //    debugger;

            //    // Check the response status and perform action accordingly
            //    if (response.status == 200) {
            //        console.log(" valid input response : " + JSON.stringify(response));
            //        vm.formData.branchName = response.data.result;
            //        debugger;
            //        //vm.validateFirebaseBranch(vm.formData.branchName);

            //        //Set the firebase branch name
            //        userAuthorizationService.setFirebaseBranchName(vm.formData.branchName);

            //        // Call function to get an IP address of user.
            //        vm.getIP();
            //    }
            //    else {

            //        // Call function to display error modal box.
            //        var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
            //        var flag = 1;
            //        // Call function to display error modal box.
            //        vm.parent.displayError(errorModalPage, flag);
            //    }
            //}).catch(function (error) {
            //    debugger;
            //    console.log(error);

            //    // Call function to display error modal box.
            //    var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
            //    var flag = 1;
            //    // Call function to display error modal box.
            //    vm.parent.displayError(errorModalPage, flag);
            //});

        }

        // Call service to check valid branch.
        vm.validateFirebaseBranch = function (branchName) {
            debugger;
            firebaseFactory.checkFirebaseBranch().then(function (response) {
                debugger;
            }).catch(function (error) {
                console.log(error);
            });

            firebaseFactory.validateFirebaseBranch(branchName).then(function (response) {
                debugger;
                if (response == "TimeStamp") {

                    //Set the firebase branch name
                    userAuthorizationService.setFirebaseBranchName(branchName);

                    // Call function to get an IP address of user.
                    vm.getIP();
                }
                else {
                    debugger;
                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                    vm.parent.displayError(errorModalPage);
                }
            }).catch(function (error) {
                debugger;
                // Call function to display error modal box.
                var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                vm.parent.displayError(errorModalPage);
            });
        }

        // Call service to get IP address of user.
        vm.getIP = function () {


            // Service call
            searchService.getIP().then(function (response) {
                debugger;

                // Check the response status and perform action accordingly
                if (response.status == 200) {
                    console.log(" valid input response : " + JSON.stringify(response));
                    var IPAddress = response.data.result;
                    vm.insertIPLog(IPAddress);
                }
                else {

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                    vm.parent.displayError(errorModalPage);
                }
            }).catch(function (error) {
                debugger;
                console.log(error);

                // Call function to display error modal box.
                var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                vm.parent.displayError(errorModalPage);
            });

        }

        // Method to call service to insert Ip address.
        vm.insertIPLog = function (IPAddress) {
            debugger;
            var parameters = {
                'IPAddress': IPAddress
            };
            //var parameters = {
            //    'IPAddress': IPAddress,
            //    'FirebaseBranchName': vm.formData.branchName
            //};
            debugger;
            // Listener service call.
            requestToListener.sendRequestWithResponse('InsertIPLog', { Fields: parameters })
                .then(function (response) {
                    debugger;
                    console.log(response.Data);

                    debugger;
                    if (response.Data[0].Result == 'SUCCESS') {
                        debugger;
                        // Call function to validate IPAddress.
                        vm.validateIP(IPAddress);
                    }
                    else {

                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                        vm.parent.displayError(errorModalPage);
                    }

                })
                .catch(function (error) {
                    debugger;
                    console.log(error);

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                    vm.parent.displayError(errorModalPage);
                });

        }

        // Method to check IP.
        vm.validateIP = function (IPAddress) {

            var parameters = IPAddress;

            debugger;
            // Listener service call.
            requestToListener.sendRequestWithResponse('ValidateIP', { Fields: parameters })
                .then(function (response) {
                    debugger;
                    console.log(response.Data);
                    // Check length of the variable
                    if (response.Data[0].Result == 'SUCCESS') {
                        debugger;
                        // Call function to get user name.
                        vm.validInputs(vm.formData.branchName);
                    }
                    else {
                        debugger;

                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/somethingWentWrongError.html';
                        vm.parent.displayError(errorModalPage);
                    }
                })
                .catch(function (error) {
                    debugger;
                    console.log(error);

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/somethingWentWrongError.html';
                    vm.parent.displayError(errorModalPage);
                });
        }

        // Method to call service to check valid input.
        vm.validInputs = function (requestObject) {
            debugger;

            // Parameter object
            var parameters = {
                'FirebaseBranchName': requestObject,
                'RegistrationCode': vm.formData.formFieldsData.registrationCode,
                'RAMQ': vm.formData.formFieldsData.ramq
            };
            debugger;
            // Listener service call.
            requestToListener.sendRequestWithResponse('ValidateInputs', { Fields: parameters })
                .then(function (response) {
                    debugger;
                    console.log(response.Data);
                    debugger;
                    if (response.Data[0].Result == 'SUCCESS') {
                        debugger;
                        // Call function to get user name.
                        vm.getUserName();
                    }
                    else {
                        debugger;

                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                        vm.parent.displayError(errorModalPage);
                    }

                })
                .catch(function (error) {
                    debugger;
                    console.log(error);
                    // Hide display spinner if service get error.
                    vm.formData.displaySpinner = true;

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                    vm.parent.displayError(errorModalPage);

                    // Call function to reset value of every text fields.
                    vm.resetFields();
                });
        }

        // Function to get user first name and last name.
        vm.getUserName = function () {

            // Parameter
            var parameters = vm.formData.formFieldsData.ramq;

            debugger;
            // Listener service call.
            requestToListener.sendRequestWithResponse('GetUserName', { Fields: parameters })
                .then(function (response) {
                    debugger;
                    console.log(response.Data);
                    // Check length of the variable
                    if (response.Data[0].length == 1) {
                        debugger;
                        vm.formData.firstName = response.Data[0][0].FirstName;
                        vm.formData.lastName = response.Data[0][0].LastName;

                        // Call function to get security question list.
                        vm.getSecurityQuestionList();
                    }
                    else {
                        debugger;
                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        vm.parent.displayError(errorModalPage);
                    }
                })
                .catch(function (error) {

                    debugger;
                    console.log(error);

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                    vm.parent.displayError(errorModalPage);
                });
        }

        // Function to load security questions list on service call.
        vm.getSecurityQuestionList = function () {

            // Parameter
            var parameters = vm.formData.formFieldsData.ramq;

            debugger;
            // Listener service call.
            requestToListener.sendRequestWithResponse('SecurityQuestionsList', { Fields: parameters })
                .then(function (response) {
                    debugger;
                    console.log(response.Data);

                    // assing response to temporary variable.
                    var SecurityQuestionsList = response.Data[0];

                    // Check length of the variable
                    if (SecurityQuestionsList.length > 1) {
                        debugger;

                        // Define loop for passing the value of securityquestions.
                        for (var i = 0; i < SecurityQuestionsList.length; i++) {
                            debugger;

                            // Assing in JSON format
                            vm.formData.securityQuestionList_EN[i] = {
                                "id": SecurityQuestionsList[i].SecurityQuestionSerNum,
                                "value": SecurityQuestionsList[i].QuestionText_EN
                            }

                            vm.formData.securityQuestionList_FR[i] = {
                                "id": SecurityQuestionsList[i].SecurityQuestionSerNum,
                                "value": SecurityQuestionsList[i].QuestionText_FR
                            }
                        }

                        // Check the default selected language.
                        if (vm.formData.selectedLanguage == 'en')
                            vm.formData.securityQuestionList = vm.formData.securityQuestionList_EN;
                        else
                            vm.formData.securityQuestionList = vm.formData.securityQuestionList_FR;

                        debugger;
                        console.log('securityQuestionList' + vm.formData.securityQuestionList);

                        // Hide display spinner after all request get response.
                        vm.formData.displaySpinner = true;

                        $rootScope.$apply(function () {
                            debugger;
                            $location.path('/form/secureInformation');
                            console.log($location.path());
                        });

                    }
                    else {
                        debugger;

                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        vm.parent.displayError(errorModalPage);
                    }
                })
                .catch(function (error) {
                    debugger;
                    console.log(error);

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/notFoundError.html';
                    vm.parent.displayError(errorModalPage);

                });
        }

        // Common method to display error.
        //vm.displayError = function (errorModalPage) {
        //    // Hide display spinner if service get error.
        //    vm.formData.displaySpinner = true;

        //    $uibModal.open({
        //        animation: true,
        //        templateUrl: errorModalPage,
        //        windowClass: 'show',
        //        backdropClass: 'show',
        //        controller: function ($scope, $uibModalInstance) {
        //            $scope.close = function () {
        //                debugger;
        //                $uibModalInstance.close(false);

        //                // Parent controller function to reset the fields value.
        //                vm.parent.resetFields();
        //            };
        //        }
        //    });

        //    // Call function to reset value of every text fields.
        //    //vm.resetFields();
        //}

        //// Method to reset value of each text boxes.
        //vm.resetFields = function () {

        //    // Delete value of text box.
        //    vm.formData.formFieldsData.registrationCode = "";
        //    vm.formData.formFieldsData.ramq = "";

        //    // Reset status and message of all fields.
        //    vm.formData.codeFormat = { status: null, message: null };
        //    vm.formData.ramqFormat = { status: null, message: null };
        //}
    };

})();