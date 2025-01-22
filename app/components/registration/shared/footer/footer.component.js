// SPDX-FileCopyrightText: Copyright (C) 2019 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
