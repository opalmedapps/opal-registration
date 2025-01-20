// SPDX-FileCopyrightText: Copyright 2020 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   header.component.js
     Description  :   Contains header.html page link, contorller name.
     Created by   :   Opal Health Informatics Group
     Date         :   June 2019
 **/
import headerTemplate from './header.html';

(function () {
    'use strict';

    angular
        .module('myApp')
        .component('headerComponent', {
            template: headerTemplate,
            controller: 'headerController',
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
