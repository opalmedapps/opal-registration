var myModule = angular.module('myApp');

myModule.constant('constants', {
    app: document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1,
    version: function () {
        return new Promise((resolve) => {
            if (this.app) {
                if (this.savedVersion) resolve(this.savedVersion);
                cordova.getAppVersion.getVersionNumber().then(version => {
                    this.savedVersion = version;
                    resolve(version)
                });
            } else {
                resolve("200.200.200")
            }
        })

    },
    savedVersion: null
});
