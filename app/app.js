/**
     Filename     :   app.js
     Description  :   Contains all app configurations, routes and translation.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

import angular from 'angular';
// See: https://docs.angularjs.org/api/ng/directive/ngCsp
import 'angular/angular-csp.css';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'angular-ui-router';
import 'angularfire';
import 'angularjs-datepicker';
import 'angularjs-datepicker/dist/angular-datepicker.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import firebase from 'firebase';
import '@fortawesome/fontawesome-free/css/all.min.css'

// TODO https://webpack.js.org/plugins/mini-css-extract-plugin/#minimizing-for-production
import '../css/registration.css';

import translationsEn from '../translate/en.json';
import translationsFr from '../translate/fr.json';

(function () {
    'use strict';

    angular.element(document).ready(function () {
        // Initialize the Firebase app
        let configPath = '../config.json';
        fetch(configPath).then(response => {
            if (response.status !== 200) {
                console.error(`Failed to load Firebase connection file: ${configPath}`);
                return Promise.reject(response);
            }
            return response.text();
        }).then((firebaseConfig) => {
            firebase.initializeApp(JSON.parse(firebaseConfig));

            // Initialize angularjs app using bootstrapping
            angular.bootstrap(document, ['myApp']);
        });
    });

    // Creating our angular app and inject required module
    var app = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'pascalprecht.translate', '720kb.datepicker', 'firebase'])

    // Configuring our states
    app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider',

        function ($stateProvider, $urlRouterProvider, $translateProvider) {

            $translateProvider.translations('en', translationsEn);
            $translateProvider.translations('fr', translationsFr);

            //Check browser default language and base on that assign value to preferred and fallback Language.
            var lang = window.navigator.language || window.navigator.userLanguage;
            var defaultLanguage = lang.split("-")[0];

            // Default language
            $translateProvider.preferredLanguage(defaultLanguage);

            // Fallback language if entry is not found in current language
            $translateProvider.fallbackLanguage('fr');

            /* Header and Footer is shared to all pages. */

            // This variable is used to bind header.html and assigning it's controller.
            var header = {
                component: 'headerComponent'
            }

            // This variable is used to bind footer.html and assigning it's controller.
            var footer = {
                component: 'footerComponent'
            }


            // For any unmatched url, redirect to search page
            $urlRouterProvider.otherwise('/form/search');


            $stateProvider

                // Welcome page.
                .state('welcomePage', {
                    url: '/welcomePage',
                    views: {
                        content: {
                            component: 'welcomePageComponent'
                        }
                    }
                })

                // PARENT STATE: form state
                .state('form', {
                    abstract: true,
                    url: '/form',
                    views: {
                        content: {
                            component: 'formComponent'
                        }
                    }
                })

                // NESTED STATES: child states of 'form' state

                // User search page.
                .state('form.search', {
                    url: '/search',
                    views: {
                        header: header,
                        content: {
                            component: 'searchComponent'
                        },
                        footer: footer
                    }
                })

                // User account page.
                .state('form.account', {
                    url: '/account',
                    views: {
                        header: header,
                        content: {
                            component: 'accountComponent'
                        },
                        footer: footer
                    }
                })

                // User account login page.
                .state('form.login', {
                    url: '/login',
                    views: {
                        header: header,
                        content: {
                            component: 'loginComponent'
                        },
                        footer: footer
                    }
                })

                // User account questions page.
                .state('form.questions', {
                    url: '/questions',
                    views: {
                        header: header,
                        content: {
                            component: 'questionsComponent'
                        },
                        footer: footer
                    }
                })

                // User account verification page.
                .state('form.verification', {
                    url: '/verification',
                    views: {
                        header: header,
                        content: {
                            component: 'verificationComponent'
                        },
                        footer: footer
                    }
                })

                // User secure information page.
                .state('form.secure', {
                    url: '/secureInformation',
                    views: {
                        header: header,
                        content: {
                            component: 'secureComponent'
                        },
                        footer: footer
                    }
                })

                // User opal preference page.
                .state('form.preference', {
                    url: '/opalPreference',
                    views: {
                        header: header,
                        content: {
                            component: 'preferenceComponent'
                        },
                        footer: footer
                    }
                })

                // Terms of usage aggrement document page.
                .state('form.agreement', {
                    url: '/termsofUsageAgreement',
                    views: {
                        header: header,
                        content: {
                            component: 'agreementComponent'
                        },
                        footer: footer
                    }
                })

                // Registration successful page.
                .state('form.successful', {
                    url: '/registrationSuccessful',
                    views: {
                        header: header,
                        content: {
                            component: 'successfulComponent'
                        },
                        footer: footer
                    }
                })
        }
    ]);

})();
