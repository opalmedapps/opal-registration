// SPDX-FileCopyrightText: Copyright (C) 2022 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
     Filename     :   acount.component.js
     Description  :   Contains account.html page link, contorller name and inherit parent form component to access variables in all parent and child forms.
     Date         :   2022-04-07
**/
import accountTemplate from './account.html';
import loginTemplate from './login/login.html';
import questionsTemplate from './questions/questions.html';
import verificationTemplate from './verification/verification.html';

(function () {
    'use strict';

    angular
        .module('myApp')
        .component('accountComponent', {
            template: accountTemplate,
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
            template: loginTemplate,
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
            template: questionsTemplate,
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
            template: verificationTemplate,
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
