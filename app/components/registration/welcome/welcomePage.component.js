// SPDX-FileCopyrightText: Copyright 2020 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   welcomePage.component.js
     Description  :   Contains welcomePage.html page link, contorller name and inherit parent form component to access variables in all parent and child forms.
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
