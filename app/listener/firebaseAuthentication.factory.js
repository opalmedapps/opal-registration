import firebaseBranchConfig from '../../firebaseBranch.json';

//Defines the module for the app services.
var myModule = angular.module('myApp');

//Factory service made to transport the firebase link as a dependency
/**
      @ngdoc service
      @name myApp.service:firebaseFactory
      @requires myApp.service:userAuthorizationService
      @description Allows the app controllers or services obtain the authentication state and credentials, it also returns the urls inside for the firebase connection
**/
myModule.factory("firebaseFactory", [
    function () {

        var firebaseBranch = '';
        var hospitalCodeArray = [];
        var devBranch = '';
        var parentBranch = '';
        var apiParentBranch = ''
        // Call function to load firebase configuration on page load.
        getFirebaseConfig();

        // Function to load firebase branch configurations
        function getFirebaseConfig() {
            // Assign branch structure.
            hospitalCodeArray = firebaseBranchConfig.hospitalCodes;
            devBranch = firebaseBranchConfig.devBranch;
            parentBranch = firebaseBranchConfig.parentBranch;
            apiParentBranch = firebaseBranchConfig.apiParentBranch;
        }

        return {
           
            /**
                @ngdoc method
                @name getFirebaseUrl
                @methodOf myApp.service:firebaseFactory
                @returns {String} Returns firebase url string
             **/

            getFirebaseUrl: function (extension) {
                const hospital_code = hospitalCodeArray.find(code => code.uniqueHospitalCode === extension);
                if (!hospital_code) throw 'INVALID_HOSPITAL_CODE';
                const unique_code = hospital_code ? hospital_code.uniqueHospitalCode + '/' : '';
                return devBranch + '/' + unique_code + parentBranch + '/';
            },

            /**
             @ngdoc method
             @name getFirebaseApiUrl
             @methodOf myApp.service:firebaseFactory
             @returns {String} Returns firebase api url string
             **/

            getFirebaseApiUrl: function (extension) {
                const hospital_code = hospitalCodeArray.find(code => code.uniqueHospitalCode === extension);
                if (!hospital_code) throw 'INVALID_HOSPITAL_CODE';
                const unique_code = hospital_code ? hospital_code.uniqueHospitalCode + '/' : '';
                return devBranch + '/' + unique_code + apiParentBranch + '/';
            },

            /**
               @ngdoc method
               @name getFirebaseChild
               @methodOf myApp.service:firebaseFactory
               @returns {String} Returns firebase url string
            **/
            getFirebaseChild: function (child) {
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

            /**
             @ngdoc method
             @name getApiParentBranch
             @methodOf myApp.service:firebaseFactory
             @returns {String} Returns api parent branch string
             **/
            getApiParentBranch: function () {
                return apiParentBranch;
            },
            
            // Create firebase account with user email and password
            createFirebaseAccount: function (email, password) {
                
                // Method to create firebase account with user email and password
                return firebase.auth().createUserWithEmailAndPassword(email, password).then(function (userData) {
                    
                    return userData;

                }, function (error) {
                    // Get error response and display it.
                    return error;
                });
            },
            
            // Delete firebase branch
            deleteFirebaseBranch: function (branchName) {
                var firebaseBranchName = firebase.database().ref(firebaseBranch.parentBranch + "/" + firebaseBranch.firebaseChildBranch + '/' + branchName);
                var result = "";


                return firebaseBranchName.once("value", function (snapshot) {
                    if (snapshot.exists()) {
                        
                        firebaseBranchName.remove();
                        result = "Branch deleted";
                    }
                    else {
                        result = "Branch not deleted";
                    }
                    return result;
                });
            },
            validateFirebaseBranch: function (branchName) {

                var firebaseBranchReference = firebase.database().ref(config.firebaseBranch.parentBranch + '/' + config.firebaseBranch.firebaseChildBranch + '/' + branchName);
                var result = null;
                return firebaseBranchReference.once("value")
                    .then(function (snapshot) {
                        snapshot.forEach(function (snapShot) {
                            result = snapShot.key;
                        });
                        return result;
                    });
            },
            // Sign in with the unique created token
            signInWithEmailAndPassword: function (email, password) {
                
                // Method to signIn in firebase with custom token .
                return firebase.auth().signInWithEmailAndPassword(email, password).then(function (userData) {
                    
                    return userData;
                    //authHandler(userData, vm.token);

                }, function (error) {
                    // Get error response and display it.
                    return error;
                });
                
            },
        };
    }]);

