// SPDX-FileCopyrightText: Copyright 2019 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   preference.component.js
     Description  :   Contains perference.html page link, contorller name and inherit parent form component to access variables in all parent and child forms.
     Date         :   June 2019
 **/
import preferenceTemplate from './preference.html';

(function () {
    'use strict';

    angular
        .module('myApp')
        .component('preferenceComponent', {
            template: preferenceTemplate,
            controller: 'preferenceController',
            controllerAs: 'vm',
            require: {
                // access to the functionality of the parent component called 'formComponent'
                parent: '^formComponent'
            },
            bindings: {
                // send a changeset of 'formData' upwards to the parent component called 'formComponent'
                formData: '<'
            }
        })
})();
