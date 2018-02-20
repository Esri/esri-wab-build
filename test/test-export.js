const assert = require("assert");
const sinon = require("sinon");
const fs = require("fs-extra");
const hjson = require("hjson");
const path = require("path");

const exportUtils = require("../app/exportUtils");
const fakeJs = require("./fake-js-files");

const fakeAppDir = "C:/webappbuilder/";
const fakeTempDir = "12345";

describe("exportApp", () => {
  it("should call methods to copy files, replace the api path, set the proxy config, and clear the app id", () => {
    sinon.stub(exportUtils, "_copyApp");
    exportUtils._copyApp.returns(fakeTempDir);

    sinon.stub(exportUtils, "_replaceApiPath");
    exportUtils._replaceApiPath.returns(fakeJs.envWithApiURL);
    sinon.stub(exportUtils, "_replaceProxyConfig");
    sinon.stub(fs, "writeFileSync");
    sinon.stub(fs, "readFileSync");
    fs.readFileSync.returns(fakeJs.fakeConfigStr);

    const fakeObj = { test: "test123" };
    exportUtils._replaceProxyConfig.returns(fakeObj);

    const returnValue = exportUtils.exportApp(fakeAppDir);

    assert.ok(
      exportUtils._copyApp.calledWith(fakeAppDir),
      "copy app was called with the correct parameters"
    );
    assert.ok(
      exportUtils._replaceApiPath.calledWith(fakeJs.fakeConfigStr),
      "_replaceApiPath was called with file contents"
    );
    assert.ok(
      fs.writeFileSync.calledWith(
        `${fakeTempDir}/env.js`,
        fakeJs.envWithApiURL
      ),
      "env.js was rewritten correctly on the file system"
    );
    assert.ok(
      exportUtils._replaceProxyConfig.calledWith(
        hjson.parse(fakeJs.fakeConfigStr)
      ),
      "_replaceProxyConfig was called with file contents"
    );

    assert.ok(
      fs.writeFileSync.calledWith(
        `${fakeTempDir}/config.json`,
        JSON.stringify(fakeObj)
      ),
      "config.json was rewritten correctly on the file system"
    );

    assert.equal(
      returnValue,
      fakeTempDir,
      "The temp directory path was correctly returned"
    );

    exportUtils._copyApp.restore();
    exportUtils._replaceApiPath.restore();
    exportUtils._replaceProxyConfig.restore();
  });

  it("should copy all files from web app builder to a tmp directory", () => {
    sinon.stub(fs, "mkdirSync");

    sinon.stub(fs, "copySync");
    fs.copySync.returns(true);

    const distDirPath = exportUtils._copyApp(fakeAppDir);

    const fullDistDir = path.join(process.cwd(), "dist");

    assert.ok(
      fs.copySync.calledWith(fakeAppDir, fullDistDir),
      `copy sync was called with the correct params`
    );

    assert.equal(fullDistDir, distDirPath);

    fs.mkdirSync.restore();
    fs.copySync.restore();
  });

  it("should set http proxy config in config.json", () => {
    const fakeConfigJson = hjson.parse(fakeJs.fakeConfigStr);

    const newConfig = exportUtils._replaceProxyConfig(fakeConfigJson);
    const httpProxyConfig = newConfig.httpProxy;

    assert.ok(httpProxyConfig.useProxy);
    assert.equal(httpProxyConfig.alwaysUseProxy, false);
    assert.equal(typeof httpProxyConfig.url, "string");
    assert.equal(httpProxyConfig.url, "");
    assert.equal(httpProxyConfig.rules.length, 0);
  });

  it("should replace the apiPath in env.js", () => {
    const fakeEnvJs = fakeJs.fakeEnv;

    const newEnvJs = exportUtils._replaceApiPath(fakeEnvJs);

    assert.equal(
      newEnvJs,
      fakeJs.envAfterExport,
      "Successfully uncommented apiUrl from env.js"
    );
  });
});
