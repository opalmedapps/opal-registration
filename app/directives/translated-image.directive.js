// SPDX-FileCopyrightText: Copyright 2024 Opal Health Informatics Group <info@opalmedapps.tld>
//
// SPDX-License-Identifier: Apache-2.0

(function () {
    'use strict';

    angular
        .module('myApp')
        .directive('translatedImage', translatedImage);

    translatedImage.$inject = ['$rootScope', '$translate'];

    function translatedImage($rootScope, $translate) {
        let directive = {
            restrict: 'E',
            scope: {
                // Imported reference to the English version of the image
                "srcEn": "=",
                // Imported reference to the French version of the image
                "srcFr": "=",
                // Optional: the classes to apply to the image itself
                "innerClass": "@?"
            },
            template: `
                <img ng-src="{{imageSrc}}" class="{{innerClass}}"/>
            `,
            link: scope => {
                bindEvents();

                function bindEvents() {
                    // Initialize the image when translations are first available
                    $translate.onReady(translateImage);

                    // Change the image when the language changes
                    const changeLanguageOff = $rootScope.$on("changeLanguage", translateImage);
                    scope.$on('destroy', changeLanguageOff);
                }

                function translateImage() {
                    const language = $translate.proposedLanguage().toUpperCase();
                    scope.imageSrc = language === 'EN' ? scope.srcEn : scope.srcFr;
                }
            },
        }
        return directive;
    }
})();
