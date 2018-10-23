[![NPM version](https://img.shields.io/npm/v/esri-wab-build.svg)](https://www.npmjs.com/package/esri-wab-build) [![NPM total download](https://img.shields.io/npm/dt/esri-wab-build.svg)](https://www.npmjs.com/package/esri-wab-build) [![dependencies](https://david-dm.org/gbochenek/esri-wab-build.svg)](https://david-dm.org/gbochenek/esri-wab-build) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# esri-wab-build
Package used to build ESRI Web App Builder Apps for production.

Verified and designed for 2D Apps built using Web App Builder for Developers 2.3 - 2.7.

This task runs a full dojo build on any web app builder application, which will greatly improve performance.

Based largely around the scripts built by Junshan Liu (@qlqllu) at https://geonet.esri.com/docs/DOC-7934

## Requirements:
* Bower (validated with 1.8.0)
  installation : `npm install -g bower`
* Nodejs (validated with 6.9.4)
* Java 7 or greater
* Git

## Warning
If you see an error around dojo-themes, run: ```bower cache clear``` and try again.

## Install and run locally:

### Setup
1. Navigate to the application to be built
2. Create a project.json file (if one does not exist): ```npm init```
3. ```npm install --save-dev esri-wab-build```
4. Add the following to your package.json's scripts object ```"build": "esri-wab-build"``` (Note: an optional parameter can be added to build a remote web app builder app.  For Example:  ```"esri-wab-build C:\arcgis-web-appbuilder-2.7\WebAppBuilderForArcGIS\server\apps\3"```)
5. Any user that downloads your application will now be able to build:

### Build
1. ```npm install```
2. ```npm run build```

The build output will be located in buildOut\app and compressed in buildOut\app.zip

## Install  and run globally:
1. ```npm install -g esri-wab-build```
2. ```esri-wab-build <location-of-app>```

The build output will be located in dist\buildOut\app and compressed in dist\buildOut\app.zip

## Scripting
This tool can be used as a library with the following functions:

* ```remoteBuild.buildApp(buildPath)```
  * Export and build the Web App Builder Application located at ```buildPath``` into a dist directory
  * Note: ```buildPath``` can be an application located in ```<web-app-builder-home>/server/apps/#```
  * Note: this function returns a promise that will provide the outputPath and outputZipPath when the build process is complete.
* ```buildTool.buildApp(buildPath)```
  *  Build the Web App Builder Application located at ```buildPath```
  * Note: this function returns a promise that will provide the outputPath and outputZipPath when the build process is complete.
* ```exportUtils.exportApp(buildPath)```
  * Export the Web App Builder Application located at ```buildPath``` to a dist directory.
  * Note: ```buildPath``` can be an application located in ```<web-app-builder-home>/server/apps/#```
