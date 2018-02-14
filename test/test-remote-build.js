const assert = require("assert");
const sinon = require("sinon");
const remoteBuild = require("../app/remoteBuild");
const exportUtils = require("../app/exportUtils");
const buildTool = require("../app/buildTool");

describe("buildApp", () => {
  const fakeAppDirectory =
    "C:/arcgis-web-appbuilder-2.7/WebAppBuilderForArcGIS";
  const fakeTempDir = "C:/tmp/12345";

  before(function() {
    sinon.stub(exportUtils, "exportApp");
    exportUtils.exportApp.returns(fakeTempDir);

    sinon.stub(buildTool, "build");
  });

  after(function() {
    exportUtils.exportApp.restore();
    buildTool.build.restore();
  });

  it("should export a source app given a parameter", () => {
    remoteBuild.buildApp(fakeAppDirectory);

    assert.ok(exportUtils.exportApp.calledWith(fakeAppDirectory));
  });

  it("should run the build tool on the given app", () => {
    remoteBuild.buildApp(fakeAppDirectory);

    assert.ok(buildTool.build.calledWith(fakeTempDir));
  });
});
