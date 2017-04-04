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
