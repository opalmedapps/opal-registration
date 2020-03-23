/**
     Filename     :   footer.component.js
     Description  :   Contains footer.html page link, contorller name.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';

    angular
        .module('myApp')
        .component('footerComponent', {
            templateUrl: 'app/components/registration/shared/footer/footer.html',
            controller: 'footerController',
            controllerAs: 'vm'
        })
})();