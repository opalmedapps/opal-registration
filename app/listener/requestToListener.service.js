(function () {
    'use strict';
    angular.module('myApp')
        .service('requestToListener', requestToListener);

    requestToListener.$inject = ['userAuthorizationService', 'encryptionService', 'firebaseFactory', 'constants', 'responseValidatorFactory'];

    function requestToListener(userAuthorizationService, encryptionService, firebaseFactory, constants, responseValidatorFactory) {

        debugger;
        // Get firebase request user
        var firebase_url = null;

        // Get firebase response url
        var response_url = null;

        // Function to send request to listener
        function sendRequest(typeOfRequest, parameters, encryptionKey, referenceField) {

            // Get firebase request user
            firebase_url = firebase.database().ref(firebaseFactory.getFirebaseUrl(null));

            // Get firebase response url
            response_url = firebase_url.child(firebaseFactory.getFirebaseChild(null));

            return new Promise((resolve) => {
                let requestType;
                let requestParameters;


                debugger;
                if (encryptionKey) {
                    requestType = typeOfRequest;
                    requestParameters = encryptionService.encryptWithKey(parameters, encryptionKey);
                } else {
                    debugger;
                    encryptionService.generateEncryptionHash();
                    requestType = encryptionService.encryptData(typeOfRequest);
                    requestParameters = encryptionService.encryptData(parameters);
                }
                debugger;
                constants.version()
                    .then(version => {
                        let request_object = {
                            'Request': requestType,
                            'Token': userAuthorizationService.getToken(),
                            'UserID': userAuthorizationService.getUsername(),
                            'BranchName': userAuthorizationService.getFirebaseBranchName(),
                            'Parameters': requestParameters,
                            'Timestamp': firebase.database.ServerValue.TIMESTAMP,
                            'UserEmail': userAuthorizationService.getEmail(),
                            'AppVersion': version
                        };
                        debugger;
                        let reference = referenceField || 'requests';
                        // Get firebase request url
                        //const request_url = firebase_url.child(firebaseFactory.getFirebaseRequestUrl(request_object.BranchName));
                        let pushID = firebase_url.child(reference).push(request_object);
                        resolve(pushID.key);
                    });
            });
        }

        return {

            sendRequestWithResponse: function (typeOfRequest, parameters, encryptionKey, referenceField, responseField) {
                return new Promise((resolve, reject) => {
                    debugger;

                    //const response_url = firebase_url.child(firebaseFactory.getFirebaseResponsetUrl(userAuthorizationService.getFirebaseBranchName()));

                    //Sends request and gets random key for request
                    sendRequest(typeOfRequest, parameters, encryptionKey, referenceField)
                        .then(key => {
                            debugger;

                            //Sets the reference to fetch data for that request
                            //let refRequestResponse = (!referenceField) ?
                            //    response_url.child(userAuthorizationService.getUsername() + '/' + key) :
                            //    firebase_url.child(responseField).child(key);

                            debugger;
                            let refRequestResponse = (!referenceField) ?
                                response_url.child(key) :
                                firebase_url.child(responseField).child(key);

                            debugger;
                            console.log('********** refRequestResponse' + refRequestResponse);

                            //Waits to obtain the request data.
                            refRequestResponse.on('value', snapshot => {
                                if (snapshot.exists()) {
                                    debugger;
                                    let data = snapshot.val();
                                    
                                    refRequestResponse.set(null);
                                    refRequestResponse.off();

                                    data = responseValidatorFactory.validate(data, encryptionKey, timeOut);

                                    debugger;
                                    if (data.success) {
                                        console.log(typeOfRequest);
                                        console.log(data.success);

                                        resolve(data.success);
                                    } else {
                                        console.log(typeOfRequest);
                                        console.log(data.error);

                                        reject(data.error);
                                    }
                                }
                            }, error => {
                                console.log('sendRequestWithResponse error' + error);
                                debugger;
                                refRequestResponse.set(null);
                                refRequestResponse.off();
                                reject(error);
                            });
                        });
                    debugger;
                    //If request takes longer than 30000 to come back with timeout request, delete reference
                    const timeOut = setTimeout(function () {
                        response_url.set(null);
                        response_url.off();
                        reject({ Response: 'timeout' });
                    }, 30000);

                }).catch(err => console.log(err));
            },

            sendRequest: function (typeOfRequest, content, key) {
                sendRequest(typeOfRequest, content, key);
            }
        };
    }
})();
