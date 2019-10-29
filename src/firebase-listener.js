importScripts("https://www.gstatic.com/firebasejs/6.4.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/6.4.2/firebase-messaging.js");

/**
 * @class PushlyFirebaseListener
 */
class PushlyFirebaseListener {

  /**
   * @constructor
   */
  constructor() {
    this.flow_id = 0;
    this.message_id = 0;
    this.exe_msg_id = 0;
    this.domain_id = 0;
    this.website_id = 0;
    this.subscription_object = {};
    this.url = '';
    this.launch_url = '';
  }

  /**
   * Initialization method
   */
  init() {
    /**
 * To listen the messages pushed from service worker
 */

    self.addEventListener('push', function (event) {
      console.log('[Service Worker] Push Received.');
      console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
      var message = JSON.parse(event.data.text());
      console.log('message object: ' + message);
      //if(message.data.url) url = message.data.url;
      flow_id = message.data.flow_id;
      message_id = message.data.message_id;
      domain_id = message.data.domain_id;
      website_id = message.data.website_id;
      subscription_object = message.data.subscription_object;
      launch_url = message.data.launch_url;

      var obj = JSON.parse(message.data.notification);
      console.log('object: ' + obj);
      const title = obj.title;
      const options = {
        body: obj.body,
        icon: obj.icon,
      };
      if (message.data.action_button) {
        options["actions"] = JSON.parse(message.data.action_button)
      }

      event.waitUntil(self.registration.showNotification(title, options));
    });

    /**
     * To listen when user clicks on notification
     */

    self.addEventListener('notificationclose', (event) => {
      const clickedNotification = event.notification;
      console.log('on event click' + event.notification);
      if (message_id != exe_msg_id) {
        saveUserAction("close");
      }
    });

    /**
     * To listen when user closes notification
     */

    self.addEventListener('notificationclick', function (event) {
      if (event.action) {
        url = event.action;
        clients.openWindow(event.action)
      } else {
        url = launch_url;
        clients.openWindow(launch_url)
      }

      exe_msg_id = message_id;
      const clickedNotification = event.notification;
      console.log('on event click' + event.notification);
      PushlyFirebaseListener.saveUserAction("executed");

    });
  }

  /**
 * To make a network call and store messages in database
 */

  static saveUserAction = function (action_text) {
    const messagelog = {
      url: url,
      excutionText: action_text,
      messageId: message_id,
      flowId: flow_id,
      domainId: domain_id,
      websiteId: website_id,
      subscriptionObject: subscription_object
    }
    fetch("https://pushly.500apps.com/pushly/messagelog", {
      method: "post",
      headers: {
        Accept: "application/json",
        //content-type: "application/json"
      },
      body: JSON.stringify(messagelog),
    })
  }
}
(() => {
  var _pushlyFirebaseListener = new PushlyFirebaseListener()
  _pushlyFirebaseListener.init();
})();