// SPDX-FileCopyrightText: Copyright 2019 Opal Health Informatics Group <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

/**
     Filename     :   formData.value.js
     Description  :   Declare all the variable of parent and child forms. This variable is accessible throught the application and It set the value when user entered values in all the fields.
                      NOTE: On page refresh of either of parent or child pages, All variables will loose their values.
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
            registrationCode: "",
            email: "",
            password: "",
            securityQuestion1: "",
            answer1: "",
            securityQuestion2: "",
            answer2: "",
            securityQuestion3: "",
            answer3: "",
            language: "",
            accessLevel: "",
        }

        // Below variables which are no need to pass to the listener. It's used only for validations.
        this.confirmEmail = "";
        this.confirmPassword = "";
        this.passwordMeter = "";
        this.hospitalCode = "";
        this.ramq = "";
        this.mrn = "";

        // Variables to set field status and message.
        this.codeFormat = { status: null, message: null };
        this.ramqFormat = { status: null, message: null };
        this.emailFormat = { status: null, message: null };
        this.confirmEmailFormat = { status: null, message: null };
        this.passwordFormat = { status: null, message: null };
        this.confirmPasswordFormat = { status: null, message: null };
        this.phoneFormat = { status: null, message: null };
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
        this.selectedLanguage = "";

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

        // terms of use PDF file in base64 format
        this.termsOfUseBase64_EN = undefined;
        this.termsOfUseBase64_FR = undefined;
        this.termsOfUseDisplayed = undefined;

        this.userName = "";

        // Variable to set form active class.
        this.searchForm = "";
        this.secureForm = { status: "", flag: null };
        this.preferenceForm = { status: "", flag: null };
        this.agreementForm = { status: "", flag: null };
        this.successForm = { status: "", flag: null };


        // Access spinner value for all child forms
        this.displaySpinner = null;
    }
})();
