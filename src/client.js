
/**
 * @class ClientInfo
 */
export default class ClientInfo {

  /**
   * @constructor
   */
  constructor() {
    this._pushly_website_id = window._push.websiteId;
    this.dataBrowser = [{
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    }, {
      string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    }, {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    }, {
      prop: window.opera,
      identity: "Opera"
    }, {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    }, {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    }, {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    }, {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    }, { // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    }, {
      // For IE11
      string: navigator.userAgent,
      match: /Trident.*rv[ :]*11\./,
      identity: "Explorer"
    }, {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
    }, {
      string: navigator.userAgent,
      match: /Mobile Safari\/([\d.]+)/,
      identity: "Mobile Safari",
      versionSearch: "/AppleWebKit\/([\d.]+)/",
    }, {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    }, { // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }];
    this.dataOS = [{
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    }, {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    }, {
      string: navigator.userAgent,
      match: /Android\s([0-9\.]*)/,
      subString: "Android",
      identity: "Android"
    }, {
      string: navigator.userAgent,
      subString: "iPhone",
      identity: "iPhone/iPod"
    }, {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }

    ]
  }

  /**
     * Get visitor information
     */
  getVistorInfo() {
    var visitor_info = {};
    visitor_info.browser = this.searchString(this.dataBrowser)
      || "An unknown browser";
    visitor_info.version = this.searchVersion(navigator.userAgent)
      || this.searchVersion(navigator.appVersion)
      || this.searchMobileVersion(navigator.userAgent)
      || "An unknown version";
    visitor_info.nVersion = navigator.appVersion;
    visitor_info.nAgent = navigator.userAgent;
    visitor_info.majorVersion = visitor_info.version;
    visitor_info.OS = this.searchString(this.dataOS) || "An unknown OS";
    visitor_info.device_type = this.getPlatformType();
    console.log(visitor_info);
    return visitor_info
  }

  /**
   * Get browser version of all browsers except safari
   * @param {String} dataString 
   */
  searchVersion(dataString) {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1)
      return;
    return parseFloat(dataString.substring(index
      + this.versionSearchString.length + 1));
  }

  /**
   * Get browser and OS
   * @param {Object} data 
   */
  searchString(data) {
    for (var i = 0; i < data.length; i++) {
      var dataString = data[i].string;
      var dataProp = data[i].prop;
      var match = data[i].match;
      this.versionSearchString = data[i].versionSearch
        || data[i].identity;

      if (match && dataString.match(match))
        return data[i].identity;

      if (dataString) {
        if (dataString.indexOf(data[i].subString) != -1)
          return data[i].identity;
      } else if (dataProp)
        return data[i].identity;
    }
  }

  /**
   * Get version of safari browser
   * @param {String} dataString 
   */
  searchMobileVersion(dataString) {

    try {
      match = dataString.match(/Mobile Safari\/([\d.]+)/);
      if (match)
        return parseFloat(match[1]);
    } catch (e) {
    }

  }

  /**
   * To get the user device type
   */
  getPlatformType() {
    let device_type = '';
    if (navigator.userAgent.match(/mobile/i)) {
      return device_type = 'Mobile';
    } else if (navigator.userAgent.match(/iPad|Android|Touch/i)) {
      return device_type = 'Tablet';
    } else {
      return device_type = 'Desktop';
    }
  }

  /**
  * To get the ip address of the user
  */
  getIpAddress() {
    fetch('https://jsonip.com', { method: 'GET' })
      .then(response => response.json())
      .then(function (response) {
        window._push.ip = response.ip;
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }

  /**
   * To check whether the service worker file is included in user domain or not
   * @param {callback} success 
   * @param {callback} failure 
   */
  detectFirebase(success, failure) {
    if (!((window.location.protocol == 'https:') || (window.location.href == 'http://localhost:3333/'))) {
      return failure();
    }
    var url = window.location.origin + window.location.pathname + 'firebase-messaging-sw.js'
    var request = (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");// code for IE6, IE5
    request.open('GET', url, false);
    request.send(); // there will be a 'pause' here until the response to come.
    // the object request will be actually modified

    if (request.status === 200) {
      debugger;
      return success();
    }
    return failure();
  }
}