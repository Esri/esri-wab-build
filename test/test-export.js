const assert = require("assert");
const sinon = require("sinon");
const fs = require("fs");
const exportUtils = require("../app/exportUtils");
const fakeJs = require("./fake-js-files");

const fakeEnvJS = "";
const fakeAppDir = "";
const fakeTempDir = "c:/tmp/12345";

describe("exportApp", () => {
  it("should call methods to copy files, replace the api path, set the proxy config, and clear the app id", () => {
    sinon.stub(exportUtils, "copyApp");
    exportUtils.copyApp.returns(fakeTmpDir);

    sinon.stub(exportUtils, "replaceApiPath");
    exportUtils.replaceApiPath.returns(fakeJs.envWithApiURL);
    sinon.stub(exportUtils, "replaceProxyConfig");

    const fakeConfig = { test: "test123" };
    exportUtils.replaceProxyConfig.returns(fakeConfig);

    exportUtils.exportApp(fakeAppDir);

    assert.ok(exportUtils.copyApp.calledWith(fakeAppDir));
    assert.ok(exportUtils.replaceApiPath.called);
    assert.ok(
      fs.writeFile.calledWith(`${fakeTempDir}/env.js`, fakeJs.envWithApiURL)
    );
    assert.ok(exportUtils.replaceProxyConfig.called);
    assert.ok(
      fs.writeFile.calledWith(
        `${fakeTempDir},config.json`,
        JSON.stringify(fakeConfig)
      )
    );

    exportUtils.copyApp.restore();
    exportUtils.replaceApiPath.restore();
    exportUtils.replaceProxyConfig.restore();
  });

  it("should copy all files from web app builder to a tmp directory", () => {
    sinon.stub(fs, "mkdtempSync");
    fs.mkdtempSync.returns(fakeTempDir);

    sinon.stub(fs, "copyFileSync");
    fs.copyFileSync.returns(true);

    const tempDirPath = exportUtils.copyApp(fakeAppDir);

    assert.ok(fs.copyFileSync.calledWith(fakeAppDir, fakeTempDir));

    assert.eqaul(fakeTempDir, tempDirPath);

    fs.mkdtempSync.restore();
    fs.copyFileSync.restore();
  });

  it("should set http proxy config in config.json", () => {
    const fakeConfigJson = fakeJs.fakeConfigObj;

    const newConfig = exportUtils.replaceProxyConfig(fakeConfigJson);
    const httpProxyConfig = newConfig.httpProxy;

    assert.ok(httpProxyConfig.useProxy);
    assert.equal(httpProxyConfig.alwaysUseProxy, false);
    assert.equal(httpProxyConfig.url.length, 0);
    assert.equal(httpProxyConfig.rules.length, 0);
  });
});
