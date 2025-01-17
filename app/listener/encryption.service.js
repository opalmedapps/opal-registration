// SPDX-FileCopyrightText: Copyright 2020 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

import CryptoJS from "crypto-js";
import nacl from "tweetnacl";
import util from "tweetnacl-util";
nacl.util = util;

(function () {
    'use strict';
    angular.module('myApp')
        .service('encryptionService', encryptionService);

    encryptionService.$inject = ['userAuthorizationService'];

    function encryptionService(userAuthorizationService) {
        var encryptionHash = '';
        const main_fields = ['BranchName', 'timestamp', 'Timestamp', 'Code'];


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
                return decryptObject(object, nacl.util.decodeUTF8(encryptionHash.substring(0, nacl.secretbox.keyLength)));
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
             @name encryptPassword
             @methodOf myApp.service:encryptionService
             @description Encrypts a given password using SHA512
             @return {String} Returns hashed password
             **/
            hash: function (incoming) {
                return CryptoJS.SHA512(incoming).toString();
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
                // Check if encryptionHash is already set
                if (encryptionHash) {
                    return encryptionHash;
                }

                // If not set, compute and set the value
                encryptionHash = CryptoJS.PBKDF2(
                    userAuthorizationService.getuserCode(),
                    userAuthorizationService.getUserSalt(),
                    { keySize: 256 / 32, iterations: 25000, hasher: CryptoJS.algo.SHA256 }
                ).toString(CryptoJS.enc.Hex);

                return encryptionHash;
            },

            /**
             @ngdoc method
             @name resetEncryptionHash
             @methodOf myApp.service:encryptionService
             @description Reset the encryption hash
             **/
            resetEncryptionHash: function () {
                encryptionHash = '';
            },

            generateNonce: function () {
                return nacl.randomBytes(nacl.secretbox.nonceLength)
            }
        };
    }
})();

