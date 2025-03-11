/**
     Filename     :   acount.component.js
     Description  :   Contains account.html page link, contorller name and inherit parent form component to access variables in all parent and child forms.
     Created by   :   LL
     Date         :   2022-04-07
**/

(function () {
    'use strict';
 
    angular
        .module('myApp')
        .component('accountComponent', {
            templateUrl: 'app/components/registration/account/account.html',
            controller: 'accountController',
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
        .component('loginComponent', {
            templateUrl: 'app/components/registration/account/login/login.html',
            controller: 'loginController',
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
        .component('questionsComponent', {
            templateUrl: 'app/components/registration/account/questions/questions.html',
            controller: 'questionsController',
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
        .component('verificationComponent', {
            templateUrl: 'app/components/registration/account/verification/verification.html',
            controller: 'verificationController',
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