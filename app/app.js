// SPDX-FileCopyrightText: Copyright 2019 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
     Filename     :   app.js
     Description  :   Contains all app configurations, routes and translation.
     Created by   :   Opal Health Informatics Group
     Date         :   June 2019
 **/

// Dependencies
import angular from 'angular';
// See: https://docs.angularjs.org/api/ng/directive/ngCsp
import 'angular/angular-csp.css';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'angular-ui-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { initializeApp } from 'firebase/app';
import '@fortawesome/fontawesome-free/css/all.min.css'

// Project CSS
import '../css/components.css';
import '../css/directives.css';
import '../css/registration.css';

// Project JSON
import firebaseConfig from '../config.json';
import translationsEn from '../translate/en.json';
import translationsFr from '../translate/fr.json';

(function () {
    'use strict';

    angular.element(document).ready(function () {
        initializeApp(firebaseConfig);

        // Initialize angularjs app using bootstrapping
        angular.bootstrap(document, ['myApp']);
    });

    // Creating our angular app and inject required module
    var app = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'pascalprecht.translate'])

    // Configuring our states
    app.config(['$stateProvider', '$translateProvider', '$uiRouterProvider', '$urlRouterProvider',

        function ($stateProvider, $translateProvider, $uiRouterProvider, $urlRouterProvider) {

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
                    },
                    resolve: {
                        "preventReload": ["siteState", preventReload],
                    },
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
                    },
                    resolve: {
                        "preventReload": ["siteState", preventReload],
                    },
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
                    },
                    resolve: {
                        "preventReload": ["siteState", preventReload],
                    },
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
                    },
                    resolve: {
                        "preventReload": ["siteState", preventReload],
                    },
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
                    },
                    resolve: {
                        "preventReload": ["siteState", preventReload],
                    },
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
                    },
                    resolve: {
                        "preventReload": ["siteState", preventReload],
                    },
                })

                // Terms of usage agreement document page.
                .state('form.agreement', {
                    url: '/termsofUsageAgreement',
                    views: {
                        header: header,
                        content: {
                            component: 'agreementComponent'
                        },
                        footer: footer
                    },
                    resolve: {
                        "preventReload": ["siteState", preventReload],
                    },
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
                    },
                    resolve: {
                        "preventReload": ["siteState", preventReload],
                    },
                })

            /**
             * @description Defines a function to handle state change errors (when a Transition fails).
             *              In particular, we use this function to catch errors thrown by the "resolve" clauses in the
             *              states defined above to redirect the user to the init page.
             * @author Opal Health Informatics Group
             * @date 2024-06-14
             */
            $uiRouterProvider.stateService.defaultErrorHandler(err => {
                // RELOAD_REDIRECT is thrown by preventReload()
                if (err.detail === "RELOAD_REDIRECT") {
                    console.warn("Reload triggered, causing live data to be cleared; redirecting to the init page", err);
                    $uiRouterProvider.stateService.go('form.search');
                }
                else console.error("Transition Rejection", err);
            });

            /**
             * @description Prevents reloading of certain routes by ensuring that the site's state is intact before
             *              allowing them to be resolved. This is done to prevent users from viewing
             *              empty (broken) pages within the site after a reload.
             *              If a reload has been detected, the site is redirected to the init route (see defaultErrorHandler above).
             * @author Opal Health Informatics Group
             * @date 2024-06-14
             * @param siteState Injection of the siteState service.
             * @returns {Promise<void|string>} Resolves if the site's state is intact, or rejects with
             *                                 an error ("RELOAD_REDIRECT") if the site has been reloaded,
             *                                 to trigger a redirect.
             */
            function preventReload(siteState) {
                /* The siteState service contains a variable that is set to true when the site is initialized.
                 * If the site has been reloaded, it will lose this variable (and its value will become false), indicating
                 * that we should redirect to the init page. */
                return siteState.isInitialized() ? Promise.resolve() : Promise.reject("RELOAD_REDIRECT");
            }
        }
    ]);
})();
