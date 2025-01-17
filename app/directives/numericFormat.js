// SPDX-FileCopyrightText: Copyright 2023 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

angular.module("myApp").directive("numericFormat", numericFormat);

/**
 * This directive offers a numeric format directive.
 */
function numericFormat() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$parsers.push(function(value){
                return ctrl.$viewValue;
            });
        }
    };
}