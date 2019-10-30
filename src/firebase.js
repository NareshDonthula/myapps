const Firebase = require('firebase/app');
require('firebase/messaging');
import PushlyServerFirebase from './pushly-server-firebase.js';

/**
 * @class PushlyFirebase
 */
export default class PushlyFirebase {

    /**
     * @constructor
     */
    constructor() {

        //Initialize app in fcm
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
        let serviceworkerRegistrationPath = (window.location.origin == 'https://pushly.500apps.com') ? '/pushly/firebase-messaging-sw.js' : '/firebase-messaging-sw.js';

        //Register service worker path in fcm
        navigator.serviceWorker.register(serviceworkerRegistrationPath)
            .then((registration) => {
                Firebase.messaging().useServiceWorker(registration);
            });

        // Request permission to get token.....
        scope.getClientSideApproval();

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
            if (!currentToken) {
                // Show permission request.
                console.log('No Instance ID token available. Request permission to generate one.');
                // Set token flag to false.
                scope.setTokenSentToServer(false);
                //Request permission
                PushlyFirebase.getClientSideApproval();
            }
            return scope.sendTokenToServer(currentToken);
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

                //Close child window if open
                if (window.location.origin == 'https://pushly.500apps.com') {
                    PushlyServerFirebase.closeChildWindow("close");
                }
            });
    }
} 