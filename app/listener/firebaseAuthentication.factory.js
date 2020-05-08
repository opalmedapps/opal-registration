
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
                
                return 1;
            }, function (error) {
                debugger;
                return (error);
            });
        };

        return {
           
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
            },
            // Sign in with the unique created token
            signInWithEmailAndPassword: function (email, password) {
                debugger;

                // Method to signIn in firebase with custom token .
                return firebase.auth().signInWithEmailAndPassword(email, password).then(function (userData) {
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
        };
    }]);

