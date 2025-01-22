// SPDX-FileCopyrightText: Copyright (C) 2019 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
     Filename     :   welcomePage.controller.js
     Date         :   June 2019
 **/
import logoEn from '../../../../images/logos/navbar-logo-en.png';
import logoFr from '../../../../images/logos/navbar-logo-fr.png';

(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('welcomePageController', welcomePageController);

    welcomePageController.$inject = ['$rootScope', '$translate'];

    function welcomePageController($rootScope, $translate) {
        var vm = this;

        vm.logoEn = logoEn;
        vm.logoFr = logoFr;

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

            $rootScope.$broadcast("changeLanguage");
        };
    }
})();
