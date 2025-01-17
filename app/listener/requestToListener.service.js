// SPDX-FileCopyrightText: Copyright 2020 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

(function () {
    'use strict';
    angular.module('myApp')
        .service('requestToListener', requestToListener);

    requestToListener.$inject = ['apiConstants', 'encryptionService', 'firebase', 'responseValidatorFactory', 'userAuthorizationService'];

    function requestToListener(apiConstants, encryptionService, firebase, responseValidatorFactory, userAuthorizationService) {

        return {
            sendRequestWithResponse: sendRequestWithResponse,
            apiRequest: apiRequest
        };

        /**
         * @description Sends a request to the listener via Firebase.
         * @param {string} typeOfRequest The type of request to send.
         * @param {object} [parameters] Optional object containing parameters to send with the request.
         * @returns {{key: string, ref: *}} An object containing the random reference key under which the request was uploaded,
         *                                  and the base database reference at which the request was pushed.
         */
        function sendRequest(typeOfRequest, parameters) {
            // Clone the request parameters to prevent re-encrypting when using them in several requests
            if (parameters) parameters = JSON.parse(JSON.stringify(parameters));

            // Prepare the Firebase database reference
            const hospitalCode = userAuthorizationService.getHospitalCode();
            const requestBranch = typeOfRequest === firebase.getApiParentBranch()
                ? firebase.getApiPath(hospitalCode)
                : firebase.getLegacyPath(hospitalCode);
            let baseRef = firebase.getDBRef(`${requestBranch}`);
            let requestRef = firebase.child(baseRef, 'requests');

            // Encrypt the request
            encryptionService.generateEncryptionHash();
            let encryptedType = encryptionService.encryptData(typeOfRequest);
            let encryptedParameters = encryptionService.encryptData(parameters);

            // Send the request
            let requestObject = getRequestObject(encryptedType, encryptedParameters);
            let pushID =  firebase.push(requestRef, requestObject);
            return {
                key: pushID.key,
                ref: baseRef,
            };
        }

        /**
         * @description Sends a request to the listener and resolves after receiving a response (or after a timeout).
         * @param {string} typeOfRequest The type of request to send.
         * @param {object} [parameters] Optional object containing parameters to send with the request.
         * @returns {Promise<object>} Resolves with the response from the listener, or rejects with an error.
         */
        function sendRequestWithResponse(typeOfRequest, parameters) {
            return new Promise((resolve, reject) => {
                // Send the request
                let responseRef;
                try {
                    const {key, ref} = sendRequest(typeOfRequest, parameters);

                    // Get a reference to the response branch
                    const baseResponseRef = firebase.child(ref, firebase.getResponseChildBranch());
                    responseRef = firebase.child(baseResponseRef, key);
                }
                catch (error) {
                    reject(error);
                    return;
                }

                // Wait for a response
                firebase.onValue(responseRef, snapshot => {
                    if (snapshot.exists()) {
                        let data = snapshot.val();
                        firebase.set(responseRef, null);
                        firebase.off(responseRef);
                        data = responseValidatorFactory.validate(data, timeOut);
                        data.success ? resolve(data.success) : reject(data.error);
                    }
                }, error => {
                    firebase.set(responseRef, null);
                    firebase.off(responseRef);
                    reject(error);
                });

                // If the request takes too long without a response, time out the request
                const timeOut = setTimeout(function() {
                    firebase.set(responseRef, null);
                    firebase.off(responseRef);
                    reject({ Response:'timeout' });
                }, apiConstants.LEGACY_REQUEST_TIMEOUT);
            });
        }

        /**
         * @description Call the new listener structure that relays the request to Django backend
         * @param {object} parameters Required fields to process request
         * @param {string} language Required field to request header, 'en' or 'fr'
         * @param {object | null} data that is needed to be passed to the request.
         * @returns Promise that contains the response data
         */
        function apiRequest(parameters, language, data = null) {
            return new Promise((resolve, reject) => {
                const formattedParams = formatParams(parameters, language, data);
                const requestType = firebase.getApiParentBranch();

                let responseRef;
                try {
                    const {key, ref} = sendRequest(requestType, formattedParams);
                    const firebasePath = `responses/${key}`;
                    responseRef = firebase.child(ref, firebasePath);
                }
                catch (error) {
                    reject(error);
                    return;
                }

                firebase.onValue(responseRef, snapshot => {
                    if (snapshot.exists()) {
                        let data = snapshot.val();
                        firebase.set(responseRef, null);
                        firebase.off(responseRef);
                        data = responseValidatorFactory.validateApiResponse(data, timeOut);
                        data.success ? resolve(data.success) : reject(data.error);
                    }
                }, error => {
                    firebase.set(responseRef, null);
                    firebase.off(responseRef);
                    reject(error);
                });

                // If the request takes too long without a response, time out the request
                const timeOut = setTimeout(function () {
                    firebase.set(responseRef, null);
                    firebase.off(responseRef);
                    reject({ Response: 'timeout' });
                }, apiConstants.API_REQUEST_TIMEOUT);
            });
        }

        function formatParams(parameters, language, data){
            if (data) parameters.data = data;
            return {
                ...parameters,
                headers: {...apiConstants.REQUEST_HEADERS, 'Accept-Language': language},
            }
        }

        /**
         * @description Assembles and returns a request object to be sent to the listener.
         * @param {string} requestType The type of request to send.
         * @param {object} [parameters] Optional object containing parameters to send with the request.
         * @returns {object} The formatted request object.
         */
        function getRequestObject(requestType, parameters) {
            return {
                'Request': requestType,
                'BranchName': userAuthorizationService.getUserBranchName(),
                'Parameters': parameters,
                'Timestamp': firebase.serverTimestamp(),
            };
        }
    }
})();
