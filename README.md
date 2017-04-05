[![NPM version](https://img.shields.io/npm/v/esri-wab-build.svg)](https://www.npmjs.com/package/esri-wab-build) [![NPM total download](https://img.shields.io/npm/dt/esri-wab-build.svg)](https://www.npmjs.com/package/esri-wab-build) [![dependencies](https://david-dm.org/gbochenek/esri-wab-build.svg)](https://david-dm.org/gbochenek/esri-wab-build) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# esri-wab-build
Package used to build ESRI Web App Builder (2.3) Apps for production.

This task runs a full dojo build on any web app builder application, which will greatly improve performance.

Based largely around the scripts built by Junshan Liu (@qlqllu) at https://geonet.esri.com/docs/DOC-7934

## Requirements:
* Bower (validated with 1.8.0)
* Nodejs (validated with 6.9.4)
* Java 7 or greater
* Git

## To run:
1. ```npm install -g esri-wab-build bower```
2. navigate to the application to be built
3. ```esri-wab-build```

The build output will be located in buildOut\app and compressed in buildOut\app.zip
