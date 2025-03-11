(function () {
    'use strict';
    angular.module('myApp')
        .service('requestToListener', requestToListener);

    requestToListener.$inject = ['userAuthorizationService', 'encryptionService', 'firebaseFactory', 'constants', 'apiConstants', 'responseValidatorFactory'];

    function requestToListener(userAuthorizationService, encryptionService, firebaseFactory, constants, apiConstants, responseValidatorFactory) {

        return {
            sendRequestWithResponse: sendRequestWithResponse,
            apiRequest: apiRequest
        };

        // Function to send request to listener
        function sendRequest(typeOfRequest, parameters, encryptionKey, referenceField) {

            // Get firebase parent branch
            const firebase_parentBranch = userAuthorizationService.getHospitalCode();

            let branch_name = typeOfRequest === firebaseFactory.getApiParentBranch()
                ? firebaseFactory.getFirebaseApiUrl(firebase_parentBranch)
                : firebaseFactory.getFirebaseUrl(firebase_parentBranch);


            // Get firebase request user
            const firebase_url = firebase.database().ref(branch_name);

            return new Promise((resolve) => {
                let requestType;
                // Clone the parameters to prevent re-encrypting when using them in several requests
                let requestParameters = JSON.parse(JSON.stringify(parameters));

                if (encryptionKey) {
                    requestType = typeOfRequest;
                    requestParameters = encryptionService.encryptWithKey(requestParameters, encryptionKey);
                } else {
                    encryptionService.generateEncryptionHash();
                    requestType = encryptionService.encryptData(typeOfRequest);
                    requestParameters = encryptionService.encryptData(requestParameters);
                }
                constants.version()
                    .then(version => {
                        let request_object = {
                            'Request': requestType,
                            'BranchName': userAuthorizationService.getUserBranchName(),
                            'Parameters': requestParameters,
                            'Timestamp': firebase.database.ServerValue.TIMESTAMP
                        };
                        let reference = referenceField || 'requests';
                        let pushID = firebase_url.child(reference).push(request_object);
                        resolve({key: pushID.key, url: firebase_url});
                    });
            });
        }

        function sendRequestWithResponse(typeOfRequest, parameters, encryptionKey, referenceField, responseField) {
            return new Promise((resolve, reject) => {

                //Sends request and gets random key for request
                sendRequest(typeOfRequest, parameters, encryptionKey, referenceField)
                    .then(response => {
                        const key = response.key;
                        const firebase_url = response.url;

                        // Get firebase response url
                        const response_url = firebase_url.child(firebaseFactory.getFirebaseChild(null));

                        let refRequestResponse = (!referenceField) ?
                            response_url.child(key) :
                            firebase_url.child(responseField).child(key);

                        //Waits to obtain the request data.
                        refRequestResponse.on('value', snapshot => {
                            if (snapshot.exists()) {

                                let data = snapshot.val();

                                refRequestResponse.set(null);
                                refRequestResponse.off();

                                data = responseValidatorFactory.validate(data, encryptionKey, timeOut);
                                (data.success) ? resolve(data.success) : reject(data.error);
                            }
                        }, error => {
                            console.log('sendRequestWithResponse error' + error);

                            refRequestResponse.set(null);
                            refRequestResponse.off();
                            reject(error);
                        });
                        // If request takes longer to come back, time out the request
                        const timeOut = setTimeout(function () {
                            response_url.set(null);
                            response_url.off();
                            reject({ Response: 'timeout' });
                        }, 30000);
                    });
            }).catch(err => console.log(err));
        }

        /**
         * @description Call the new listener structure that relays the request to Django backend
         * @param {object} parameters Required fields to process request
         * @param {string} language Required field to request header, 'en' or 'fr'
         * @param {object | null} data that is needed to be passed to the request.
         * @returns Promise that contains the response data
         */
        function apiRequest(parameters, language, data = null) {
            return new Promise(async (resolve, reject) => {
                const formatedParams = formatParams(parameters, language, data);
                const requestType = firebaseFactory.getApiParentBranch();
                const {key, url} = await sendRequest(requestType, formatedParams);
                const firebasePath = `responses/${key}`;
                const response_url = url.child(firebasePath);

                response_url.on('value', snapshot => {
                    if (snapshot.exists()) {

                        let data = snapshot.val();

                        response_url.set(null);
                        response_url.off();

                        data = responseValidatorFactory.validateApiResponse(data, null, timeOut);
                        (data.success) ? resolve(data.success) : reject(data.error);
                    }
                });
                const timeOut = setTimeout(function () {
                    response_url.set(null);
                    response_url.off();
                    reject({ Response: 'timeout' });
                }, 90000);
            });
        }

        function formatParams(parameters, language, data){
            if (data) parameters.data = data;
            return {
                ...parameters,
                headers: {...apiConstants.REQUEST_HEADERS, 'Accept-Language': language},
            }
        }
    }
})();
