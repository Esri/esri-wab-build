# esri-wab-build
Package used to build ESRI Web App Builder (2.3) Apps for production.

This task runs a full dojo build on any web app builder application, which will greatly improve performance.

##Requirements:
* bower (validated with 1.8.0)
* nodejs (validated with 6.9.4)
* Java

Bower can be installed via:
npm install -g bower


##To run:
1. npm install -g esri-wab-build
2. navigate to the application to be built
3. esri-wab-build

The build output will be located in buildOut\app
