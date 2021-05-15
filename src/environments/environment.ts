// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiBaseUrls: {
        userWs: 'https://user-api.nlacombe.net',
        vaultWs: 'https://vault-api.nlacombe.net/api',
        vaultImportsWs: 'https://vault-imports-api.nlacombe.net/api'
    },
    googleOauthClientId: '273906632603-hkhvc1m2dujftfufd37mos1pdr82bjn9.apps.googleusercontent.com'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
