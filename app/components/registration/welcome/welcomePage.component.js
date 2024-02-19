/**
     Filename     :   welcomePage.component.js
     Description  :   Contains welcomePage.html page link, contorller name and inherit parent form component to access variables in all parent and child forms.
     Created by   :   Jinal Vyas
     Date         :   Feb 2020
 **/

(function () {
    'use strict';
 
    angular
        .module('myApp')
        .component('welcomePageComponent', {
            templateUrl: 'app/components/registration/welcome/welcomePage.html',
            controller: 'welcomePageController',
            controllerAs: 'vm'
        })
})();