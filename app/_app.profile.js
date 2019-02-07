profile = {
  // relative to this file
  basePath: ".",
  releaseDir: "../buildOutput",
  action: "release",
  version: "1.0.0",
  releaseName: "app-packages",
  optimize: "closure", // requires Java 6 or later: http://code.google.com/p/closure-compiler/wiki/FAQ
  useSourceMaps: false,
  layerOptimize: "closure",
  optimizeOptions: {
    languageIn: "ECMASCRIPT6",
    languageOut: "ECMASCRIPT5"
  },
  cssOptimize: "comments",
  copyTests: false,
  internStrings: true,
  mini: true,

  localeList:
    "ar,cs,da,de,en,el,es,et,fi,fr,he,it,ja,ko,lt,lv,nb,nl,pl,pt-br,pt-pt,ro,ru,sv,th,tr,zh-cn,vi",

  selectorEngine: "acme",
  stripConsole: "none",

  map: {
    "*": {
      "dojox/dgauges": "dgauges"
    }
  },

  packages: [
    {
      name: "dojo",
      location: "./dojo"
    },
    {
      name: "dijit",
      location: "./dijit"
    },
    {
      name: "dojox",
      location: "./dojox"
    },
    {
      name: "dgauges",
      location: "./dgauges"
    },
    {
      name: "put-selector",
      location: "./put-selector"
    },
    {
      name: "xstyle",
      location: "./xstyle"
    },
    {
      name: "dgrid",
      location: "./dgrid"
    },
    {
      name: "dgrid1",
      location: "./dgrid1"
    },
    {
      name: "dstore",
      location: "./dstore"
    },
    {
      name: "moment",
      location: "./moment"
    },
    {
      name: "esri",
      location: "./esri"
    },
    {
      name: "jimu",
      location: "./jimu.js"
    },
    {
      name: "widgets",
      location: "./widgets"
    },
    {
      name: "themes",
      location: "./themes"
    },
    {
      name: "libs",
      location: "./libs"
    },
    {
      name: "dynamic-modules",
      location: "./dynamic-modules"
    }
  ],

  layers: {
    "dojo/dojo": {
      boot: true,
      customBase: false,
      include: [
        "esri/jsapi",
        "esri/layers/unitBezier",
        "esri/SnappingManager",
        "dojox/gfx/path",
        "dojox/gfx/svg",
        "dojox/gfx/filters",
        "dojox/gfx/svgext",
        "dojox/gfx/shape",
        "esri/dijit/Attribution",
        "esri/IdentityManager",
        "dojox/xml/parser",
        "xstyle/core/load-css",
        "dgrid/TouchScroll",
        "dgrid/util/touch",
        "dgrid/util/has-css3",
        "dojo/selector/lite"
      ]
    },
    "esri/layers/VectorTileLayerImpl": {
      include: ["esri/layers/VectorTileLayerImpl"],
      includeLocales: ["en-us"]
    },
    "esri/layers/support/webglDeps": {
      include: ["esri/layers/support/webglDeps"],
      includeLocales: ["en-us"]
    },

    "esri/layers/support/pbfDeps": {
      include: ["esri/layers/support/pbfDeps"],
      includeLocales: ["en-us"]
    },
    "esri/layers/rasterLib/tile/RasterWorker": {
      include: ["esri/layers/rasterLib/tile/RasterWorker"],
      includeLocales: ["en-us"]
    },
    "dynamic-modules/preload": {
      include: []
    },
    "dynamic-modules/postload": {
      include: []
    },
    "jimu/main": {
      include: [
        "jimu/BaseWidget",
        "jimu/BaseWidgetFrame",
        "jimu/BaseWidgetPanel",
        "jimu/WidgetPlaceholder",
        "jimu/OnScreenWidgetIcon",
        "jimu/OnScreenWidgetPanel",
        "jimu/BaseWidgetSetting",
        "jimu/symbolUtils",
        "jimu/filterUtils",
        "jimu/utils",
        "jimu/portalUrlUtils",
        "jimu/portalUtils",
        "jimu/tokenUtils",
        "jimu/ConfigManager",
        "jimu/WidgetManager",
        "jimu/PanelManager",
        "jimu/DataManager",
        "jimu/DataSourceManager",
        "jimu/LayoutManager",
        "jimu/PoolControllerMixin",
        "jimu/SpatialReference/utils",
        "jimu/LayerInfos/LayerInfos",
        "jimu/dijit-all",
        "jimu/LayerInfos/LayerInfoForCollection",
        "jimu/LayerInfos/LayerInfoForMapService",
        "jimu/LayerInfos/LayerInfoForKML",
        "jimu/LayerInfos/LayerInfoForGeoRSS",
        "jimu/LayerInfos/LayerInfoForDefault",
        "jimu/LayerInfos/LayerInfoForWMS",
        "jimu/LayerInfos/LayerInfoForGroup",
        "jimu/LayerInfos/LayerInfoForDefaultDynamic",
        "jimu/LayerInfos/LayerInfoForDefaultTile",
        "jimu/LayerInfos/LayerInfoForDefaultWMS",
        "jimu/LayerInfos/LayerInfoForDefaultTable",
        "jimu/LayerInfos/LayerInfoForDefaultImage",
        "jimu/LayerInfos/LayerInfoForDefaultStream"
      ],
      exclude: ["esri/main", "libs/main"]
    },
    "jimu/dijit-all": {
      include: [
        "jimu/dijit/LoadingIndicator",
        "jimu/dijit/LoadingShelter",
        "jimu/dijit/Message",
        "jimu/dijit/Popup",
        "jimu/dijit/RadioBtn",
        "jimu/dijit/CheckBox",
        "jimu/dijit/SymbolChooser",
        "jimu/dijit/Search",
        "jimu/dijit/ServiceURLInput",
        "jimu/dijit/SimpleTable",
        "jimu/dijit/TabContainer",
        "jimu/dijit/ColorPicker",
        "jimu/dijit/TabContainer3",
        "jimu/dijit/TileLayoutContainer",
        "jimu/dijit/DrawBox",
        "jimu/dijit/URLInput",
        "jimu/dijit/GridLayout"
      ],
      exclude: ["esri/main", "libs/main"],
      discard: true
    },
    "libs/main": {},
    "esri/main": { include: ["esri/jsapi"] },
    "dgrid/main": {
      include: [
        "dgrid/OnDemandGrid",
        "dgrid/List",
        "dgrid/util/misc",
        "dgrid/OnDemandList"
      ]
    },

    //xstyle include put-selector
    "xstyle/main": { include: ["xstyle/main"] }
  },

  // since this build it intended to be utilized with properly-expressed AMD modules;
  // don't insert absolute module ids into the modules
  insertAbsMids: 0,

  // these are all the has feature that affect the loader and/or the bootstrap
  // the settings below are optimized for the smallest AMD loader that is configurable
  // and include dom-ready support
  staticHasFeatures: {
    "config-deferredInstrumentation": 0,
    "config-dojo-loader-catches": 0,
    "config-tlmSiblingOfDojo": 0,
    "dojo-amd-factory-scan": 0,
    "dojo-combo-api": 0,
    "dojo-config-api": 1,
    "dojo-config-require": 0,
    "dojo-debug-messages": 0,
    "dojo-dom-ready-api": 1,
    "dojo-firebug": 0,
    "dojo-guarantee-console": 1,
    "dojo-has-api": 1,
    "dojo-inject-api": 1,
    "dojo-loader": 1,
    "dojo-log-api": 0,
    "dojo-modulePaths": 0,
    "dojo-moduleUrl": 0,
    "dojo-publish-privates": 0,
    "dojo-requirejs-api": 0,
    "dojo-sniff": 1,
    "dojo-sync-loader": 0,
    "dojo-test-sniff": 0,
    "dojo-timeout-api": 0,
    "dojo-trace-api": 0,
    "dojo-undef-api": 0,
    "dojo-v1x-i18n-Api": 1, // we still need i18n.getLocalization
    "dojo-xhr-factory": 0,
    dom: -1,
    "host-browser": 1,
    "extend-dojo": 1,
    "extend-esri": 0
  }
};
