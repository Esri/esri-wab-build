exports.fakeEnv = `///////////////////////////////////////////////////////////////////////////
// Copyright ? 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

//****************************************************************
//The main function of the env.js is to initialize apiUrl and path
//****************************************************************

/* jshint unused: false */

/********************************
Global variables:
  isXT: XT builder or not. This variable is set by builder node server.
  isBuilder: is builder or app. This flag is used to distinguish the build and app in jimu.js
  isRunInPortal: whether the app/builder is in portal or not.
  builderNls: the builder nls bundle
  portalUrl: the portal url
  configWindow: in builder only, the config app window object
  previewWindow: in builder only, the preview app window object
  setConfigViewerTopic: in builder only, used to communicate between builder and config window
  setPreviewViewerTopic: in builder only, used to communicate between builder and preview window
  appId: in builder only, the current opened app id.

  apiUrl: the URL of the ArcGIS API for JavaScript
  allCookies: all cookies
  path: the builder/app path section in window.location
  appPath: the app's path. In app, it's the same with path; In builder, it's not.
  queryObject: the query parameters
  jimuNls: the jimu nls bundle
  isRTL: the language is right to left,
  wabVersion: the wab version, like 1.1, 1.2
  productVersion: the product version, like portal10.3, online3.5, developer edition1.0

  dojoConfig: the dojo config object
  jimuConfig: defined in jimu/main

  weinreUrl: for mobile debug
  debug: boolean. If it's debug mode, the app will load weinre file

Global functions:
  loadResource: load JS or CSS
  loadResources: load array of JS or CSS
  testLoad: load JS/CSS by condition
  loadingCallback: the resources loaded callback
*******************************/
/*global testLoad, ActiveXObject */
var
  //    the URL of the ArcGIS API for JavaScript, you can change it to point to your own API.
  apiUrl = null,

  //weinreUrl: String
  //    weinre is a tool which can help debug the app on mobile devices.
  //    Please see: http://people.apache.org/~pmuellr/weinre/docs/latest/Home.html
  weinreUrl = '//launch.chn.esri.com:8081/target/target-script-min.js',

  //debug: Boolean
  //    If it's debug mode, the app will load weinre file
  debug = false,

  //deprecated, use appInfo.appPath instead
  path = null,

  isXT = false,

  allCookies,

  verboseLog = true,

  //This version number will be appended to URL to avoid cache.
  //The reason we do not use wabVersion is to avoid force user to change wabVersion when they are customizing app.
  deployVersion = '2.7';

// console.time('before map');

/////Builder server will remove this line's comment, so set isXT flag to true

//isXT = true;

/////////////////////////////////////


/////Build scripts will uncomment this line to disable verboseLog.

//verboseLog = false;

/////////////////////////////////////

(function(global){
  //init API URL
  var queryObject = getQueryObject();
  var apiVersion = '3.23';

  ////////uncomment the following line when downloading the app

  //apiUrl = 'https://js.arcgis.com/3.23';

  //////////////////////////////////////////////////////////////
  allCookies = getAllCookies();
  window.appInfo = {isRunInPortal: !isXT};
  if (!apiUrl) {
    if (queryObject.apiurl) {
      if(!checkApiUrl(queryObject.apiurl)){
        console.error('?apiurl must point to an ULR that is in the app or in esri.com/arcgis.com domain.');
        return;
      }
      apiUrl = queryObject.apiurl;
    } else if (isXT) {
      apiUrl = 'https://jsdev.arcgis.com/' + apiVersion;
    } else {
      var portalUrl = getPortalUrlFromLocation();
      if (portalUrl.indexOf('arcgis.com') > -1) {
        if(portalUrl.indexOf('devext.arcgis.com') > -1){
          apiUrl = '//jsdev.arcgis.com/' + apiVersion;
        }else if(portalUrl.indexOf('qa.arcgis.com') > -1){
          apiUrl = '//jsqa.arcgis.com/' + apiVersion;
        }else{
          apiUrl = '//js.arcgis.com/' + apiVersion;
        }

        // apiUrl = 'https://js.arcgis.com/' + apiVersion;
      } else {
        apiUrl = portalUrl + 'jsapi/jsapi/';
      }
    }
  }

  if (apiUrl.substr(apiUrl.length - 1, apiUrl.length) !== '/') {
    apiUrl = apiUrl + '/';
  }

  path = getPath();

  function getAllCookies(){
    var strAllCookie = document.cookie;
    var cookies = {};
    if (strAllCookie) {
      var strCookies = strAllCookie.split(';');
      for(var i = 0; i < strCookies.length; i++){
        var splits = strCookies[i].split('=');
        if(splits && splits.length > 1){
          cookies[splits[0].replace(/^\s+|\s+$/gm, '')] = splits[1];
        }
      }
    }
    return cookies;
  }

  function checkApiUrl(url){
    if(/^\/\//.test(url) || /^https?:\/\//.test(url)){
      return /(?:[\w\-\_]+\.)+(?:esri|arcgis)\.com/.test(url); //api url must be in esri.com or arcgis.com
    }else{
      return true;
    }
  }

  function getPortalUrlFromLocation(){
    var portalUrl = getPortalServerFromLocation() +  getDeployContextFromLocation();
    return portalUrl;
  }

  function getPortalServerFromLocation(){
    var server = window.location.protocol + '//' + window.location.host;
    return server;
  }

  function getDeployContextFromLocation (){
    var keyIndex = window.location.href.indexOf("/home");
    if(keyIndex < 0){
      keyIndex = window.location.href.indexOf("/apps");
    }
    var context = window.location.href.substring(window.location.href.indexOf(
      window.location.host) + window.location.host.length + 1, keyIndex);
    if (context !== "/") {
      context = "/" + context + "/";
    }
    return context;
  }

  function getPath() {
    var fullPath, path;

    fullPath = window.location.pathname;
    if (fullPath === '/' || fullPath.substr(fullPath.length - 1) === '/') {
      path = fullPath;
    }else{
      var sections = fullPath.split('/');
      var lastSection = sections.pop();
      if (/\.html$/.test(lastSection) || /\.aspx$/.test(lastSection) ||
         /\.jsp$/.test(lastSection) || /\.php$/.test(lastSection)) {
        //index.html may be renamed to index.jsp, etc.
        path = sections.join('/') + '/';
      } else {
        return false;
      }
    }
    return path;
  }

  function getQueryObject(){
    var query = window.location.search;
    if (query.indexOf('?') > -1) {
      query = query.substr(1);
    }
    var pairs = query.split('&');
    var queryObject = {};
    for(var i = 0; i < pairs.length; i++){
      var splits = decodeURIComponent(pairs[i]).split('=');
      queryObject[splits[0]] = splits[1];
    }
    return queryObject;
  }
  function _loadPolyfills(prePath, cb) {
    prePath = prePath || "";
    var ap = Array.prototype,
      fp = Function.prototype,
      sp = String.prototype,
      loaded = 0,
      completeCb = function() {
        loaded++;
        if (loaded === tests.length) {
          cb();
        }
      },
      tests = [{
        test: window.console,
        failure: prePath + "libs/polyfills/console.js",
        callback: completeCb
      }, {
        test: ap.indexOf && ap.lastIndexOf && ap.forEach && ap.every && ap.some &&
          ap.filter && ap.map && ap.reduce && ap.reduceRight,
        failure: prePath + "libs/polyfills/array.generics.js",
        callback: completeCb
      }, {
        test: fp.bind,
        failure: prePath + "libs/polyfills/bind.js",
        callback: completeCb
      }, {
        test: Date.now,
        failure: prePath + "libs/polyfills/now.js",
        callback: completeCb
      }, {
        test: sp.trim,
        failure: prePath + "libs/polyfills/trim.js",
        callback: completeCb
      }, {
        test: false,
        failure: prePath + "libs/polyfills/FileSaver.js",
        callback: completeCb
      }, {
        test: typeof Blob !== 'undefined',
        failure: prePath + "libs/polyfills/FileSaver.ie9.js",
        callback: completeCb
      }, {
        test: window.Blob,
        failure: prePath + "libs/polyfills/Blob.js",
        callback: completeCb
      }, {
        test: window.ArrayBuffer,
        failure: prePath + "libs/polyfills/typedarray.js",
        callback: completeCb
      }];

    for(var i = 0; i < tests.length; i++){
      testLoad(tests[i]);
    }
  }

  function localeIsSame(locale1, locale2){
    return locale1.split('-')[0] === locale2.split('-')[0];
  }

  function _setRTL(locale){
    var rtlLocales = ["ar", "he"];
    var dirNode = document.getElementsByTagName("html")[0];
    var isRTLLocale = false;
    for (var i = 0; i < rtlLocales.length; i++) {
      if (localeIsSame(rtlLocales[i], locale)) {
        isRTLLocale = true;
      }
    }

    if (isRTLLocale) {
      dirNode.setAttribute("dir", "rtl");
      dirNode.className += " esriRtl jimu-rtl";
      dirNode.className += " " + locale + " " +
        (locale.indexOf("-") !== -1 ? locale.split("-")[0] : "");
    }else {
      dirNode.setAttribute("dir", "ltr");
      dirNode.className += " esriLtr jimu-ltr";
      dirNode.className += " " + locale + " " +
        (locale.indexOf("-") !== -1 ? locale.split("-")[0] : "");
    }

    window.isRTL = isRTLLocale;
  }

  global._loadPolyfills = _loadPolyfills;
  global.queryObject = queryObject;
  global._setRTL = _setRTL;

  global.avoidRequireCache = function(require){
    var dojoInject = require.injectUrl;
    require.injectUrl = function(url, callback, owner){
      url = appendDeployVersion(url);
      dojoInject(url, callback, owner);
    };
  };

  global.avoidRequestCache = function (aspect, requestUtil){
    aspect.after(requestUtil, 'parseArgs', function(args){
      args.url = appendDeployVersion(args.url);
      return args;
    });
  };

  function appendDeployVersion(url){
    if(/^http(s)?:\/\//.test(url) || /^\/proxy\.js/.test(url) || /^\/\//.test(url)){
      return url;
    }
    if(url.indexOf('?') > -1){
      url = url + '&wab_dv=' + deployVersion;
    }else{
      url = url + '?wab_dv=' + deployVersion;
    }
    return url;
  }
})(window);`;

