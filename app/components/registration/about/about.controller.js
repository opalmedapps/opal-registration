// SPDX-FileCopyrightText: Copyright (C) 2025 Opal Health Informatics Group at the Research Institute of the McGill University Health Centre <john.kildea@mcgill.ca>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { marked } from 'marked';

import logoEn from '../../../../images/logos/navbar-logo-en.png';
import logoFr from '../../../../images/logos/navbar-logo-fr.png';
import thirdPartyLicenses from "../../../../THIRDPARTY.md";

(function () {
    'use strict';

    angular
        .module('myApp')
        .controller('aboutController', aboutController);

    aboutController.$inject = ['$rootScope', '$translate', '$filter', '$sce', '$location', '$anchorScroll'];

    function aboutController($rootScope, $translate, $filter, $sce, $location, $anchorScroll) {
        var vm = this;

        vm.logoEn = logoEn;
        vm.logoFr = logoFr;
        vm.lan_key = $translate.use();

        const customRenderExtension = {
            renderer: {
                // Turn all license text blocks into collapsible sections using <details><summary>
                code(code) {
                    return `
                        <details>
                          <summary>${$filter('translate')('ABOUT_OPAL.SHOW_LICENSE_TEXT')}</summary>
                          <pre><code>${code}</code></pre>
                        </details>
                    `;
                },
                // Convert all links to open in a new tab using a _blank target
                link(href, title, text) {
                    const titleAttr = title ? ` title="${title}"` : '';
                    return `<a href="${href}"${titleAttr} target="_blank" rel="noopener">${text}</a>`;
                }
            }
        };

        marked.use(customRenderExtension);
        // Configure Marked (GFM for auto-linkifying bare URLs)
        marked.setOptions({ gfm: true });

        // Remove both the comment block and the section header
        let mdContent = thirdPartyLicenses.replace(/<!--[\s\S]*?-->\s*# Third-Party Dependencies\s*\n/, '');

        // Process the Markdown file into HTML
        let htmlContent = marked(mdContent);

        // If applicable, add a paragraph at the beginning stating that the section has not been translated
        if (vm.lan_key !== 'en') htmlContent = `<p class="third-party-pre">${$filter('translate')('ABOUT_OPAL.UNTRANSLATED_PAGE_DISCLAIMER')}</p>
            <hr>`
            + htmlContent;

        vm.content = $sce.trustAsHtml(htmlContent);

        // Change language function.
        vm.changeLanguage = function (language) {
            vm.lan_key = (language.slice(0, 2)).toLowerCase();

            // If lan_key has fr (french) value, switch to French
            if (vm.lan_key === 'fr') {
                $translate.use(vm.lan_key);
            }

            // If lan_key has en (english) value, switch to english
            if (vm.lan_key === 'en') {
                $translate.use(vm.lan_key);
            }

            $rootScope.$broadcast("changeLanguage");
        };

        vm.gotoDisclaimer = function() {
            // Set the location hash to the id of the element
            $location.hash('healthcare-disclaimer');
            $anchorScroll();
        };
    }
})();
