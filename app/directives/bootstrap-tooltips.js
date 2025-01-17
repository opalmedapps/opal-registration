// SPDX-FileCopyrightText: Copyright 2024 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

// Inspired by:
// https://stackoverflow.com/questions/20666900/using-bootstrap-tooltip-with-angularjs

angular.module("myApp").directive("tooltip", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // Using element.tooltip() does not work properly: Translations will not be applied.
            element.on('mouseenter', function () {
                element.tooltip('show');
            });
            element.on('mouseleave', function () {
                element.tooltip('hide');
            });
        }
    };
});
