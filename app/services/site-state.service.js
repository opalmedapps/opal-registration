// SPDX-FileCopyrightText: Copyright (C) 2024 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * @description Service that helps manage the general state of the site, for example by taking actions when the state changes.
 * @date 2024-06-14
 */
(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('siteState', siteState);

    siteState.$inject = [];

    function siteState() {
        /**
         * @description Keeps track of whether the site has been initialized (set to true).
         *              Afterwards, if this variable is detected to be false, then data has been lost due to a reload.
         *              In this case, redirect to the init screen (see app.js for details).
         * @type {boolean}
         */
        let siteInitialized = false;

        let service = {
            isInitialized: () => siteInitialized,
            setInitialized: value => siteInitialized = value,
        };

        return service;
    }
})();
