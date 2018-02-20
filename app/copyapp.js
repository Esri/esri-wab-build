var fs = require("fs");
var path = require("path");
var fse = require("fs-extra");
var utilscripts = require("./utilscripts");

/*global __dirname */
var options = {};

exports.copy = function(pathInfo, _options) {
  const appPackagePath = pathInfo.appPackagePath;
  const appOutputPath = pathInfo.appOutputPath;
  const buildRoot = pathInfo.buildRoot;

  options = _options || {};
  if (fs.existsSync(appOutputPath)) {
    console.log("remove", appOutputPath);
    fse.removeSync(appOutputPath);
  }

  if (!options.keepsource) {
    utilscripts.cleanUncompressedSource(appPackagePath);
  }

  fse.mkdirsSync(appOutputPath);
  fs.mkdirSync(path.join(appOutputPath, "jimu.js"));
  fs.mkdirSync(path.join(appOutputPath, "arcgis-js-api"));

  utilscripts.copyPartAppSrc(buildRoot, appOutputPath);

  utilscripts.copyAppBuildPackages(appPackagePath, appOutputPath, options);

  utilscripts.docopy(
    path.join(appPackagePath, "build-report.txt"),
    path.join(appOutputPath, "build-report.txt")
  );
};
