// SPDX-FileCopyrightText: Copyright 2019 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   footer.component.js
     Description  :   Contains footer.html page link, contorller name.
     Date         :   June 2019
 **/
import footerTemplate from './footer.html';

(function () {
    'use strict';

    angular
        .module('myApp')
        .component('footerComponent', {
            template: footerTemplate,
            controller: 'footerController',
            controllerAs: 'vm'
        })
})();
