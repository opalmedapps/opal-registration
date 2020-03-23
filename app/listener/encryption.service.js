(function () {
    'use strict';
    angular.module('myApp')
        .service('encryptionService', encryptionService);

    encryptionService.$inject = ['userAuthorizationService'];

    function encryptionService(userAuthorizationService) {
        var securityAnswerHash = '';
        var encryptionHash = '';
        var tempEncryptionHash = '';

        const main_fields = ['UserID', 'Timestamp', 'Code', 'DeviceId'];


        function decryptObject(object, secret) {
            if (typeof object === 'string') {
                //grab the nonce
                var pair = splitValue(object);
                return nacl.util.encodeUTF8(nacl.secretbox.open(pair[1], pair[0], secret));

            } else {
                for (var key in object) {
                    if (typeof object[key] === 'object') {
                        decryptObject(object[key], secret);
                    } else {
                        if (main_fields.includes(key)) {
                            object[key] = object[key];
                        }
                        else {
                            //grab the nonce
                            pair = splitValue(object[key]);

                            var value = nacl.secretbox.open(pair[1], pair[0], secret);

                            if (value === null) {

                                object[key] = '';

                            }
                            else {
                                object[key] = nacl.util.encodeUTF8(value);
                            }
                        }
                    }
                }
            }
            return object;
        }

        function encryptObject(object, secret, nonce) {
            if (typeof object === 'string') {
                return nacl.util.encodeBase64(appendUint8Array(nonce, nacl.secretbox(nacl.util.decodeUTF8(object), nonce, secret)));
            } else if (typeof object !== 'string' && typeof object !== 'object') {
                object = String(object);
                return nacl.util.encodeBase64(appendUint8Array(nonce, nacl.secretbox(nacl.util.decodeUTF8(object), nonce, secret)));
            } else {
                for (var key in object) {
                    if (typeof object[key] === 'object') {
                        encryptObject(object[key], secret, nonce);
                    }
                    else {
                        object[key] = String(object[key]);
                        object[key] = nacl.util.encodeBase64(appendUint8Array(nonce, nacl.secretbox(nacl.util.decodeUTF8(object[key]), nonce, secret)));
                    }
                }
                return object;
            }
        }

        function splitValue(str) {


            // Patch for iOS9
            if (!Uint8Array.prototype.slice) {
                Uint8Array.prototype.slice = function (a, b) {
                    var Uint8ArraySlice = new Uint8Array(this.buffer.slice(a, b));
                    return Uint8ArraySlice;
                }
            }

            var value = nacl.util.decodeBase64(str);

            return [value.slice(0, nacl.secretbox.nonceLength), value.slice(nacl.secretbox.nonceLength, value.length)]
        }

        /**
             Creates a new Uint8Array based on two different ArrayBuffers
            
             @private
             @param {Uint8Array} buffer1 The first buffer.
             @param {Uint8Array} buffer2 The second buffer.
             @return {Uint8Array} The new ArrayBuffer created out of the two.
         **/
        var appendUint8Array = function (buffer1, buffer2) {
            var tmp = new Uint8Array(buffer1.length + buffer2.length);
            tmp.set(buffer1, 0);
            tmp.set(buffer2, buffer1.length);
            return tmp;
        };

        return {
            /**
                @ngdoc method
                @name decryptData
                @methodOf myApp.service:encryptionService
                @params {Object} object Object to be decrypted
                @description Uses the hashed of the password from the {@link myApp.service:userAuthorizationService  userAuthorizationService} service as key to decrypt object parameter
                @return {Object} Returns decrypted object
            **/
            decryptData: function (object) {
                //Decrypt
                debugger;
                return decryptObject(object, nacl.util.decodeUTF8(encryptionHash.substring(0, nacl.secretbox.keyLength)));
                debugger;
            },

            /**
                @ngdoc method
                @name decryptDataWithKey
                @methodOf myApp.service:encryptionService
                @params {Object} object Object to be decrypted, {String} key fo
                @description Uses the given key as the decryption hash
                @return {Object} Returns decrypted object
             **/
            decryptDataWithKey: function (object, key) {
                //Decrypt
                return decryptObject(object, nacl.util.decodeUTF8(key.substring(0, nacl.secretbox.keyLength)));
            },
            /**
                @ngdoc method
                @name encryptData
                @methodOf myApp.service:encryptionService
                @params {Object} object Object to be encrypted
                @description Uses the hashed of the password from the {@link myApp.service:userAuthorizationService  userAuthorizationService} service as key to encrypt object parameter
                @return {Object} Returns encrypted object
            **/
            encryptData: function (object) {
                var nonce = this.generateNonce();
                debugger;
                console.log(object);

                return encryptObject(object, nacl.util.decodeUTF8(encryptionHash.substring(0, nacl.secretbox.keyLength)), nonce);
            },

            /**
                @ngdoc method
                @name encryptWithKey
                @methodOf myApp.service:encryptionService
                @params {Object} object Object to be encrypted
                @params {String} secret Key for encrypting
                @description Uses the secret parameter as key to encrypt object parameter
                @return {Object} Returns encrypted object
            **/
            encryptWithKey: function (object, secret) {
                var nonce = this.generateNonce();
                return encryptObject(object, nacl.util.decodeUTF8(secret.substring(0, nacl.secretbox.keyLength)), nonce);
            },

            /**
                @ngdoc method
                @name setSecurityAns
                @methodOf myApp.service:encryptionService
                @params {String} answer Security answer
                @description Sets the security answer to be used as the encryption key for all future communication.
             **/
            setSecurityAns: function (answer) {
                debugger;
                securityAnswerHash = answer;
            },

            /**
                @ngdoc method
                @name getSecurityAns
                @methodOf myApp.service:encryptionService
                @description Uses the secret parameter as key to encrypt object parameter
                @return {String} Returns hashed security answer
             **/
            getSecurityAns: function () {
                debugger;
                return securityAnswerHash;
            },

            /**
                @ngdoc method
                @name encryptPassword
                @methodOf myApp.service:encryptionService
                @description Encrypts a given password using SHA512
                @return {String} Returns hashed password
             **/
            hash: function (incoming) {
                debugger;
                return CryptoJS.SHA512(incoming).toString();
            },

            /**
                @ngdoc method
                @name generateTempEncryptionHash
                @methodOf myApp.service:encryptionService
                @description returns a one-time encryption hash based on inputted parameters
                @return {String} Returns temporary encryption hash
             **/
            generateTempEncryptionHash: function (ssn, answer) {
                debugger;
                tempEncryptionHash = CryptoJS.PBKDF2(ssn, answer, { keySize: 512 / 32, iterations: 1000 }).toString(CryptoJS.enc.Hex);

            },

            /**
                @ngdoc method
                @name removeTempEncryptionHash
                @methodOf myApp.service:encryptionService
                @description deletes existing Temporary Encryption Hash
             **/
            removeTempEncryptionHash: function () {
                tempEncryptionHash = "";

            },

            /**
                @ngdoc method
                @name setEncryptionHash
                @methodOf myApp.service:encryptionService
                @description Encrypts a given password using SHA512
                @return {String} Returns hashed password
                Encryption key/Secrate: Registration code
                Salt: RAMQ
             **/
            generateEncryptionHash: function () {
                debugger;
                encryptionHash = CryptoJS.PBKDF2(userAuthorizationService.getuniqueCode(), userAuthorizationService.getUserRAMQ(), { keySize: 512 / 32, iterations: 1000 }).toString(CryptoJS.enc.Hex);

            },

            generateNonce: function () {
                return nacl.randomBytes(nacl.secretbox.nonceLength)
            },

            getTempEncryptionHash: function () {
                return tempEncryptionHash;
            }

        };
    }
})();

