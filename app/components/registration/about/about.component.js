// SPDX-FileCopyrightText: Copyright (C) 2025 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
     Filename     :   about.component.js
     Description  :   Contains about.html page link, controller name and inherit parent form component to access variables in all parent and child forms.
 **/
import headerTemplate from '../shared/header/header.html';
import aboutPageTemplate from './about.html';

(function () {
    'use strict';

    angular
        .module('myApp')
        .component('aboutComponent', {
            template: headerTemplate + aboutPageTemplate,
            controller: 'aboutController',
            controllerAs: 'vm'
        })
})();
