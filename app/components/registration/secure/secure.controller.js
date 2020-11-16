/**
     Filename     :   secure.controller.js
     Description  :   Controlle the secure.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';
    angular.module('myApp')


        // Chaecking password pattern and length and based on that display strength meter and password length on view side
        .filter('passwordCount', [function () {
            return function (value, peak) {
                value = angular.isString(value) ? value : '';
                peak = isFinite(peak) ? peak : 20;

                return value && (value.length > peak ? peak + '+' : value.length);
            };
        }])

        .factory('zxcvbn', [function () {
            return {
                score: function () {
                    var compute = zxcvbn.apply(null, arguments);
                    return compute && compute.score;
                }
            };
        }])

        .directive('okPassword', ['zxcvbn', function (zxcvbn) {
            return {
                // restrict to only attribute and class
                restrict: 'AC',

                // use the NgModelController
                require: 'ngModel',

                // add the NgModelController as a dependency to your link function
                link: function ($scope, $element, $rootScope, ngModelCtrl) {
                    $element.on('blur change keydown', function (evt) {
                        $scope.$evalAsync(function ($scope) {
                            // update the $scope.password with the element's value
                            var pwd = $scope.password = $element.val();

                            // resolve password strength score using zxcvbn service
                            $scope.passwordStrength = pwd ? ((pwd.length > 6 && pwd.length < 21) && zxcvbn.score(pwd) || 0) : null;

                            // define the validity criterion for okPassword constraint
                            ngModelCtrl.$setValidity('okPassword', ($scope.passwordStrength > 6 && $scope.passwordStrength < 21));
                        });
                    });
                }
            };
        }])

    // Creating directive to compare email/confirm email values
    var compareTo = function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareToEmail"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    }

    angular.module('myApp').directive("compareToEmail", compareTo)

    // Creating directive to compare password/confirm password values
    var compareTo = function () {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareToPassword"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });
            }
        };
    }

    angular.module('myApp').directive("compareToPassword", compareTo)


        // Secure page controller
        .controller('secureController', secureController);

    secureController.$inject = ['$rootScope', '$location', '$filter', '$scope', '$timeout', 'requestToListener'];

    function secureController($rootScope, $location, $filter, $scope, $timeout, requestToListener) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Fetch broadcast event and change the field error message language.
        $rootScope.$on("changeErrorLanguage", function () {
            $timeout(function () {

                // Call functions to check the both field error values            
                vm.validateEmail();
                vm.validatePassword();
                vm.validateConfirmEmail();
                vm.compareEmail();
                vm.validateConfirmPassword();
                vm.comparePassword();
                vm.validateSecurityQuestion1();
                vm.validateAnswer1();
                vm.validateSecurityQuestion2();
                vm.validateAnswer2();
                vm.validateSecurityQuestion3();
                vm.validateAnswer3();
            });
        });

        // Call function on page load to fetch the data.
        vm.$onInit = activate;
        function activate() {
            // get data from the parent component
            vm.formData = vm.parent.getData();

            // Call function to set current form class as active.
            vm.setFormStatus();

            // Hide display spinner on load
            vm.formData.displaySpinner = true;

            // Hide shared error message
            vm.sharedErrorMessage = true;

        }

        $scope.$on('$destroy', function () {
            delete window.onbeforeunload;
        });

        //// Display alert on page refresh
        //window.onbeforeunload = function () {
        //    debugger;
        //    return "";
        //};

        // Password ToolTip Message
        vm.passwordTooltip = {
            templateUrl: 'passwordTooltipTemplate.html',
            content: $filter('translate')('TOOLTIP.PASSWORDFORMAT')
        }

        // Method to to set current form class as active.
        vm.setFormStatus = function () {
            vm.formData.searchForm = "";
            vm.formData.secureForm.status = "active";
            vm.formData.secureForm.flag = 1;
            vm.formData.preferenceForm.status = "";
            vm.formData.preferenceForm.flag = null;
            vm.formData.agreementForm.status = "";
            vm.formData.agreementForm.flag = null;
            vm.formData.successForm.status = "";
            vm.formData.successForm.flag = null;
        }

        // Function to validate email
        vm.validateEmail = function () {

            //Email pattern
            var strongRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

            if (vm.formData.formFieldsData.email == undefined || vm.formData.formFieldsData.email == null || vm.formData.formFieldsData.email == "") {
                vm.formData.emailFormat.status = 'invalid';
                //vm.formData.emailFormat.message = null;
                vm.formData.emailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.EMAILREQUIRED');
            }
            else {
                if (!strongRegex.test(vm.formData.formFieldsData.email)) {
                    vm.formData.emailFormat.status = 'invalid';
                    vm.formData.emailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.EMAILFORMAT');
                }
                else {
                    vm.formData.emailFormat.status = 'valid';
                    vm.formData.emailFormat.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;

                    }
                }
            }
        }

        // Function to validate password
        vm.validatePassword = function () {

            //Variable to set field status and message.
            vm.passwordFormat = { status: null, message: null };

            vm.formData.passwordMeter = $scope.passwordStrength;
            
            if (vm.formData.formFieldsData.password == undefined || vm.formData.formFieldsData.password == null || vm.formData.formFieldsData.password == "") {
                vm.formData.passwordFormat.status = 'invalid';
                //vm.formData.passwordFormat.message = null;
                vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDREQUIRED');
            }
            else {
                if (vm.formData.formFieldsData.password.length < 8) {
                    vm.formData.passwordFormat.status = 'invalid';
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SHOTPASSWORDLENGTH');
                    return;
                }
                else if (vm.formData.formFieldsData.password.length > 20) {
                    vm.formData.passwordFormat.status = 'invalid';
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.LONGPASSWORDLENGTH');
                    return;
                }
                else if (vm.formData.formFieldsData.password.search(/\W|_{1}/) <= -1 || vm.formData.formFieldsData.password.search(/[A-Z]/) === -1 || vm.formData.formFieldsData.password.search(/\d/) === -1) {
                    vm.formData.passwordFormat.status = 'invalid';
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDFORMAT');
                    return;
                }
                else {
                    vm.formData.passwordFormat.status = 'valid';
                    vm.formData.passwordFormat.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;

                    }
                }
            }
        }

        // Function to compare email and confirm email fields.
        vm.validateConfirmEmail = function () {
            if (vm.formData.confirmEmail == undefined || vm.formData.confirmEmail == null || vm.formData.confirmEmail == "") {
                vm.formData.confirmEmailFormat.status = 'invalid';
                vm.formData.confirmEmailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.CONFIRMEMAILREQUIRED');
            }
            else {
                if (vm.formData.formFieldsData.email != vm.formData.confirmEmail) {
                    vm.formData.confirmEmailFormat.status = 'invalid';
                    vm.formData.confirmEmailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.COMPAREEMAIL');
                }
                else {
                    vm.formData.confirmEmailFormat.status = 'valid';
                    vm.formData.confirmEmailFormat.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }

        // Function to compare email and confirm email on blur event of email textbox.
        vm.compareEmail = function () {

            if (vm.formData.formFieldsData.email == undefined || vm.formData.formFieldsData.email == null || vm.formData.formFieldsData.email == "") {
                vm.formData.confirmEmailFormat.status = 'invalid';
                vm.formData.confirmEmailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.COMPAREEMAIL');
            }
            else {
                if (vm.formData.formFieldsData.email != vm.formData.confirmEmail) {
                    vm.formData.confirmEmailFormat.status = 'invalid';
                    vm.formData.confirmEmailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.COMPAREEMAIL');
                }

                else {
                    vm.formData.confirmEmailFormat.status = 'valid';
                    vm.formData.confirmEmailFormat.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }

        }

        // Function to compare password and confirm password fields.
        vm.validateConfirmPassword = function () {

            if (vm.formData.confirmPassword == undefined || vm.formData.confirmPassword == null || vm.formData.confirmPassword == "") {
                vm.formData.confirmPasswordFormat.status = 'invalid';
                vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.CONFIRMPASSWORDREQUIRED');
            }
            else {
                if (vm.formData.formFieldsData.password != vm.formData.confirmPassword) {
                    vm.formData.confirmPasswordFormat.status = 'invalid';
                    vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.COMPAREPASSWORD');
                }
                else {
                    vm.formData.confirmPasswordFormat.status = 'valid';
                    vm.formData.confirmPasswordFormat.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }

            }
        }

        // Function to compare password and confirm password on blur event of password textbox.
        vm.comparePassword = function () {
            if (vm.formData.formFieldsData.password == undefined || vm.formData.formFieldsData.password == null || vm.formData.formFieldsData.password == "") {
                vm.formData.confirmPasswordFormat.status = 'invalid';
                vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.COMPAREPASSWORD');
            }
            else {
                if (vm.formData.formFieldsData.password != vm.formData.confirmPassword) {
                    vm.formData.confirmPasswordFormat.status = 'invalid';
                    vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.COMPAREPASSWORD');
                }

                else {
                    vm.formData.confirmPasswordFormat.status = 'valid';
                    vm.formData.confirmPasswordFormat.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }


        vm.securityQuestion1 = function (securityQuestion) {
            return (!(vm.formData.formFieldsData.securityQuestion1 && vm.formData.formFieldsData.securityQuestion1) || securityQuestion.id != vm.formData.formFieldsData.securityQuestion1);
        };
        vm.securityQuestion2 = function (securityQuestion) {
            return (!(vm.formData.formFieldsData.securityQuestion2 && vm.formData.formFieldsData.securityQuestion2) || securityQuestion.id != vm.formData.formFieldsData.securityQuestion2);
        };
        vm.securityQuestion3 = function (securityQuestion) {
            return (!(vm.formData.formFieldsData.securityQuestion3 && vm.formData.formFieldsData.securityQuestion3) || securityQuestion.id != vm.formData.formFieldsData.securityQuestion3);
        };


        // Function to validate security question1.
        vm.validateSecurityQuestion1 = function () {

            if (vm.formData.formFieldsData.securityQuestion1 == undefined || vm.formData.formFieldsData.securityQuestion1 == null || vm.formData.formFieldsData.securityQuestion1 == "") {
                vm.formData.securityQuestion1Format.status = 'invalid';
                vm.formData.securityQuestion1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            }
            else {
                vm.formData.securityQuestion1Format.status = 'valid';
                vm.formData.securityQuestion1Format.message = null;

                // Trim the space in security answers
                if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer1.
        vm.validateAnswer1 = function () {

            if (vm.formData.formFieldsData.answer1 == undefined || vm.formData.formFieldsData.answer1 == null || vm.formData.formFieldsData.answer1 == "") {
                vm.formData.answer1Format.status = 'invalid';
                vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            }
            else {
                if ((vm.formData.formFieldsData.answer1 == vm.formData.formFieldsData.answer2) || (vm.formData.formFieldsData.answer1 == vm.formData.formFieldsData.answer3)) {
                    vm.formData.answer1Format.status = 'invalid';
                    vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                }
                else if (vm.formData.formFieldsData.answer1.length < 3) {
                    vm.formData.answer1Format.status = 'invalid';
                    vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                }
                else {
                    vm.formData.answer1Format.status = 'valid';
                    vm.formData.answer1Format.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }

        // Function to validate security question2.
        vm.validateSecurityQuestion2 = function () {

            if (vm.formData.formFieldsData.securityQuestion2 == undefined || vm.formData.formFieldsData.securityQuestion2 == null || vm.formData.formFieldsData.securityQuestion2 == "") {
                vm.formData.securityQuestion2Format.status = 'invalid';
                vm.formData.securityQuestion2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            }
            else {
                vm.formData.securityQuestion2Format.status = 'valid';
                vm.formData.securityQuestion2Format.message = null;

                if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer2.
        vm.validateAnswer2 = function () {

            if (vm.formData.formFieldsData.answer2 == undefined || vm.formData.formFieldsData.answer2 == null || vm.formData.formFieldsData.answer2 == "") {
                vm.formData.answer2Format.status = 'invalid';
                vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            }
            else {
                if ((vm.formData.formFieldsData.answer2 == vm.formData.formFieldsData.answer1) || (vm.formData.formFieldsData.answer2 == vm.formData.formFieldsData.answer3)) {
                    vm.formData.answer2Format.status = 'invalid';
                    vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                }
                else if (vm.formData.formFieldsData.answer2.length < 3) {
                    vm.formData.answer2Format.status = 'invalid';
                    vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                }
                else {
                    vm.formData.answer2Format.status = 'valid';
                    vm.formData.answer2Format.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }


        // Function to validate security question3.
        vm.validateSecurityQuestion3 = function () {

            if (vm.formData.formFieldsData.securityQuestion3 == undefined || vm.formData.formFieldsData.securityQuestion3 == null || vm.formData.formFieldsData.securityQuestion3 == "") {
                vm.formData.securityQuestion3Format.status = 'invalid';
                vm.formData.securityQuestion3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            }
            else {
                vm.formData.securityQuestion3Format.status = 'valid';
                vm.formData.securityQuestion3Format.message = null;

                if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer3.
        vm.validateAnswer3 = function () {

            if (vm.formData.formFieldsData.answer3 == undefined || vm.formData.formFieldsData.answer3 == null || vm.formData.formFieldsData.answer3 == "") {
                vm.formData.answer3Format.status = 'invalid',
                    vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            }
            else {
                if ((vm.formData.formFieldsData.answer3 == vm.formData.formFieldsData.answer1) || (vm.formData.formFieldsData.answer3 == vm.formData.formFieldsData.answer2)) {
                    vm.formData.answer3Format.status = 'invalid',
                        vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                }
                else if (vm.formData.formFieldsData.answer3.length < 3) {
                    vm.formData.answer3Format.status = 'invalid';
                    vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                }
                else {
                    vm.formData.answer3Format.status = 'valid';
                    vm.formData.answer3Format.message = null;

                    if (vm.formData.emailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }

        // Secure form onsubmit method
        vm.secureFormSubmit = function () {

            //Validate all fields as required fields
            if (vm.formData.formFieldsData.email == undefined || vm.formData.formFieldsData.email == null || vm.formData.formFieldsData.email == "") {
                vm.formData.emailFormat.status = 'invalid';
                vm.formData.emailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.EMAILREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.confirmEmail == undefined || vm.formData.confirmEmail == null || vm.formData.confirmEmail == "") {
                vm.formData.confirmEmailFormat.status = 'invalid';
                vm.formData.confirmEmailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.CONFIRMEMAILREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.password == undefined || vm.formData.formFieldsData.password == null || vm.formData.formFieldsData.password == "") {
                vm.formData.passwordFormat.status = 'invalid';
                vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.confirmPassword == undefined || vm.formData.confirmPassword == null || vm.formData.confirmPassword == "") {
                vm.formData.confirmPasswordFormat.status = 'invalid';
                vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.CONFIRMPASSWORDREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.securityQuestion1 == undefined || vm.formData.formFieldsData.securityQuestion1 == null || vm.formData.formFieldsData.securityQuestion1 == "") {
                vm.formData.securityQuestion1Format.status = 'invalid';
                vm.formData.securityQuestion1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.answer1 == undefined || vm.formData.formFieldsData.answer1 == null || vm.formData.formFieldsData.answer1 == "") {
                vm.formData.answer1Format.status = 'invalid';
                vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.securityQuestion2 == undefined || vm.formData.formFieldsData.securityQuestion2 == null || vm.formData.formFieldsData.securityQuestion2 == "") {
                vm.formData.securityQuestion2Format.status = 'invalid';
                vm.formData.securityQuestion2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.answer2 == undefined || vm.formData.formFieldsData.answer2 == null || vm.formData.formFieldsData.answer2 == "") {
                vm.formData.answer2Format.status = 'invalid';
                vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.securityQuestion3 == undefined || vm.formData.formFieldsData.securityQuestion3 == null || vm.formData.formFieldsData.securityQuestion3 == "") {
                vm.formData.securityQuestion3Format.status = 'invalid';
                vm.formData.securityQuestion3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.formFieldsData.answer3 == undefined || vm.formData.formFieldsData.answer3 == null || vm.formData.formFieldsData.answer3 == "") {
                vm.formData.answer3Format.status = 'invalid';
                vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.formData.emailFormat.status == 'valid' && vm.formData.confirmEmailFormat.status == 'valid' && vm.formData.passwordFormat.status == 'valid' && vm.formData.confirmPasswordFormat.status == 'valid' && vm.formData.securityQuestion1Format.status == 'valid' && vm.formData.answer1Format.status == 'valid' && vm.formData.securityQuestion2Format.status == 'valid' && vm.formData.answer2Format.status == 'valid' && vm.formData.securityQuestion3Format.status == 'valid' && vm.formData.answer3Format.status == 'valid') {
                
                // Hide shared error message
                vm.sharedErrorMessage = true;

                //vm.checkFirebaseEmail();

                vm.formData.formFieldsData.answer1 = vm.formData.formFieldsData.answer1.toUpperCase();
                vm.formData.formFieldsData.answer2 = vm.formData.formFieldsData.answer2.toUpperCase();
                vm.formData.formFieldsData.answer3 = vm.formData.formFieldsData.answer3.toUpperCase();

                // Call function ot language list
                vm.languageList();
            }
        }

        // Function to check if email is already in use.
        vm.checkFirebaseEmail = function () {

            // Display display spinner before calling service
            vm.formData.displaySpinner = false;

            // Method to get security questions list from database
            var parameters = vm.formData.formFieldsData.email;

            requestToListener.sendRequestWithResponse('CheckFirebaseEmail', { Fields: parameters })
                .then(function (response) {

                    if (response.Data == "auth/email-already-in-use") {

                        vm.formData.emailFormat.status = 'invalid',
                            //vm.formData.emailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.EMAILINUSE');
                            vm.formData.emailFormat.message = 'test';
                    }

                    else if (response.Data == "ERROR") {

                        // Call function to get accesslevel list.
                        vm.accessLevelList();
                    }
                    else {

                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        vm.parent.displayError(errorModalPage);
                    }


                })
                .catch(function (error) {

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage);
                });
        }

        // Function to call service to get access level list.
        vm.accessLevelList = function () {

            // Display display spinner before calling service
            vm.formData.displaySpinner = false;

            // Method to get security questions list from database
            var parameters = vm.formData.formFieldsData.ramq;

            requestToListener.sendRequestWithResponse('AccessLevelList', { Fields: parameters })
                .then(function (response) {

                    // Get the value from result response and bind values into dropdown
                    var accessLevelList = response.Data[0];

                    // Check length of the variable
                    if (accessLevelList.length > 1) {

                        // Define loop for passing the value of language option.
                        for (var i = 0; i < accessLevelList.length; i++) {

                            // Assing in JSON format
                            vm.formData.accessLevelList_EN[i] = {
                                "ID": accessLevelList[i].Id,
                                "VALUE": accessLevelList[i].AccessLevelName_EN
                            }

                            vm.formData.accessLevelList_FR[i] = {
                                "ID": accessLevelList[i].Id,
                                "VALUE": accessLevelList[i].AccessLevelName_FR
                            }
                        }

                        // Check the default selected language.
                        if (vm.formData.selectedLanguage == 'en')
                            vm.formData.accessLevelList = vm.formData.accessLevelList_EN;
                        else
                            vm.formData.accessLevelList = vm.formData.accessLevelList_FR;


                    }
                    else {
                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        vm.parent.displayError(errorModalPage);
                    }

                })
                .catch(function (error) {

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage);
                });

        }

        // Function to call service to get language list.
        vm.languageList = function () {

            // Method to get security questions list from database
            var parameters = vm.formData.formFieldsData.ramq;

            requestToListener.sendRequestWithResponse('LanguageList', { Fields: parameters })
                .then(function (response) {

                    // Get the value from result response and bind values into dropdown
                    var languageList = response.Data[0];

                    // Check length of the variable
                    if (languageList.length > 1) {

                        // Define loop for passing the value of language option.
                        for (var i = 0; i < languageList.length; i++) {

                            // Assing in JSON format
                            vm.formData.languageList_EN[i] = {
                                "ID": languageList[i].Id,
                                "PREFIX": languageList[i].Prefix,
                                "VALUE": languageList[i].LanguageName_EN
                            }

                            vm.formData.languageList_FR[i] = {
                                "ID": languageList[i].Id,
                                "PREFIX": languageList[i].Prefix,
                                "VALUE": languageList[i].LanguageName_FR
                            }
                        }

                        // Check the default selected language.
                        if (vm.formData.selectedLanguage == 'en')
                            vm.formData.languageList = vm.formData.languageList_EN;
                        else
                            vm.formData.languageList = vm.formData.languageList_FR;

                        // Hide display spinner if service get error.
                        vm.formData.displaySpinner = true;

                        $rootScope.$apply(function () {
                            $location.path('/form/opalPreference');
                        });
                    }

                    else {
                        // Call function to display error modal box.
                        var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                        vm.parent.displayError(errorModalPage);

                    }

                })
                .catch(function (error) {

                    // Call function to display error modal box.
                    var errorModalPage = 'app/components/registration/shared/modalBox/contactUsError.html';
                    vm.parent.displayError(errorModalPage);
                });
        }
    }
})();
