// SPDX-FileCopyrightText: Copyright (C) 2019 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/*
 * Filename     :   agreement.component.js
 * Description  :   Contains agreement.html page link, contorller name and inherit parent form component to access variables in all parent and child forms.
 * Date         :   June 2019
 */
import agreementTemplate from './agreement.html';

(function () {
    'use strict';

    angular
        .module('myApp')
        .component('agreementComponent', {
            template: agreementTemplate,
            controller: 'agreementController',
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
