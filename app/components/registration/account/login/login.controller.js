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

    loginController.$inject = ['$rootScope', '$location', '$filter', '$scope', '$state', '$timeout', 'firebaseFactory'];

    function loginController($rootScope, $location, $filter, $scope, $state, $timeout, firebaseFactory) {
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
                    if (vm.isCaregiver(vm.email)) {
                        vm.parent.languageListForPreference();
                    } else {
                        $state.go('form.questions');
                    }

                } else {
                    $timeout(function () {
                        vm.loginError = true;
                    });
                }

            }, function(error) {
                vm.loginError = true;
            });
        }

        vm.isCaregiver = async function(email) {
            const request = {
                method: 'get',
                url: `/api/caregivers/caregiver/`,
            };

            return await requestToListener.apiRequest(request, vm.formData.selectedLanguage, {email: email});
        }

        vm.inputChange = function() {
            vm.loginError = false;
        }
    };

})();