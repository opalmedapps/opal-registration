(function () {
    'use strict';

    /**
     * @description Constants used to make requests to the listener going through the new backend and define available routes.
     * @author David Gagne
     * @date 2022-06-10
     */
    angular
        .module("myApp")
        .constant("apiConstants", {
            /** Response codes **/
            SUCCESS: '200',
            /** Headers for new api request */
            REQUEST_HEADERS: {
                'Content-Type': 'application/json',
                'Accept-Language': 'fr',
            },
            /** Django backend available routes. */
            ROUTES: {
                HASH: {
                    method: 'get',
                    url: '/api/registration/by-hash/',
                },
                LANGUAGES: {
                    method: 'get',
                    url: '/api/languages/',
                },
                QUESTIONS: {
                    method: 'get',
                    url: '/api/security-questions/',
                },
                TERMS_OF_USE: {
                    method: 'get',
                    url: '/api/institutions/1/terms-of-use/',
                }
            }
        });
})();
