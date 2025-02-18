// SPDX-FileCopyrightText: Copyright (C) 2019 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
     Filename     :   preference.component.js
     Description  :   Contains perference.html page link, controller name and inherit parent form component to access variables in all parent and child forms.
     Created by   :   Jinal Vyas
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
