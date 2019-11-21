
/**
 * @class ClientInfo
 */
export default class ClientInfo {

  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * To check whether the service worker file is included in user domain or not
   * @param {callback} success 
   * @param {callback} failure 
   */
  detectFirebase(success, failure) {
    // if (!(window.location.protocol == 'https:')) {
    //   return failure();
    // }
    var url = (window.location.origin == `${window._pushGlobal.pushlyCloudUrl}`) ? window.location.origin + '/pushly/firebase-messaging-sw.js' : window.location.origin + '/firebase-messaging-sw.js'
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");// Code for IE6, IE5
    request.open('GET', url, false);
    request.send(); // There will be a 'pause' here until the response to come. The object request will be actually modified

    if (request.status === 200) {
      return success();
    }
    return failure();
  }
}
