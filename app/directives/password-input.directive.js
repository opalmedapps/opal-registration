import '../../css/directives/password-input.directive.css';

(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('passwordInput', PasswordInput);

    /**
     * @author David Gagne; modified by Stacey Beard
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
                    <div class="password-input--icon" ng-style="eyeIconNgStyle()" ng-click="switchInputType($event)" role="button" aria-label="{{'FORM.BUTTONS.SHOW_PASSWORD' | translate}}">
                        <i class="fas fa-fw fa-eye"></i>
                    </div>
                </div>
            `,
            link: function (scope) {
                scope.isVisible = false;
                scope.switchInputType = (event) => {
                    scope.isVisible = !scope.isVisible;
                    // See "Changing Icons by Changing Classes": https://docs.fontawesome.com/web/use-with/jquery
                    $(event.currentTarget).find('[data-fa-i2svg]').toggleClass(['fa-eye', 'fa-eye-slash']);
                    event.currentTarget.parentNode.querySelector('input').type = scope.isVisible ? 'text' : 'password';
                }
            }
        };
    }
})();
