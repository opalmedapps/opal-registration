/**
     Filename     :   app.module.js
     Description  :   Contains all app configurations, routes and translation.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';
    
    angular.element(document).ready(function () {
        
        fetch("./php/config.json").then((response) => {
            return response.text()
        }).then((data) => {
            
            // Before calling firebase function It's compulsory to intializeapp with config.json file.
            firebase.initializeApp(JSON.parse(data));

            // Intialize angularjs app using bootstraping
            angular.bootstrap(document, ['myApp']);
            
        });
    });

    // Creating our angular app and inject required module
    var app = angular.module('myApp', ['ui.router', 'ui.bootstrap', '720kb.tooltips', 'pascalprecht.translate', '720kb.datepicker', 'firebase'])

    // Configuring our states 
    app.config(['$stateProvider', '$urlRouterProvider', '$translateProvider',

        function ($stateProvider, $urlRouterProvider, $translateProvider) {
            
            // Load language entries from json files
            $translateProvider.useStaticFilesLoader({
                prefix: 'translate/',     //relative path of json file
                suffix: '.json'            //file extension
            });

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
                

            // Patient registration page. Backup for the routing different method.
            //.state('form.registration', {
            //    //parent: 'form',
            //    url: '/registration',
            //    views: {
            //        content: {
            //            templateUrl: 'app/components/registration/registration/registration.html',
            //            controller: 'registrationController',
            //            controllerAs: 'vm'
            //        }
            //    }
            //})
        }
    ]);

})();
