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

    loginController.$inject = ['$filter', '$location', '$rootScope', '$scope', '$state', '$timeout', 'firebase'];

    function loginController($filter, $location, $rootScope, $scope, $state, $timeout, firebase) {
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
                    $state.go('form.questions');
                } else {
                    $timeout(function () {
                        vm.loginError = true;
                    });
                }
            }).catch(() => {
                vm.loginError = true;
            });
        }

        vm.inputChange = function() {
            vm.loginError = false;
        }
    }

})();
