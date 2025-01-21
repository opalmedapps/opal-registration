// SPDX-FileCopyrightText: Copyright 2023 Opal Health Informatics Group <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
