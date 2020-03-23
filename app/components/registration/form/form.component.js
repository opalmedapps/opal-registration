/**
  Filename     :   form.component.js
  Description  :   Contains form.html page link and contorller name.
  Created by   :   Jinal Vyas
  Date         :   June 2019
 **/

(function () {
    'use strict';
 
    angular
        .module('myApp')
        .component('formComponent', {
            templateUrl: 'app/components/registration/form/form.html',
            controller: 'formController',
            controllerAs: 'vm'
        })
})();