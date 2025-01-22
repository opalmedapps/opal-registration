// SPDX-FileCopyrightText: Copyright (C) 2024 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
