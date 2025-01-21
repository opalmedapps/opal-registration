// SPDX-FileCopyrightText: Copyright 2025 Opal Health Informatics Group <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import '../../css/directives/password-input.directive.css';

(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('passwordInput', PasswordInput);

    /**
     * @date 2022-02-02
     * @description Directive to wrap password input and handle view password functionality
     */
    function PasswordInput() {
        return {
            restrict: 'E',
            scope: {
                // Function which dynamically sets the eye icon's style. Can be used to change its position based on the visibility of other elements.
                eyeIconNgStyle: '=',
            },
            transclude: true,
            template: `
                <div class="password-input--wrapper style-4">
                    <!-- Password field -->
                    <div class="input-slot" ng-transclude></div>
                    <!-- Eye icon which controls the visibility of the password -->
                    <i class={{iconClass}} ng-style="eyeIconNgStyle()" ng-click="switchInputType($event)" role="button" aria-label="{{'FORM.BUTTONS.SHOW_PASSWORD' | translate}}"></i>
                </div>
            `,
            link: function (scope) {
                scope.isVisible = false;
                scope.iconClass = 'fas fa-eye';
                scope.switchInputType = (event) => {
                    scope.isVisible = !scope.isVisible;
                    scope.iconClass = scope.isVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
                    event.target.parentNode.querySelector('input').type = scope.isVisible ? 'text' : 'password';
                }
            }
        };
    }
})();
