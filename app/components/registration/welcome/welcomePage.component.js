// SPDX-FileCopyrightText: Copyright (C) 2020 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
     Filename     :   welcomePage.component.js
     Description  :   Contains welcomePage.html page link, controller name and inherit parent form component to access variables in all parent and child forms.
     Created by   :   Jinal Vyas
     Date         :   Feb 2020
 **/
import headerTemplate from '../shared/header/header.html';
import welcomePageTemplate from './welcomePage.html';

(function () {
    'use strict';

    angular
        .module('myApp')
        .component('welcomePageComponent', {
            template: headerTemplate + welcomePageTemplate,
            controller: 'welcomePageController',
            controllerAs: 'vm'
        })
})();
