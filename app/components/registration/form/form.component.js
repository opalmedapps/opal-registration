// SPDX-FileCopyrightText: Copyright 2019 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
  Filename     :   form.component.js
  Description  :   Contains form.html page link and contorller name.
  Created by   :   Opal Health Informatics Group
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
