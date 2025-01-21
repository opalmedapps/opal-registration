// SPDX-FileCopyrightText: Copyright 2019 Opal Health Informatics Group <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
  Filename     :   form.component.js
  Description  :   Contains form.html page link and contorller name.
  Date         :   June 2019
 **/
import formTemplate from './form.html';

(function () {
    'use strict';

    angular
        .module('myApp')
        .component('formComponent', {
            template: formTemplate,
            controller: 'formController',
            controllerAs: 'vm'
        })
})();
