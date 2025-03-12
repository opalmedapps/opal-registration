// SPDX-FileCopyrightText: Copyright (C) 2022 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

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
            /** Timeouts **/
            LEGACY_REQUEST_TIMEOUT: 30000,
            API_REQUEST_TIMEOUT: 30000,

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
                }
            },
        });
})();
