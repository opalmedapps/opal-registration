/**
     Filename     :   footer.component.js
     Description  :   Contains footer.html page link, contorller name.
     Created by   :   Jinal Vyas
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
