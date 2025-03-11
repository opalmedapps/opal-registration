(function () {
    'use strict';
    angular.module('myApp')
        .service('requestToListener', requestToListener);

    requestToListener.$inject = ['userAuthorizationService', 'encryptionService', 'firebaseFactory', 'constants', 'apiConstants', 'responseValidatorFactory'];

    function requestToListener(userAuthorizationService, encryptionService, firebaseFactory, constants, apiConstants, responseValidatorFactory) {
        
        // Get firebase request user
        var firebase_url = null;

        // Get firebase response url
        var response_url = null;

        // Get firebase parent branch
        var firebase_parentBranch = null;

        return {
            sendRequestWithResponse: sendRequestWithResponse,
            apiRequest: apiRequest
        };

        // Function to send request to listener
        function sendRequest(typeOfRequest, parameters, encryptionKey, referenceField) {

            // Get firebase parent branch
            firebase_parentBranch = userAuthorizationService.getHospitalCode();

            // Get firebase request user
            firebase_url = firebase.database().ref(firebaseFactory.getFirebaseUrl(firebase_parentBranch));

            // Get firebase response url
            response_url = firebase_url.child(firebaseFactory.getFirebaseChild(null));

            return new Promise((resolve) => {
                let requestType;
                let requestParameters;
                
                if (encryptionKey) {
                    requestType = typeOfRequest;
                    requestParameters = encryptionService.encryptWithKey(parameters, encryptionKey);
                } else {
                    encryptionService.generateEncryptionHash();
                    requestType = encryptionService.encryptData(typeOfRequest);
                    requestParameters = encryptionService.encryptData(parameters);
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
                        console.log(request_object);
                        let pushID = firebase_url.child(reference).push(request_object);
                        resolve(pushID.key);
                    });
            });
        }

        function sendRequestWithResponse(typeOfRequest, parameters, encryptionKey, referenceField, responseField) {
            return new Promise((resolve, reject) => {

                //Sends request and gets random key for request
                sendRequest(typeOfRequest, parameters, encryptionKey, referenceField)
                    .then(key => {

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
                    });
                //If request takes longer than 30000 to come back with timeout request, delete reference
                const timeOut = setTimeout(function () {
                    response_url.set(null);
                    response_url.off();
                    reject({ Response: 'timeout' });
                }, 90000);

            }).catch(err => console.log(err));
        }

        function sendApiRequest(typeOfRequest, parameters, encryptionKey, referenceField) {

            // Get firebase parent branch
            firebase_parentBranch = userAuthorizationService.getHospitalCode();

            // Get firebase request user
            firebase_url = firebase.database().ref(firebaseFactory.getFirebaseApiUrl(firebase_parentBranch));

            console.log(firebaseFactory.getFirebaseApiUrl(firebase_parentBranch));

            // Get firebase response url
            response_url = firebase_url.child(firebaseFactory.getFirebaseChild(null));

            return new Promise((resolve) => {
                let requestType;
                let requestParameters;

                if (encryptionKey) {
                    requestType = typeOfRequest;
                    requestParameters = encryptionService.encryptWithKey(parameters, encryptionKey);
                } else {
                    encryptionService.generateEncryptionHash();
                    requestType = encryptionService.encryptData(typeOfRequest);
                    requestParameters = encryptionService.encryptData(parameters);
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
                        resolve(pushID.key);
                    });
            });
        }

        /**
         * @description Call the new listener structure that relays the request to Django backend
         * @param {object} parameters Required fields to process request
         * @param {object | null} Data the is needed to be passed to the request.
         * @returns Promise that contains the response data
         */
        function apiRequest(parameters, data = null) {
            return new Promise(async (resolve, reject) => {
                const formatedParams = formatParams(parameters, data);
                const requestType = 'registration-api';
                const requestKey = await sendApiRequest(requestType, formatedParams);
                const firebasePath = `response/${requestKey}`;
                const response_url = firebase_url.child(firebasePath);

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

        function formatParams(parameters, data){
            if (data) parameters.data = data;
            return {
                ...parameters,
                headers: {...apiConstants.REQUEST_HEADERS, 'Accept-Language': 'en'},
            }
        }
    }
})();
