
//Defines the module for the app services.
var myModule = angular.module('myApp');

//Factory service made to transport the firebase link as a dependency
/**
      @ngdoc service
      @name myApp.service:firebaseFactory
      @requires $firebaseAuth
      @requires myApp.service:userAuthorizationService
      @description Allows the app controllers or services obtain the authentication state and credentials, it also returns the urls inside for the firebase connection
**/
myModule.factory("firebaseFactory", ['$firebaseAuth', '$http', '$firebaseObject', 'userAuthorizationService',
    function ($firebaseAuth, $http) {

        var firebaseBranch = "";

        debugger;
        // Call function to load firebase configuration on page load.
        getFirebaseConfig();

        // Function to load firebase configration
        function getFirebaseConfig() {
            debugger;
            return $http({
                method: 'GET',
                url: './firebaseBranch.json'
            }).then(function (results) {

                debugger;
                // Assign branch structure.
                firebaseBranch = results.data;

                // Fetch parent branch value.
               // firebaseUrl = firebaseBranch.parentBranch;
                
                return 1;
            }, function (error) {
                debugger;
                return (error);
            });
        };

        return {
            /**
                @ngdoc method
                @name getAuthentication
                @methodOf myApp.service:firebaseFactory
                @description Returns reference to firebase authentication Angular Fire object, $firebaseAuth
            `   @returns {Object} Reference to firebase authentication service
             **/
            getAuthentication: function () {
                return $firebaseAuth();
            },

            /**
                @ngdoc method
                @name getAuthenticationCredentials
                @methodOf myApp.service:firebaseFactory
                @returns {Object} Returns firebase authentication credentials
              **/
            getAuthenticationCredentials: function () {
                return $firebaseAuth().$getAuth();
            },

            /**
                @ngdoc method
                @name getFirebaseUrl
                @methodOf myApp.service:firebaseFactory
                @returns {String} Returns firebase url string
             **/

            getFirebaseUrl: function (extension) {
                debugger;
                debugger;
                switch (extension) {
                    case null:
                        //return firebaseUrl;
                        return firebaseBranch.parentBranch + '/' ;
                    case 'users':
                        return firebaseBranch.parentBranch + firebaseBranch.responseChildBranch + "/";
                    case 'requests':
                        return firebaseBranch.parentBranch + firebaseBranch.requestChildBranch + "/";
                    //case 'response':
                    //    return 'response/';
                    default:
                        return firebaseUrl;
                }

            },

            /**
               @ngdoc method
               @name getFirebaseChild
               @methodOf myApp.service:firebaseFactory
               @returns {String} Returns firebase url string
            **/
            getFirebaseChild: function (child) {
                debugger;
                switch (child) {
                    case null:
                        return firebaseBranch.responseChildBranch + "/";
                    case 'requests':
                        return firebaseBranch.requestChildBranch + "/";
                    //case 'response':
                    //    return 'response/';
                    default:
                        return '';
                }
            },

            // Get firebase request branch URL
            //getFirebaseRequestUrl: function (branchName) {
            //    debugger;
            //    return branchName + '/';
            //},

            //// Get firebase response branch URL
            //getFirebaseResponsetUrl: function (branchName) {
            //    debugger;
            //    return branchName + '/' + firebaseBranch.responseChildBranch + '/';
            //},

            getDBRef: function (ref) {
                var global = firebase.database().ref(firebaseUrl);

                if (ref) {
                    return global.child(ref);
                } else {
                    return global
                }
            },

            // Sign in with the unique created token
            signInWithToken: function (token) {
                debugger;

                // Method to signIn in firebase with custom token .
                return firebase.auth().signInWithCustomToken(token).then(function (userData) {
                    debugger;
                    console.log(userData);
                    return userData;
                    //authHandler(userData, vm.token);

                }, function (error) {
                    // Get error response and display it.
                    return error;
                });

                console.log(firebase.auth.Auth.Persistence);
                debugger;
            },

            // Create firebase account with user email and password
            createFirebaseAccount: function (email, password) {
                debugger;

                // Method to create firebase account with user email and password
                return firebase.auth().createUserWithEmailAndPassword(email, password).then(function (userData) {
                    debugger;
                    console.log(userData);
                    return userData;

                }, function (error) {
                    // Get error response and display it.
                    return error;
                });
            },

            // Check firebase branch is exist into the firebase or not
            checkFirebaseBranch: function () {
                debugger;

                var parentBranch = firebase.database().ref(firebaseBranch.parentBranch + "/" + firebaseBranch.requestChildBranch);
                
               return parentBranch.once("value", function (snapshot) {
                    debugger;
                    if (snapshot.exists()) {
                        console.log("branch exists");
                        debugger;
                        firebaseUrl = firebaseBranch.parentBranch;

                        console.log("firebaseUrl" + firebaseUrl);

                        return firebaseUrl;
                    }
                    else {
                        console.log("not exists");
                    }
                });
            },

            // Delete firebase branch
            deleteFirebaseBranch: function (branchName) {
                debugger;

                var firebaseBranchName = firebase.database().ref(firebaseBranch.parentBranch + "/" + firebaseBranch.firebaseChildBranch + '/' + branchName);
                var result = "";


                return firebaseBranchName.once("value", function (snapshot) {
                    debugger;
                    if (snapshot.exists()) {
                        console.log("Branch deleted");
                        debugger;
                        firebaseBranchName.remove();
                        result = "Branch deleted";
                    }
                    else {
                        console.log("Branch not deleted");
                        result = "Branch not deleted";
                    }
                    return result;
                });
            },
            validateFirebaseBranch: function (branchName) {
                debugger;

                var firebaseBranchReference = firebase.database().ref(config.firebaseBranch.parentBranch + '/' + config.firebaseBranch.firebaseChildBranch + '/' + branchName);
                var result = null;
                return firebaseBranchReference.once("value")
                    .then(function (snapshot) {
                        snapshot.forEach(function (snapShot) {
                            debugger;
                            result = snapShot.key;
                        });
                        return result;
                    });
            }
        };
    }]);

