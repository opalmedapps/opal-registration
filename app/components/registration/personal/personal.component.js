(function () {
    'use strict';
 
    angular
        .module('myApp')
        .component('personalComponent', {
            templateUrl: 'app/components/registration/personal/personal.html',
            controller: 'personalController',
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