exports.envWithApiURL = `///////////////////////////////////////////////////////////////////////////
// Copyright ? 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

//****************************************************************
//The main function of the env.js is to initialize apiUrl and path
//****************************************************************

/* jshint unused: false */

/********************************
Global variables:
  isXT: XT builder or not. This variable is set by builder node server.
  isBuilder: is builder or app. This flag is used to distinguish the build and app in jimu.js
  isRunInPortal: whether the app/builder is in portal or not.
  builderNls: the builder nls bundle
  portalUrl: the portal url
  configWindow: in builder only, the config app window object
  previewWindow: in builder only, the preview app window object
  setConfigViewerTopic: in builder only, used to communicate between builder and config window
  setPreviewViewerTopic: in builder only, used to communicate between builder and preview window
  appId: in builder only, the current opened app id.

  apiUrl: the URL of the ArcGIS API for JavaScript
  allCookies: all cookies
  path: the builder/app path section in window.location
  appPath: the app's path. In app, it's the same with path; In builder, it's not.
  queryObject: the query parameters
  jimuNls: the jimu nls bundle
  isRTL: the language is right to left,
  wabVersion: the wab version, like 1.1, 1.2
  productVersion: the product version, like portal10.3, online3.5, developer edition1.0

  dojoConfig: the dojo config object
  jimuConfig: defined in jimu/main

  weinreUrl: for mobile debug
  debug: boolean. If it's debug mode, the app will load weinre file

Global functions:
  loadResource: load JS or CSS
  loadResources: load array of JS or CSS
  testLoad: load JS/CSS by condition
  loadingCallback: the resources loaded callback
*******************************/
/*global testLoad, ActiveXObject */
var
  //    the URL of the ArcGIS API for JavaScript, you can change it to point to your own API.
  apiUrl = null,

  //weinreUrl: String
  //    weinre is a tool which can help debug the app on mobile devices.
  //    Please see: http://people.apache.org/~pmuellr/weinre/docs/latest/Home.html
  weinreUrl = '//launch.chn.esri.com:8081/target/target-script-min.js',

  //debug: Boolean
  //    If it's debug mode, the app will load weinre file
  debug = false,

  //deprecated, use appInfo.appPath instead
  path = null,

  isXT = false,

  allCookies,

  verboseLog = true,

  //This version number will be appended to URL to avoid cache.
  //The reason we do not use wabVersion is to avoid force user to change wabVersion when they are customizing app.
  deployVersion = '2.7';

// console.time('before map');

/////Builder server will remove this line's comment, so set isXT flag to true

//isXT = true;

/////////////////////////////////////


/////Build scripts will uncomment this line to disable verboseLog.

//verboseLog = false;

/////////////////////////////////////

(function(global){
  //init API URL
  var queryObject = getQueryObject();
  var apiVersion = '3.23';

  ////////uncomment the following line when downloading the app

  apiUrl = 'https://js.arcgis.com/3.23';

  //////////////////////////////////////////////////////////////
  allCookies = getAllCookies();
  window.appInfo = {isRunInPortal: !isXT};
  if (!apiUrl) {
    if (queryObject.apiurl) {
      if(!checkApiUrl(queryObject.apiurl)){
        console.error('?apiurl must point to an ULR that is in the app or in esri.com/arcgis.com domain.');
        return;
      }
      apiUrl = queryObject.apiurl;
    } else if (isXT) {
      apiUrl = 'https://jsdev.arcgis.com/' + apiVersion;
    } else {
      var portalUrl = getPortalUrlFromLocation();
      if (portalUrl.indexOf('arcgis.com') > -1) {
        if(portalUrl.indexOf('devext.arcgis.com') > -1){
          apiUrl = '//jsdev.arcgis.com/' + apiVersion;
        }else if(portalUrl.indexOf('qa.arcgis.com') > -1){
          apiUrl = '//jsqa.arcgis.com/' + apiVersion;
        }else{
          apiUrl = '//js.arcgis.com/' + apiVersion;
        }

        // apiUrl = 'https://js.arcgis.com/' + apiVersion;
      } else {
        apiUrl = portalUrl + 'jsapi/jsapi/';
      }
    }
  }

  if (apiUrl.substr(apiUrl.length - 1, apiUrl.length) !== '/') {
    apiUrl = apiUrl + '/';
  }

  path = getPath();

  function getAllCookies(){
    var strAllCookie = document.cookie;
    var cookies = {};
    if (strAllCookie) {
      var strCookies = strAllCookie.split(';');
      for(var i = 0; i < strCookies.length; i++){
        var splits = strCookies[i].split('=');
        if(splits && splits.length > 1){
          cookies[splits[0].replace(/^\s+|\s+$/gm, '')] = splits[1];
        }
      }
    }
    return cookies;
  }

  function checkApiUrl(url){
    if(/^\/\//.test(url) || /^https?:\/\//.test(url)){
      return /(?:[\w\-\_]+\.)+(?:esri|arcgis)\.com/.test(url); //api url must be in esri.com or arcgis.com
    }else{
      return true;
    }
  }

  function getPortalUrlFromLocation(){
    var portalUrl = getPortalServerFromLocation() +  getDeployContextFromLocation();
    return portalUrl;
  }

  function getPortalServerFromLocation(){
    var server = window.location.protocol + '//' + window.location.host;
    return server;
  }

  function getDeployContextFromLocation (){
    var keyIndex = window.location.href.indexOf("/home");
    if(keyIndex < 0){
      keyIndex = window.location.href.indexOf("/apps");
    }
    var context = window.location.href.substring(window.location.href.indexOf(
      window.location.host) + window.location.host.length + 1, keyIndex);
    if (context !== "/") {
      context = "/" + context + "/";
    }
    return context;
  }

  function getPath() {
    var fullPath, path;

    fullPath = window.location.pathname;
    if (fullPath === '/' || fullPath.substr(fullPath.length - 1) === '/') {
      path = fullPath;
    }else{
      var sections = fullPath.split('/');
      var lastSection = sections.pop();
      if (/\.html$/.test(lastSection) || /\.aspx$/.test(lastSection) ||
         /\.jsp$/.test(lastSection) || /\.php$/.test(lastSection)) {
        //index.html may be renamed to index.jsp, etc.
        path = sections.join('/') + '/';
      } else {
        return false;
      }
    }
    return path;
  }

  function getQueryObject(){
    var query = window.location.search;
    if (query.indexOf('?') > -1) {
      query = query.substr(1);
    }
    var pairs = query.split('&');
    var queryObject = {};
    for(var i = 0; i < pairs.length; i++){
      var splits = decodeURIComponent(pairs[i]).split('=');
      queryObject[splits[0]] = splits[1];
    }
    return queryObject;
  }
  function _loadPolyfills(prePath, cb) {
    prePath = prePath || "";
    var ap = Array.prototype,
      fp = Function.prototype,
      sp = String.prototype,
      loaded = 0,
      completeCb = function() {
        loaded++;
        if (loaded === tests.length) {
          cb();
        }
      },
      tests = [{
        test: window.console,
        failure: prePath + "libs/polyfills/console.js",
        callback: completeCb
      }, {
        test: ap.indexOf && ap.lastIndexOf && ap.forEach && ap.every && ap.some &&
          ap.filter && ap.map && ap.reduce && ap.reduceRight,
        failure: prePath + "libs/polyfills/array.generics.js",
        callback: completeCb
      }, {
        test: fp.bind,
        failure: prePath + "libs/polyfills/bind.js",
        callback: completeCb
      }, {
        test: Date.now,
        failure: prePath + "libs/polyfills/now.js",
        callback: completeCb
      }, {
        test: sp.trim,
        failure: prePath + "libs/polyfills/trim.js",
        callback: completeCb
      }, {
        test: false,
        failure: prePath + "libs/polyfills/FileSaver.js",
        callback: completeCb
      }, {
        test: typeof Blob !== 'undefined',
        failure: prePath + "libs/polyfills/FileSaver.ie9.js",
        callback: completeCb
      }, {
        test: window.Blob,
        failure: prePath + "libs/polyfills/Blob.js",
        callback: completeCb
      }, {
        test: window.ArrayBuffer,
        failure: prePath + "libs/polyfills/typedarray.js",
        callback: completeCb
      }];

    for(var i = 0; i < tests.length; i++){
      testLoad(tests[i]);
    }
  }

  function localeIsSame(locale1, locale2){
    return locale1.split('-')[0] === locale2.split('-')[0];
  }

  function _setRTL(locale){
    var rtlLocales = ["ar", "he"];
    var dirNode = document.getElementsByTagName("html")[0];
    var isRTLLocale = false;
    for (var i = 0; i < rtlLocales.length; i++) {
      if (localeIsSame(rtlLocales[i], locale)) {
        isRTLLocale = true;
      }
    }

    if (isRTLLocale) {
      dirNode.setAttribute("dir", "rtl");
      dirNode.className += " esriRtl jimu-rtl";
      dirNode.className += " " + locale + " " +
        (locale.indexOf("-") !== -1 ? locale.split("-")[0] : "");
    }else {
      dirNode.setAttribute("dir", "ltr");
      dirNode.className += " esriLtr jimu-ltr";
      dirNode.className += " " + locale + " " +
        (locale.indexOf("-") !== -1 ? locale.split("-")[0] : "");
    }

    window.isRTL = isRTLLocale;
  }

  global._loadPolyfills = _loadPolyfills;
  global.queryObject = queryObject;
  global._setRTL = _setRTL;

  global.avoidRequireCache = function(require){
    var dojoInject = require.injectUrl;
    require.injectUrl = function(url, callback, owner){
      url = appendDeployVersion(url);
      dojoInject(url, callback, owner);
    };
  };

  global.avoidRequestCache = function (aspect, requestUtil){
    aspect.after(requestUtil, 'parseArgs', function(args){
      args.url = appendDeployVersion(args.url);
      return args;
    });
  };

  function appendDeployVersion(url){
    if(/^http(s)?:\/\//.test(url) || /^\/proxy\.js/.test(url) || /^\/\//.test(url)){
      return url;
    }
    if(url.indexOf('?') > -1){
      url = url + '&wab_dv=' + deployVersion;
    }else{
      url = url + '?wab_dv=' + deployVersion;
    }
    return url;
  }
})(window);`;

