/**
     Filename     :   login.controller.js
     Description  :   Control the login.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   LL
     Date         :   2022-04-07
 **/

(function () {
    'use strict';

    angular.module('myApp')
        .controller('loginController', loginController);

    loginController.$inject = ['$rootScope', '$location', '$filter', '$scope', '$state', '$timeout', 'firebaseFactory', 'requestToListener'];

    function loginController($rootScope, $location, $filter, $scope, $state, $timeout, firebaseFactory, requestToListener) {
        let vm = this;
        vm.loginError = false;

        // Call function on page load to fetch the data.
        vm.$onInit = function() {
            // get data from the parent component
            vm.formData = vm.parent.getData();

            // Hide display spinner on load
            vm.formData.displaySpinner = false;

            // Hide shared error message
            vm.sharedErrorMessage = true;
        }

        vm.loginFormSubmit = function() {
            // Get the authentication state
            firebaseFactory.signInWithEmailAndPassword(vm.email, vm.password).then(function(data) {
                if (data.code == undefined) {
                    vm.formData.formFieldsData.email = vm.email;
                    vm.formData.formFieldsData.password = vm.password;
                    let loginToken = data._lat
                    vm.caregiverIsAlreadyRegistered(loginToken);
                } else {
                    $timeout(function () {
                        vm.loginError = true;
                    });
                }

            }, function(error) {
                vm.loginError = true;
            });
        }

        vm.caregiverIsAlreadyRegistered = function(token) {
            // Verify user account using the login id token
            requestToListener.sendRequestWithResponse('CaregiverIsAlreadyRegistered', { Fields: {'token': token} })
                .then(function (response) {
                    if (response?.status == 200) {
                        vm.parent.languageListForPreference();
                    } else {
                        $state.go('form.questions');
                    }
                })
                .catch(function (error) {
                    // Call function to display error modal box.
                    vm.parent.errorPopup('contactUsError');
                    return false;
                });
        }

        vm.inputChange = function() {
            vm.loginError = false;
        }
    };

})();