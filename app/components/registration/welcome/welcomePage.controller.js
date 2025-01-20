// SPDX-FileCopyrightText: Copyright 2020 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   welcomePage.controller.js
     Created by   :   Opal Health Informatics Group
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
