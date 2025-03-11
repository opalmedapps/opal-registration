/**
     __author__ : James Brace
    
     The purpose of this service is to validate incoming responses from the Opal Listener. The first step of validation
     is to make sure that the response does not contain an encryption error (mainly used during authentication). Afterwards,
     it checks to see if the response is a SUCCESS or error. If SUCCESS it returns the response data, if ERROR then it handles
     the error accordingly
 **/

(function () {
    'use strict';

    angular
        .module('myApp')
        .factory('responseValidatorFactory', responseValidatorFactory);

    responseValidatorFactory.$inject = ['firebaseFactory', '$window', 'securityFactory', 'encryptionService'];

    /* @ngInject */
    function responseValidatorFactory(firebaseFactory, $window, securityFactory, encryptionService) {
        
        /**
          ERROR CODES
         **/
        const ENCRYPTION_ERROR = 1;
        const SERVER_RESPONSE_ERROR = 2;
        const TOO_MANY_ATTEMPTS_ERROR = 4;
        const INVALID_VERSION_ERROR = 5;

        /**
          SUCCESS CODE
         **/
        const SUCCESS = 3;


        /**
         * Expose API to consumers
         */
        return {
            validate: validate,
            validateApiResponse: validateApiResponse
        };
        
        /**
             validates incoming response from listener
             @param response
             @param timeOut
         **/
        function validate(response, timeOut) {
            let timestamp = response.Timestamp;

            // TODO: it seems that encryption errors are no longer being handled properly by the app. This could be due to fact that response code is sometimes being returned encrypted
            if (response.Code === ENCRYPTION_ERROR) {
                return {error: {Code: 'ENCRYPTION_ERROR'}}
            } else {
                response.Timestamp = timestamp;
                clearTimeout(timeOut);

                response = encryptionService.decryptData(response);

                if (response.Code === SUCCESS) return {success: response};
                else return handleResponseError(response);
            }
        }

        /**
         validates incoming response from listener
         @param response
         @param timeOut
         **/
        function validateApiResponse(response, timeOut) {
            if (!response.status_code) {
                return {error: {Code: 'ENCRYPTION_ERROR'}}
            } else {
                clearTimeout(timeOut);
                response = (typeof response.status_code === 'number') ? response : encryptionService.decryptData(response);
                return (response.status_code === '200') ? {success: response} : handleResponseError(response);
            }
        }

        /**
             Handles responses that have an error code
             @param response
             @returns {*}
         **/
        function handleResponseError(response){
            let error = {};
            switch (response.Code) {
                case SERVER_RESPONSE_ERROR:
                case TOO_MANY_ATTEMPTS_ERROR:
                    error = {error: response};
                    break;
                case INVALID_VERSION_ERROR:
                    handleInvalidVersionError();
                    error = {error: {Code: 'INVALID_VERSION_ERROR'}};
                    break;
                default:
                    error = {error: response};
            }

            return error;
        }

        /**
             In this case, the user is logged out, brought to home, and then displayed an appropriate message by MainController
             Handles the special case where a response error is due to invalid version.
         **/
        function handleInvalidVersionError(){

            //remove the saved authorized user info from session storage
            $window.sessionStorage.removeItem('userAuthorizationInfomation');

            //signout on FireBase
            firebaseFactory.signOut();

            // Change state of securityFactory
            securityFactory.update('validVersion', false)
        }
    }
})();