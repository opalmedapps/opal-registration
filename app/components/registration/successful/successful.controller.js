/**
     Filename     :   successful.controller.js
     Description  :   Controlle the successful.html data(modal values, event, etc.) and to function to make service call.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';
    angular.module('myApp')

        .controller('successfulController', successfulController);

    successfulController.$inject = [];

    function successfulController() {
        var vm = this;

        // Create variable formData to store the values of parent data.
        vm.formData = {};

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
    }
})();