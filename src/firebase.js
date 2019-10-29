const Firebase = require('firebase/app');
require('firebase/messaging');

/**
 * @class PushlyFirebase
 */
export default class PushlyFirebase {

    /**
     * @constructor
     */
    constructor() {
            Firebase.initializeApp({
                apiKey: "AIzaSyCHOfzwaG8QdWZQPbsD38gZQDbNmWyk3oA",
                authDomain: "apptitans.firebaseapp.com",
                databaseURL: "https://apptitans.firebaseio.com",
                projectId: "apptitans",
                storageBucket: "",
                messagingSenderId: "721913454836",
                appId: "1:721913454836:web:68de7e40f92c5197"
            });
    }

    /**
     * Initialization method
     */
    init() {
        debugger;
        let scope = PushlyFirebase;
        PushlyFirebase.getClientSideApproval();
        //To get refresh token
        Firebase.messaging().onTokenRefresh(() => {
            window._pushmessaging.getToken().then((refreshedToken) => {
                console.log('Token refreshed.');

                // Indicate that the new Instance ID token has not yet been sent to the
                // app server.
                window._Pushly.setTokenSentToServer(false);

                // [START_EXCLUDE]
                // Display new Instance ID token and clear UI of all previous messages.
                scope.getFirebaseToken();
                // [END_EXCLUDE]

            }).catch((err) => {
                console.log('Unable to retrieve refreshed token ', err);
            });
        });
    }

    /**
   * To get Instance ID token. Initially this makes a network call, once retrieved subsequent calls to getToken will return from cache.
   * @param {Object} scope Current instance
   */
    static getFirebaseToken(scope = window._Pushly) {

        // [START get_token]
        debugger;
        Firebase.messaging().getToken().then((currentToken) => {
            if (currentToken) {
                scope.sendTokenToServer(currentToken);
            } else {
                // Show permission request.
                console.log('No Instance ID token available. Request permission to generate one.');
                // Show permission UI.
                scope.setTokenSentToServer(false);
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            scope.setTokenSentToServer(false);
        });
        // [END get_token]

    }

    /**
     * To get approval from the user to start service worker
     * @param {Object} scope Current instance
     */
    static getClientSideApproval(scope = PushlyFirebase) {
        Firebase.messaging().requestPermission()
            .then(function () {
                console.log('Have permission...');
                return scope.getFirebaseToken();
            })
            .catch(function (err) {
                console.log('error occured......', err);
            })
    }
}