
/**
 * @class PushlyServerFirebase
 */
export default class PushlyServerFirebase {
    /**
     * @constructor
     */
    constructor() {

    }

    /**
     * Initialization method
     * @param {Object} scope 
     */
    init(scope = PushlyServerFirebase) {
        if (!((window.localStorage.getItem('_scb')) && (window.sessionStorage.getItem('_scb')))) {
            scope.getPushlySideApproval();
        }
    }

    /**
     * To show popup to get pushly side approval from the user when service worker file is not present in user domain
     */
    static getPushlySideApproval() {
        var c = `<div style="background: #333; position: fixed;left:69px; width: 16%;"><div style="margin: 0 auto; width: 70%; color: #f0f0f0; padding: 15px;"><img src="https://pushly.s3.ap-south-1.amazonaws.com/pushly-logo+copy.png" style="width:62px;float:left;"><p style="font-size: small;">
        Welcome to pushly
       </p> <a id = "_push_banner_allow" style="background: #ccc; color: #333; text-decoration: none; padding: 0px 10px; border-radius: 3px; display: inline-block; border: 1px solid #aaa; border-bottom: 2px solid #aaa; cursor: pointer;">
       Allow
       </a> &nbsp; <a id = "_push_banner_deny" style="background: #ccc; color: #333; text-decoration: none; padding: 0px 10px; border-radius: 3px; display: inline-block; border: 1px solid #aaa; border-bottom: 2px solid #aaa; cursor: pointer;">
       Decline</a><p style="font-size: small;">pushly wants to send notifications</p></div></div>`;

        var b = document.getElementsByTagName("BODY")[0];
        var a = document.createElement("div");
        a.setAttribute("id", "myConsent");
        a.setAttribute("style", "z-index: 10; overflow-x: overlay; overflow-y: overlay; top: 0; position: absolute; left: 0;");
        b.appendChild(a);
        document.getElementById("myConsent").innerHTML = c;
        var instance = PushlyServerFirebase;
        document.getElementById("_push_banner_allow").addEventListener("click", function () {
            instance.isPushPermissionGranted(true);
            document.getElementById("myConsent").style.display = "none";
        });
        document.getElementById("_push_banner_deny").addEventListener("click", function () {
            instance.isPushPermissionGranted(false);
            document.getElementById("myConsent").style.display = "none";
        });
    }

    /**
     * To return permission status
     * @param {Boolean} status true or false
     */
    static isPushPermissionGranted(status) {
        return PushlyServerFirebase.checkPermissionStatus(status)
    }

    /**
     * To check permission status
     * @param {Boolean} status 
     */
    static checkPermissionStatus(status) {
        if (status) {
            window.localStorage.setItem('_scb', 1);
            return PushlyServerFirebase.openChildWindow();
        }
        return PushlyServerFirebase.setDenySession();
    }

    /**
     * Open child window to include sw file
     */
    static openChildWindow() {
        window._pushchildWindow = window.open("https://pushly.500apps.com/pushly/sw/" + window._push.apiKey, "Ratting", "width=550,height=500,left=150,top=200,toolbar=0,status=0,")
    }

    /**
     * Close child window
     * @param {String} message 
     */
    static closeChildWindow(message) {
        if (message == 'close') {
            window.close();
        }
    }

    /**
     * To set session storage when user deny permission
     */
    static setDenySession() {
        window.sessionStorage.setItem('_scb', 1);
    }
}