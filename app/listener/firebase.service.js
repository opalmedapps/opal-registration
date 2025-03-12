// SPDX-FileCopyrightText: Copyright (C) 2024 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
 * @author Various; refactored by Stacey Beard in March 2024.
 * @description Service providing access to the Firebase Realtime Database.
 */
import { getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { child, getDatabase, off, onValue, push, ref, serverTimestamp, set } from "firebase/database";

import firebaseBranchConfig from '../../firebaseBranch.json';

(function() {
    'use strict';

    angular
        .module('myApp')
        .factory('firebase', firebase);

    firebase.$inject = [];

    function firebase() {
        const app = getApp();
        const auth = getAuth(app);
        const database = getDatabase(app);

        let firebaseDBRef = ref(database, firebaseBranchConfig.devBranch);

        return {
            // Custom functions
            getApiParentBranch: () => firebaseBranchConfig.apiParentBranch,
            getApiPath: hospitalCode => getBasePath(hospitalCode, firebaseBranchConfig.apiParentBranch),
            getDBRef: getDBRef,
            getLegacyPath: hospitalCode => getBasePath(hospitalCode, firebaseBranchConfig.parentBranch),
            getResponseChildBranch: () => firebaseBranchConfig.responseChildBranch,

            // Direct access to Auth functions (where the auth parameter is managed by this service)
            signInWithEmailAndPassword: (email, password) => signInWithEmailAndPassword(auth, email, password),
            signOut: () => signOut(auth),

            // Direct access to other built-in Firebase functions
            child: child,
            off: off,
            onValue: onValue,
            push: push,
            serverTimestamp: serverTimestamp,
            set: set,
        };

        /**
         * @description Returns the path in Firebase under which all requests of a certain type are handled (legacy or API).
         * @param {string} hospitalCode The hospital's unique code, which forms part of the path.
         * @param {string} requestTypePath Part of the path which is specific to legacy or API requests, taken from the Firebase branch config file.
         * @returns {string}
         */
        function getBasePath(hospitalCode, requestTypePath) {
            return `/${hospitalCode}/${requestTypePath}/`;
        }

        function getDBRef(childRef) {
            return childRef ? child(firebaseDBRef, childRef) : firebaseDBRef;
        }
    }
})();
