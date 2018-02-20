// Tools to export WAB applications from the WAB Dev Edition Server directory

const fs = require("fs-extra");
const path = require("path");
const hjson = require("hjson");
const rimraf = require("rimraf");

/*******************
 *  exportApp
 *
 *  summary:
 *      Given the path to a WAB Dev Edition Server directory,
 *          this function will export that application into a new temp directory
 *          The application will be prepared to allow for use outside of the builder.
 *
 *  input:  (String) serverDir
 *              Directory containing and app within WAB Dev Edition
 *
 *  output: (String)
 *              Path to a new temp directory containing the WAB Application
 *
 *******************/
exports.exportApp = function(/*String*/ serverDir) {
  this._cleanDist();
  const tempDir = this._copyApp(serverDir);

  const envFileContents = fs.readFileSync(path.join(tempDir, "env.js"), {
    encoding: "utf-8"
  });
  const configFileContents = fs.readFileSync(
    path.join(tempDir, "config.json"),
    { encoding: "utf-8" }
  );

  const newEnvFile = this._replaceApiPath(envFileContents);
  const newConfigFileObj = this._replaceProxyConfig(
    hjson.parse(configFileContents)
  );

  fs.writeFileSync(`${tempDir}/env.js`, newEnvFile);
  fs.writeFileSync(`${tempDir}/config.json`, JSON.stringify(newConfigFileObj));

  return tempDir;
};

/*******************
 *  _cleanDist
 *
 *  summary:
 *      Checks for an existing dist directory and deletes
 *          it if one exists.
 *
 *
 *******************/
exports._cleanDist = function() {
  const distDir = path.join(process.cwd(), "dist");

  if (fs.existsSync(distDir)) {
    console.log("Cleaning dist directory...");
    rimraf.sync(distDir);
  }
};

/*******************
 *  _copyApp
 *
 *  summary:
 *      Given the path to a WAB Dev Edition Server directory,
 *          this function will copy that directory into a new dist directory
 *
 *  input:  (String) serverDir
 *              Directory containing and app within WAB Dev Edition
 *
 *  output: (String)
 *              Path to a new temp directory containing the WAB Application
 *
 *******************/
exports._copyApp = function(/*String*/ serverDir) {
  const distDir = path.join(process.cwd(), "dist");

  fs.copySync(serverDir, distDir);

  return distDir;
};

/*******************
 *  _replaceApiPath
 *
 *  summary:
 *      Given the contents of an env.js file, this function replaces the apiUrl section
 *      in order to replicate WAB Export functionality and allow use out side of the builder.
 *
 *  input:  (String) envFile
 *              Contents of a base env.js file
 *
 *  output: (String)
 *              Same env.js file contents, but with the apiUrl replaced appropriately.
 *
 *******************/
exports._replaceApiPath = function(/*String*/ envFile) {
  return envFile.replace("//apiUrl", "apiUrl");
};

/*******************
 *  _replaceProxyConfig
 *
 *  summary:
 *      Given the contents of a config.json object, this function replaces the httpProxy section
 *      in order to replicate WAB Export functionality and allow use out side of the builder.
 *
 *  input:  (Object) configObj
 *              Contents of a base env.js file
 *
 *  output: (Object)
 *              Same config.js object, but with the httpProxy value replaced appropriately.
 *
 *******************/
exports._replaceProxyConfig = function(/*String*/ configObj) {
  const httpProxy = configObj.httpProxy;

  httpProxy.useProxy = true;
  httpProxy.alwaysUseProxy = false;
  httpProxy.url = "";
  httpProxy.rules = [];

  configObj.httpProxy = httpProxy;

  return configObj;
};
