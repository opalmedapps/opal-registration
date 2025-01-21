// SPDX-FileCopyrightText: Copyright 2022 Opal Health Informatics Group <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import patientInfoTemplate from '../views/patient-info.html';

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
        template: patientInfoTemplate,
    };
}