exports.fakeConfigObj = {
  theme: {
    name: "FoldableTheme",
    styles: [
      "default",
      "black",
      "blue",
      "cyan",
      "green",
      "purple",
      "red",
      "yellow"
    ],
    version: "2.7",
    sharedTheme: { isPortalSupport: true, useHeader: false, useLogo: false }
  },
  portalUrl: "http://myorg.maps.arcgis.com",
  appId: "",
  authorizedCrossOriginDomains: [],
  title: "Test App",
  subtitle: "with Web AppBuilder for ArcGIS",
  keepAppState: true,
  logo: "images/app-logo.png",
  geometryService:
    "https://utility.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer",
  links: [],
  widgetOnScreen: {
    widgets: [
      {
        uri: "themes/FoldableTheme/widgets/HeaderController/Widget",
        position: {
          left: 0,
          top: 0,
          right: 0,
          height: 40,
          relativeTo: "browser"
        },
        version: "2.7",
        id: "themes_FoldableTheme_widgets_HeaderController_Widget_1",
        name: "HeaderController"
      },
      {
        uri: "widgets/Scalebar/Widget",
        position: { left: 7, bottom: 25, relativeTo: "map" },
        version: "2.7",
        id: "widgets_Scalebar_Widget_2",
        name: "Scalebar"
      },
      {
        uri: "widgets/Search/Widget",
        position: { left: 55, top: 5, relativeTo: "map" },
        version: "2.7",
        id: "widgets_Search_Widget_3",
        name: "Search"
      },
      {
        uri: "widgets/Coordinate/Widget",
        position: { left: 7, bottom: 5, relativeTo: "map" },
        version: "2.7",
        id: "widgets_Coordinate_Widget_4",
        name: "Coordinate"
      },
      {
        position: { left: 55, top: 45, relativeTo: "map" },
        placeholderIndex: 1,
        id: "_5",
        name: "MyWidget",
        version: "0.0.1",
        closeable: true,
        IsController: false,
        uri: "widgets/MyWidget/Widget",
        config: "configs/MyWidget/config__5.json"
      },
      {
        position: { left: 105, top: 45, relativeTo: "map" },
        placeholderIndex: 1,
        id: "_6"
      },
      {
        position: { left: 155, top: 45, relativeTo: "map" },
        placeholderIndex: 2,
        id: "_7"
      },
      {
        position: { left: 205, top: 45, relativeTo: "map" },
        placeholderIndex: 3,
        id: "_8"
      },
      {
        position: { left: 255, top: 45, relativeTo: "map" },
        placeholderIndex: 4,
        id: "_9"
      },
      {
        uri: "widgets/OverviewMap/Widget",
        position: { bottom: 0, right: 0, zIndex: 1, relativeTo: "map" },
        version: "2.7",
        id: "widgets_OverviewMap_Widget_10",
        name: "OverviewMap"
      },
      {
        uri: "widgets/HomeButton/Widget",
        position: { left: 7, top: 75, relativeTo: "map" },
        version: "2.7",
        id: "widgets_HomeButton_Widget_11",
        name: "HomeButton"
      },
      {
        uri: "widgets/MyLocation/Widget",
        position: { left: 7, top: 110, relativeTo: "map" },
        version: "2.7",
        id: "widgets_MyLocation_Widget_12",
        name: "MyLocation"
      },
      {
        uri: "widgets/AttributeTable/Widget",
        position: { relativeTo: "browser" },
        version: "2.7",
        id: "widgets_AttributeTable_Widget_13",
        name: "AttributeTable"
      },
      {
        uri: "widgets/Splash/Widget",
        visible: false,
        position: { relativeTo: "browser" },
        version: "2.7",
        id: "widgets_Splash_Widget_14",
        name: "Splash"
      },
      {
        uri: "widgets/ZoomSlider/Widget",
        position: { top: 5, left: 7, relativeTo: "map" },
        version: "2.7",
        id: "widgets_ZoomSlider_Widget_15",
        name: "ZoomSlider"
      },
      {
        uri: "widgets/ExtentNavigate/Widget",
        visible: false,
        position: { top: 150, left: 7, relativeTo: "map" },
        id: "widgets_ExtentNavigate_Widget_16",
        name: "ExtentNavigate",
        version: "2.7"
      },
      {
        uri: "widgets/FullScreen/Widget",
        visible: false,
        position: { right: 8, top: 8, relativeTo: "map" },
        version: "2.7",
        id: "widgets_FullScreen_Widget_17",
        name: "FullScreen"
      }
    ],
    panel: { uri: "jimu/OnScreenWidgetPanel", position: { relativeTo: "map" } }
  },
  map: {
    "3D": false,
    "2D": true,
    position: { left: 0, top: 40, right: 0, bottom: 0 },
    itemId: "6e03e8c26aad4b9c92a87c1063ddb0e3",
    mapOptions: {
      extent: {
        type: "extent",
        xmin: -14999999.999998985,
        ymin: 2699999.999999806,
        xmax: -6199999.999999582,
        ymax: 6499999.999999402,
        spatialReference: { wkid: 102100 }
      }
    },
    id: "map",
    portalUrl: "http://myorg.maps.arcgis.com/"
  },
  widgetPool: {
    panel: {
      uri: "themes/FoldableTheme/panels/FoldablePanel/Panel",
      position: { top: 5, right: 5, bottom: 5, zIndex: 5, relativeTo: "map" }
    },
    widgets: [
      {
        uri: "widgets/Legend/Widget",
        version: "2.7",
        id: "widgets_Legend_Widget_18",
        name: "Legend",
        index: 0
      },
      {
        uri: "widgets/LayerList/Widget",
        version: "2.7",
        id: "widgets_LayerList_Widget_19",
        name: "LayerList",
        index: 1
      }
    ]
  },
  mobileLayout: {
    widgetOnScreen: {
      widgets: {
        "widgets/Scalebar/Widget": {
          position: { left: 7, bottom: 40 },
          version: "1.4"
        },
        "widgets/Coordinate/Widget": {
          position: { left: 7, bottom: 17 },
          version: "1.4"
        }
      }
    }
  },
  loadingPage: {
    backgroundColor: "#508dca",
    backgroundImage: { visible: false },
    loadingGif: {
      visible: true,
      uri: "configs/loading/images/predefined_loading_1.gif",
      width: 58,
      height: 29
    }
  },
  wabVersion: "2.7",
  isTemplateApp: true,
  isWebTier: false,
  httpProxy: { useProxy: true, url: "/proxy.js" },
  dataSource: { dataSources: {}, settings: {} }
};
