/**
     Filename     :   successful.component.js
     Description  :   Contains successful.html page link, contorller name and inherit parent form component to access variables in all parent and child forms.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';
 
    angular
        .module('myApp')
        .component('successfulComponent', {
            templateUrl: 'app/components/registration/successful/successful.html',
            controller: 'successfulController',
            controllerAs: 'vm',
            require: {
                // access to the functionality of the parent component called 'formComponent'
                parent: '^formComponent'
            },
            bindings: {
                // send a changeset of 'formData' upwards to the parent component called 'formComponent'
                formData: '<'
            }
        })
})();