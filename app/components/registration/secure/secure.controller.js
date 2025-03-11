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

    secureController.$inject = ['$rootScope', '$location', '$filter', '$scope', '$timeout', 'requestToListener', 'apiConstants'];

    function secureController($rootScope, $location, $filter, $scope, $timeout, requestToListener, apiConstants) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Fetch broadcast event and change the field error message language.
        $rootScope.$on("changeErrorLanguage", function () {
            $timeout(function () {

                // Call functions to check the both field error values
                vm.validatePassword();
                vm.validateConfirmPassword();
                vm.comparePassword();
                vm.validatePhone();
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
            vm.formData.displaySpinner = false;

            // Hide shared error message
            vm.sharedErrorMessage = true;

        }

        $scope.$on('$destroy', function () {
            delete window.onbeforeunload;
        });

        vm.allStatusValid = function() {
            return vm.formData.passwordFormat.status == vm.parent.STATUS_VALID &&
                vm.formData.confirmPasswordFormat.status == vm.parent.STATUS_VALID &&
                vm.formData.phoneFormat.status == vm.parent.STATUS_VALID &&
                vm.formData.securityQuestion1Format.status == vm.parent.STATUS_VALID &&
                vm.formData.answer1Format.status == vm.parent.STATUS_VALID &&
                vm.formData.securityQuestion2Format.status == vm.parent.STATUS_VALID &&
                vm.formData.answer2Format.status == vm.parent.STATUS_VALID &&
                vm.formData.securityQuestion3Format.status == vm.parent.STATUS_VALID &&
                vm.formData.answer3Format.status == vm.parent.STATUS_VALID;
        }

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

        // Function to validate password
        vm.validatePassword = function () {

            //Variable to set field status and message.
            vm.passwordFormat = { status: null, message: null };

            vm.formData.passwordMeter = $scope.passwordStrength;
            if (vm.parent.isEmpty(vm.formData.formFieldsData.password)) {
                vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                //vm.formData.passwordFormat.message = null;
                vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDREQUIRED');
            } else {
                if (vm.formData.formFieldsData.password.length < 8) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SHOTPASSWORDLENGTH');
                    return;
                } else if (vm.formData.formFieldsData.password.length > 20) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.LONGPASSWORDLENGTH');
                    return;
                } else if (vm.formData.formFieldsData.password.search(/\W|_{1}/) <= -1 ||
                    vm.formData.formFieldsData.password.search(/[A-Z]/) === -1 ||
                    vm.formData.formFieldsData.password.search(/\d/) === -1) {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDFORMAT');
                    return;
                } else {
                    vm.formData.passwordFormat.status = vm.parent.STATUS_VALID;
                    vm.formData.passwordFormat.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;

                    }
                }
            }
        }

        // Function to compare password and confirm password fields.
        vm.validateConfirmPassword = function () {
            if (vm.parent.isEmpty(vm.formData.confirmPassword)) {
                vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.CONFIRMPASSWORDREQUIRED');
            } else {
                if (vm.formData.formFieldsData.password != vm.formData.confirmPassword) {
                    vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.COMPAREPASSWORD');
                }
                else {
                    vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_VALID;
                    vm.formData.confirmPasswordFormat.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }

            }
        }

        // Function to compare password and confirm password on blur event of password textbox.
        vm.comparePassword = function () {
            if (vm.parent.isEmpty(vm.formData.formFieldsData.password)) {
                vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.COMPAREPASSWORD');
            } else {
                if (vm.formData.formFieldsData.password != vm.formData.confirmPassword) {
                    vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.COMPAREPASSWORD');
                }

                else {
                    vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_VALID;
                    vm.formData.confirmPasswordFormat.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }

        // Function to validate phone
        vm.validatePhone = function () {

            //Variable to set field status and message.
            const phone = vm.formData.formFieldsData.phone;

            if (vm.parent.isEmpty(phone)) {
                vm.formData.phoneFormat.status = vm.parent.STATUS_INVALID;
                //vm.formData.passwordFormat.message = null;
                vm.formData.phoneFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PHONEREQUIRED');
            } else {
                if (phone.toString().length < 12) {
                    vm.formData.phoneFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.phoneFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PHONEINVALID');
                    return;
                } else if (phone.toString().length > 12) {
                    vm.formData.phoneFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.phoneFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PHONEINVALID');
                    return;
                } else if (!phone.match(/^\+(?:[0-9] ?){6,14}[0-9]$/)) {
                    vm.formData.phoneFormat.status = vm.parent.STATUS_INVALID;
                    vm.formData.phoneFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PHONEINVALID');
                    return;
                } else {
                    vm.formData.phoneFormat.status = vm.parent.STATUS_VALID;
                    vm.formData.phoneFormat.message = null;

                    if (vm.allStatusValid()) {
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
            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion1)) {
                vm.formData.securityQuestion1Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            } else {
                vm.formData.securityQuestion1Format.status = vm.parent.STATUS_VALID;
                vm.formData.securityQuestion1Format.message = null;

                // Trim the space in security answers
                if (vm.allStatusValid()) {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer1.
        vm.validateAnswer1 = function () {

            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer1)) {
                vm.formData.answer1Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            } else {
                if (vm.formData.formFieldsData.answer1 == vm.formData.formFieldsData.answer2 || vm.formData.formFieldsData.answer1 == vm.formData.formFieldsData.answer3) {
                    vm.formData.answer1Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                } else if (vm.formData.formFieldsData.answer1.length < 3) {
                    vm.formData.answer1Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                } else {
                    vm.formData.answer1Format.status = vm.parent.STATUS_VALID;
                    vm.formData.answer1Format.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }

        // Function to validate security question2.
        vm.validateSecurityQuestion2 = function () {

            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion2)) {
                vm.formData.securityQuestion2Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            } else {
                vm.formData.securityQuestion2Format.status = vm.parent.STATUS_VALID;
                vm.formData.securityQuestion2Format.message = null;

                if (vm.allStatusValid()) {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer2.
        vm.validateAnswer2 = function () {

            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer2)) {
                vm.formData.answer2Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            } else {
                if (vm.formData.formFieldsData.answer2 == vm.formData.formFieldsData.answer1 || vm.formData.formFieldsData.answer2 == vm.formData.formFieldsData.answer3) {
                    vm.formData.answer2Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                } else if (vm.formData.formFieldsData.answer2.length < 3) {
                    vm.formData.answer2Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                } else {
                    vm.formData.answer2Format.status = vm.parent.STATUS_VALID;
                    vm.formData.answer2Format.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }


        // Function to validate security question3.
        vm.validateSecurityQuestion3 = function () {
            vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion3)
            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion3)) {
                vm.formData.securityQuestion3Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');
            } else {
                vm.formData.securityQuestion3Format.status = vm.parent.STATUS_VALID;
                vm.formData.securityQuestion3Format.message = null;

                if (vm.allStatusValid()) {
                    // Display shared error message
                    vm.sharedErrorMessage = true;
                }
            }
        }

        // Function to validate answer3.
        vm.validateAnswer3 = function () {

            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer3)) {
                vm.formData.answer3Format.status = vm.parent.STATUS_INVALID,
                    vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');
            } else {
                if (vm.formData.formFieldsData.answer3 == vm.formData.formFieldsData.answer1 || vm.formData.formFieldsData.answer3 == vm.formData.formFieldsData.answer2) {
                    vm.formData.answer3Format.status = vm.parent.STATUS_INVALID,
                        vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.DUPLICATESECURITYANSWER');
                } else if (vm.formData.formFieldsData.answer3.length < 3) {
                    vm.formData.answer3Format.status = vm.parent.STATUS_INVALID;
                    vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYANSWERLENGTH');
                } else {
                    vm.formData.answer3Format.status = vm.parent.STATUS_VALID;
                    vm.formData.answer3Format.message = null;

                    if (vm.allStatusValid()) {
                        // Display shared error message
                        vm.sharedErrorMessage = true;
                    }
                }
            }
        }

        // Secure form onsubmit method
        vm.secureFormSubmit = function () {
            //Validate all fields as required fields
            if (vm.parent.isEmpty(vm.formData.formFieldsData.email)) {
                vm.formData.emailFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.emailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.EMAILREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.confirmEmail)) {
                vm.formData.confirmEmailFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.confirmEmailFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.CONFIRMEMAILREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.password)) {
                vm.formData.passwordFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.passwordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PASSWORDREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.confirmPassword)) {
                vm.formData.confirmPasswordFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.confirmPasswordFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.CONFIRMPASSWORDREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.phone)) {
                vm.formData.phoneFormat.status = vm.parent.STATUS_INVALID;
                vm.formData.phoneFormat.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.PHONEREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion1)) {
                vm.formData.securityQuestion1Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer1)) {
                vm.formData.answer1Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer1Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion2)) {
                vm.formData.securityQuestion2Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer2)) {
                vm.formData.answer2Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer2Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.securityQuestion3)) {
                vm.formData.securityQuestion3Format.status = vm.parent.STATUS_INVALID;
                vm.formData.securityQuestion3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.SECURITYQUESTIONREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.parent.isEmpty(vm.formData.formFieldsData.answer3)) {
                vm.formData.answer3Format.status = vm.parent.STATUS_INVALID;
                vm.formData.answer3Format.message = $filter('translate')('SECURE.FIELDERRORMESSAGES.ANSWERREQUIRED');

                // Display shared error message
                vm.sharedErrorMessage = false;
            }
            if (vm.allStatusValid()) {
                
                // Hide shared error message
                vm.sharedErrorMessage = true;

                vm.formData.formFieldsData.answer1 = vm.formData.formFieldsData.answer1.toUpperCase();
                vm.formData.formFieldsData.answer2 = vm.formData.formFieldsData.answer2.toUpperCase();
                vm.formData.formFieldsData.answer3 = vm.formData.formFieldsData.answer3.toUpperCase();

                // Call function ot language list
                vm.parent.languageListForPreference();
            }
        }
    };
})();
