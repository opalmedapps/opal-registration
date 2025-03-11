angular.module("myApp").directive("tooltip", function () {
    console.log("tooltip directive");
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('mouseenter', function () {
                element.tooltip('show');
            });
            element.on('mouseleave', function () {
                element.tooltip('hide');
            });
        }
    };
});