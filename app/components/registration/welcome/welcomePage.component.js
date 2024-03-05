/**
     Filename     :   welcomePage.component.js
     Description  :   Contains welcomePage.html page link, contorller name and inherit parent form component to access variables in all parent and child forms.
     Created by   :   Jinal Vyas
     Date         :   Feb 2020
 **/
import welcomePageTemplate from './welcomePage.html';

(function () {
    'use strict';

    angular
        .module('myApp')
        .component('welcomePageComponent', {
            template: welcomePageTemplate,
            controller: 'welcomePageController',
            controllerAs: 'vm'
        })
})();
