import ClientInfo from './client.js';
import PushlyFirebase from './firebase.js';
import PushlyServerFirebase from './pushly-server-firebase.js';

/**
 * @class Pushly
 */
class Pushly {

    /**
     * @constructor
     */
    constructor() {
        this.visitor_info = {};
        this.websiteDetails = {};
        this.clientInfo = {};
        this.init();
    }

    /**
     * Intialization method (starting point)
     */
    init() {

        // Get client info
        this.clientInfo = new ClientInfo();
        this.visitor_info = this.clientInfo.getVistorInfo();

        //Initialize firebase
        var pushlyFirebase = new PushlyFirebase();
        var pushlyServerFirebase = new PushlyServerFirebase();
        this.clientInfo.detectFirebase(pushlyFirebase.init, pushlyServerFirebase.init)
    }


    /**
  * To set a flag in local storage when token is sent to server
  * set 1 in localstorage when token send to server
  * @param {Boolean} sent True or False
  */
    setTokenSentToServer(sent) {
        window.localStorage.setItem('sentToServer', sent ? '1' : '0');
    }

    /**
    * To send token to the server
    * @param {String} currentToken Firebase token
    */
    sendTokenToServer(currentToken) {
        if (!this.isTokenSentToServer()) {
            console.log('Sending token to server...');
            // TODO(developer): Send the current token to your server.
            this.setTokenSentToServer(true);
            this.storeToken(currentToken);
        } else {
            console.log('Token already sent to server so won\'t send it again ' +
                'unless it changes');
        }
    }

    /**
    * To check whether the token is sent to server or not
    * If sent, get flag from localstorage
    */
    isTokenSentToServer() {
        return window.localStorage.getItem('sentToServer') === '1';
    }

    /**
     * To store user website details and token
     * @param {String} ipAddress User ip address
     * @param {String} token Firebase token
     */
    storeToken(token) {
        let details = {
            "api_key": window._push.apiKey,
            "nVersion": this.visitor_info.nVersion,
            "nAgent": this.visitor_info.nAgent,
            "browserName": this.visitor_info.browser,
            "browser_version": this.visitor_info.version,
            "majorVersion": this.visitor_info.majorVersion,
            "operating_system": this.visitor_info.OS,
            "device_type": this.visitor_info.deviceType,
            "subscription": token
        }
        fetch('https://pushly.500apps.com/pushly/get/browserdata', {
            method: "post",
            headers: {
                Accept: "application/json",
            },
            body: JSON.stringify(details)
        })
            .then((response) => {
                // Close child window if open    
                if (window.location.origin == 'https://pushly.500apps.com') {
                    PushlyServerFirebase.closeChildWindow("close");
                }
            })
            .catch(error => {
                console.log('Error:', error);
                // Close child window if open    
                if (window.location.origin == 'https://pushly.500apps.com') {
                    PushlyServerFirebase.closeChildWindow("close");
                }
            });
    }
}
(() => { window._Pushly = new Pushly() })();

