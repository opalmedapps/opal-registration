import '../../css/directives/password-input.directive.css';

(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('passwordInput', PasswordInput);

    /**
     * @author David Gagne
     * @date 2022-02-02
     * @description Directive to wrap password input and handle view password functionality
     */
    function PasswordInput() {
        return {
            restrict: 'E',
            scope: true,
            transclude: true,
            template: `
                <div class="password-input--wrapper style-4">
                    <div class="input-slot" ng-transclude></div>
                    <i class={{iconClass}} ng-click="switchInputType($event)" role="button" aria-label="{{'FORM.BUTTONS.SHOW_PASSWORD' | translate}}"></i>
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
