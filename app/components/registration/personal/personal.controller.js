
/**************************************
	* Personal Page controller
***************************************/

(function () {
    'use strict';
    angular.module('myApp')
        // Creating directive and filter to  formating contact number
        .directive('contactInput', function ($filter, $browser) {

            return {
                require: 'ngModel',
                link: function ($scope, $element, $attrs, ngModelCtrl) {
                    var listener = function () {

                        var value = $element.val().replace(/[^0-9]/g, '');
                        $element.val($filter('contactNumber')(value, false));
                    };

                    // This runs when we update the text field
                    ngModelCtrl.$parsers.push(function (viewValue) {

                        var convertString = viewValue.toString();
                        var returnString = convertString.replace(/[^0-9]/g, '').slice(0, 10);
                        return returnString;
                    });

                    // This runs when the model gets updated on the scope directly and keeps our view in sync
                    ngModelCtrl.$render = function () {
                        $element.val($filter('contactNumber')(ngModelCtrl.$viewValue, false));
                    };

                    $element.bind('change', listener);
                    $element.bind('keydown', function (event) {
                        var key = event.keyCode;
                        // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                        // This lets us support copy and paste too
                        if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                            return;
                        }
                        $browser.defer(listener); // Have to do this or changes don't get picked up properly
                    });

                    $element.bind('paste cut', function () {
                        $browser.defer(listener);
                    });
                }

            };
        })

        .filter('contactNumber', function () {
            return function (contactNumber) {

                if (!contactNumber) { return ''; }

                var value = contactNumber.toString().trim().replace(/^\+/, '');

                if (value.match(/[^0-9]/)) {
                    return contactNumber;
                }

                var country, city, number;

                switch (value.length) {
                    case 1:
                    case 2:
                    case 3:
                        city = value;
                        break;

                    default:
                        city = value.slice(0, 3);
                        number = value.slice(3);
                }

                if (number) {
                    if (number.length > 3) {
                        number = number.slice(0, 3) + '-' + number.slice(3, 7);
                    }
                    else {
                        number = number;
                    }

                    return ("(" + city + ") " + number).trim();
                }
                else {
                    return "(" + city;
                }

            };
        })

        .controller('personalController', personalController);

    personalController.$inject = ['$location'];

    function personalController($location) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        // Call function on page load to fetch the data.
        vm.$onInit = activate;
        function activate() {
            debugger;
            // get data from the parent component
            vm.formData = vm.parent.getData();
            console.log(vm.formData);
        }


        //Variable to set field status and message.
        vm.firstNameFormat = { status: null, message: null };
        vm.lastNameFormat = { status: null, message: null };
        vm.dateofBirthFormat = { status: null, message: null };
        vm.contactNumberFormat = { status: null, message: null };

        // Form onsubmit method
        vm.personalFormSubmit = function (personalForm) {
            debugger;

            //Validate all fields as required fields
            if (personalForm.firstName == undefined) {
                vm.firstNameFormat.status = 'invalid',
                    vm.firstNameFormat.message = 'Please enter your first name.'
            }
            if (personalForm.lastName == undefined) {
                vm.lastNameFormat.status = 'invalid',
                    vm.lastNameFormat.message = 'Please enter your last name.'
            }
            if (personalForm.dateofBirth == undefined) {
                vm.dateofBirthFormat.status = 'invalid',
                    vm.dateofBirthFormat.message = 'Please enter your date of birth.'
            }
            if (personalForm.contactNumber == undefined) {
                vm.contactNumberFormat.status = 'invalid',
                    vm.contactNumberFormat.message = 'Please enter your contact number.'
            }
            if (personalForm.$invalid == false) {
                $location.path('/form/registration');
            }
        }

        // Validate to first name field with text only.
        vm.validateFirstName = function (firstName) {
            debugger;
            if (firstName == undefined) {
                vm.firstNameFormat.status = 'invalid',
                    vm.firstNameFormat.message = 'Please Enter Your Date of Birth Number.'

            }
            else {
                vm.firstNameFormat.status = 'valid',
                    vm.firstNameFormat.message = null
            }
        };

        // Validate to last name field with text only.
        vm.validateLastName = function (lastName) {

            if (lastName == undefined) {
                vm.lastNameFormat.status = 'invalid',
                    vm.lastNameFormat.message = 'Please Enter Your Date of Birth Number.'

            }
            else {
                vm.lastNameFormat.status = 'valid',
                    vm.lastNameFormat.message = null
            }
        };

        // Function to validate contact number
        vm.validateContactNumber = function (contactNumber) {

            if (contactNumber == undefined) {
                vm.contactNumberFormat.status = 'invalid',
                    vm.contactNumberFormat.message = null
            }
            else {
                if (contactNumber.length < 2 || contactNumber.length < 10) {
                    vm.contactNumberFormat.status = 'invalid';
                    vm.contactNumberFormat.message = 'Contact number is inappropriate.';
                    return;
                }
                else {
                    vm.contactNumberFormat.status = 'valid';
                    vm.contactNumberFormat.message = null;
                }
            }
        };

        // Validate to date of birth format.
        vm.validatedateofBirth = function (dateofBirth) {

            if (dateofBirth == undefined) {
                vm.dateofBirthFormat.status = 'invalid',
                    vm.dateofBirthFormat.message = 'Please Enter Your Date of Birth Number.'

            }
            else {
                vm.dateofBirthFormat.status = 'valid',
                    vm.dateofBirthFormat.message = null
            }
        };
    };



})();