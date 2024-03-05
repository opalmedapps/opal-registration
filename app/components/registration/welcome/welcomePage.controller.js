
/**
     Filename     :   welcomePage.controller.js
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('welcomePageController', welcomePageController);

    welcomePageController.$inject = ['$translate'];

    function welcomePageController($translate) {
        var vm = this;

        // Change language function.
        vm.changeLanguage = function (language) {
            vm.lan_key = (language.slice(0, 2)).toLowerCase();

            // If lan_key has fr (french) value, switch to French
            if (vm.lan_key === 'fr') {
                $translate.use(vm.lan_key);
            }

            // If lan_key has en (english) value, switch to english
            if (vm.lan_key === 'en') {
                $translate.use(vm.lan_key);
            }
        };
    }
})();


