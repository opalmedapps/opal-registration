// SPDX-FileCopyrightText: Copyright 2024 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

/**
 * @description Service that helps manage the general state of the site, for example by taking actions when the state changes.
 * @author Stacey Beard
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
