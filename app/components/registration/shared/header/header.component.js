// SPDX-FileCopyrightText: Copyright (C) 2019 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
     Filename     :   header.component.js
     Description  :   Contains header.html page link, controller name.
     Created by   :   Jinal Vyas
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
