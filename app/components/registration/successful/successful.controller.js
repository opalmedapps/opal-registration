// SPDX-FileCopyrightText: Copyright 2019 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   successful.controller.js
     Description  :   Controlle the successful.html data(modal values, event, etc.) and to function to make service call.
     Date         :   June 2019
 **/
import appStoreLogoEn from "../../../../images/logos/AppStore_EN.svg";
import appStoreLogoFr from "../../../../images/logos/AppStore_FR.svg";
import playStoreLogoEn from "../../../../images/logos/PlayStore_EN.png";
import playStoreLogoFr from "../../../../images/logos/PlayStore_FR.png";

(function () {
    'use strict';
    angular.module('myApp')

        .controller('successfulController', successfulController);

    successfulController.$inject = ['$location'];

    function successfulController($location) {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

        vm.appStoreLogoEn = appStoreLogoEn;
        vm.appStoreLogoFr = appStoreLogoFr;
        vm.playStoreLogoEn = playStoreLogoEn;
        vm.playStoreLogoFr = playStoreLogoFr;

        vm.backToHome = backToHome;

        // Call function on page load to fetch the data.
        vm.$onInit = activate;
        function activate() {

            // get data from the parent component
            vm.formData = vm.parent.getData();

            // Call function to set current form class as active.
            vm.setFormStatus();
        }

        // Method to to set current form class as active.
        vm.setFormStatus = function () {
            vm.formData.searchForm = "";
            vm.formData.secureForm.status = "";
            vm.formData.secureForm.flag = 1;
            vm.formData.preferenceForm.status = "";
            vm.formData.preferenceForm.flag = 1;
            vm.formData.agreementForm.status = "";
            vm.formData.agreementForm.flag = 1;
            vm.formData.successForm.status = "active";
            vm.formData.successForm.flag = 1;
        }

        /**
         * @description Sends the user back to the first page of the site, and clears live data by reloading the page.
         */
        function backToHome() {
            // Reload the page to clear all data from the currently finished registration
            location.reload();
            $location.path('/');
        }
    }
})();
