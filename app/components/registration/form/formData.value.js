/**
     Filename     :   formData.value.js
     Description  :   Declare all the variable of parent and child forms. This variable is accessible throught the application and It set the value when user entered values in all the fields.
                      NOTE: On page refresh of either of parent or child pages, All variables will loose their values.
     Created by   :   Jinal Vyas
     Date         :   June 2019
 **/

(function () {
    'use strict';

    angular
        .module('myApp')
        .value('formDataModel', formDataModel);

    function formDataModel() {
        
        // Variables to pass the values to the listener
        this.formFieldsData = {
            registrationCode: '',
            ramq: '',
            dateofBirth: '',
            email: '',
            password: '',
            securityQuestion1: '',
            answer1: '',
            securityQuestion2: '',
            answer2: '',
            securityQuestion3: '',
            answer3: '',
            language: '',
            accessLevel: '',
            accessLevelSign: '',
            termsandAggreementId: '',
            termsandAggreement: '',
            termsandAggreementPDF:'',
            termsandAggreementSign: ''
        }
        
        // Below variables which are no need to pass to the listner It's used only for validations.
        this.confirmEmail = '';
        this.confirmPassword = '';
        this.branchName = '';

        // Variables to set field status and message.
        this.codeFormat = { status: null, message: null };
        this.ramqFormat = { status: null, message: null };
        this.dateofBirthFormat = { status: null, message: null };
        this.emailFormat = { status: null, message: null };
        this.confirmEmailFormat = { status: null, message: null };
        this.passwordFormat = { status: null, message: null };
        this.confirmPasswordFormat = { status: null, message: null };
        this.securityQuestion1Format = { status: null, message: null };
        this.answer1Format = { status: null, message: null };
        this.securityQuestion2Format = { status: null, message: null };
        this.answer2Format = { status: null, message: null };
        this.securityQuestion3Format = { status: null, message: null };
        this.answer3Format = { status: null, message: null };
        this.languageFormat = { status: null, message: null };
        this.accessLevelFormat = { status: null, message: null };
        this.allAccessLevelFormat = { status: null, message: null };
        this.needToKnowAccessLevelFormat = { status: null, message: null };
        this.accessLevelSignFormat = { status: null, message: null };
        this.termsandAggreementSignFormat = { status: null, message: null };

        // Set variable's value from database response.
        this.selectedLanguage = '';

        this.securityQuestionList = [{}];
        this.securityQuestionList_EN = [{}];
        this.securityQuestionList_FR = [{}];

        this.languageList = [{}];
        this.languageList_EN = [{}];
        this.languageList_FR = [{}];

        this.accessLevelList = [{}];
        this.accessLevelList_EN = [{}];
        this.accessLevelList_FR = [{}];

        this.allAccessLevelList = [{}];
        this.allAccessLevelList_EN = [{}];
        this.allAccessLevelList_FR = [{}];

        this.needToKnowAccessLevelList = [{}];
        this.needToKnowAccessLevelList_EN = [{}];
        this.needToKnowAccessLevelList_FR = [{}];

        this.termsandAggreementDocuments = [{}];
        
        this.firstName = '';
        this.lastName = '';

        // Variable to set form active class.
        this.searchForm = '';
        this.secureForm = { status: '', flag: null };
        this.preferenceForm = { status: '', flag: null };
        this.agreementForm = { status: '', flag: null };
        this.successForm = { status: '', flag: null };
        

        // Access spinner value for all child forms
        this.displaySpinner = null;
    }
})();