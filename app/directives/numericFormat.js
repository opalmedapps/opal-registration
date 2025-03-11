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