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

        // Get website info
        this.getWebsiteDetails();

        //Initialize firebase
        var pushlyFirebase = new PushlyFirebase();
        var pushlyServerFirebase = new PushlyServerFirebase();
        this.clientInfo.detectFirebase(pushlyFirebase.init, pushlyServerFirebase.init)
    }

    /**
  * To get the user domain details
  * @param {Object} scope Current instance
  */
    getWebsiteDetails(scope = this) {
        fetch(`https://pushly.500apps.com/pushly/get/website?where=id=${window._push.websiteId}`, { method: 'GET' })
            .then(response => response.json())
            .then(function (response) {
                scope.websiteDetails.domain_id = response[0].domain_id;
                scope.websiteDetails.created_by = response[0].created_by;
                scope.websiteDetails.website_id = response[0].website_id;
                scope.websiteDetails.welcome_message = JSON.parse(response[0].welcome_message);
            })
            .catch(error => {
                console.log('Error:', error);
            });
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
            this.clientInfo.getIpAddress();
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
            "domain_id": this.websiteDetails.domain_id,
            "created_by": this.websiteDetails.created_by,
            "website_id": this.websiteDetails.website_id,
            "nVersion": this.visitor_info.nVersion,
            "nAgent": this.visitor_info.nAgent,
            "browserName": this.visitor_info.browser,
            "browser_version": this.visitor_info.version,
            "majorVersion": this.visitor_info.majorVersion,
            "operating_system": this.visitor_info.OS,
            "device_type": this.visitor_info.deviceType,
            "ipAddress": window._push.ip,
            "subscription": token
        }
        fetch('https://pushly.500apps.com/pushly/get/browserdata', {
            method: "post",
            headers: {
                Accept: "application/json",
            },
            body: JSON.stringify(details)
        })
            // .then(response => response.json())
            .catch(error => {
                console.log('Error:', error);
            });
        // Close child window if open    
        if (window.location.origin == 'https://pushly.500apps.com') {
            PushlyServerFirebase.closeChildWindow("close");
        }
    }
}
(() => { window._Pushly = new Pushly() })();

