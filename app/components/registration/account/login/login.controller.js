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

    loginController.$inject = ['$filter', '$location', '$rootScope', '$scope', '$state', '$timeout', 'firebase', 'requestToListener'];

    function loginController($filter, $location, $rootScope, $scope, $state, $timeout, firebase, requestToListener) {
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
            firebase.signInWithEmailAndPassword(vm.email, vm.password).then(data => {
                if (data.code === undefined) {
                    vm.formData.formFieldsData.email = vm.email;
                    vm.formData.formFieldsData.password = vm.password;
                    vm.formData.accessToken = "";
                    vm.isCaregiverAlreadyRegistered(data.user.accessToken);
                } else {
                    $timeout(function () {
                        vm.loginError = true;
                    });
                }
            }).catch(() => {
                vm.loginError = true;
            });
        }

        vm.isCaregiverAlreadyRegistered = function(token) {
            // Verify user account using the login id token
            requestToListener.sendRequestWithResponse('IsCaregiverAlreadyRegistered', { Fields: {'token': token} })
                .then(function (response) {
                    if (response?.status == 200) {
                        vm.formData.accessToken = token;
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
    }

})();
