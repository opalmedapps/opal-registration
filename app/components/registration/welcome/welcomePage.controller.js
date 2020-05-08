
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

    welcomePageController.$inject = ['$translate', '$rootScope'];

    function welcomePageController($translate, $rootScope) {
        var vm = this;
       
        // Default opal logo in header.
        vm.opalLogo = 'images/logos/navbar-logo.png';
        
        // Change language function.
        vm.changeLanguage = function (language) {
            debugger;
            // Slice first two charcters and convert it into lowercase.
            vm.lan_key = (language.slice(0, 2)).toLowerCase();

            // If lan_key has fr(french) value, website will converts its language in to french. 
            if (vm.lan_key == 'fr') {
                // vm.opalLogo = 'images/logos/navbar-logo-fr.png';
                $translate.use(vm.lan_key);
            }

            // If lan_key has en(english) value, website will converts its language in to english. This is default the language.
            if (vm.lan_key == 'en') {
                //vm.opalLogo = 'images/logos/navbar-logo.png';
                $translate.use(vm.lan_key);
            }
        };
    }
})();


