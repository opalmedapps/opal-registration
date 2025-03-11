angular.module("myApp").directive("patientInfo", patientInfo);

/**
 * This directive offers a patient info directive.
 */
function patientInfo() {
    return {
        restrict: 'E',
        scope: {
            formData: "=",
        },
        templateUrl:'app/views/patient-info.html',
    };
}