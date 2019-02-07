exports.build = function(buildPath) {
  console.log("########## BUILD START TIME: " + new Date() + " ##########");

  const fs = require("fs-extra");
  const path = require("path");
  const rimraf = require("rimraf");
  const utilscripts = require("./utilscripts");
  const prepareScript = require("./prebuild");
  const copyScript = require("./copyapp");
  const process = require("process");
  const execSync = require("child_process").execSync;
  const AdmZip = require("adm-zip");
  const babylon = require("babylon");

  const appRoot = buildPath || process.cwd();

  rimraf.sync(path.join(appRoot, "build-src"));
  fs.mkdirSync(path.join(appRoot, "build-src"));

  fs.copySync(
    path.join(appRoot, "jimu.js"),
    path.join(appRoot, "build-src", "jimu.js")
  );
  fs.copySync(
    path.join(appRoot, "config.json"),
    path.join(appRoot, "build-src", "config.json")
  );
  fs.copySync(
    path.join(appRoot, "widgets"),
    path.join(appRoot, "build-src", "widgets")
  );
  fs.copySync(
    path.join(appRoot, "themes"),
    path.join(appRoot, "build-src", "themes")
  );
  fs.copySync(
    path.join(appRoot, "libs"),
    path.join(appRoot, "build-src", "libs")
  );
  fs.copySync(
    path.join(appRoot, "dynamic-modules"),
    path.join(appRoot, "build-src", "dynamic-modules")
  );

  const syncArgs = { cwd: path.join(appRoot, "build-src"), stdio: [0, 1, 2] };

  const envJsAsText = fs.readFileSync(path.join(appRoot, "env.js"), "utf8");
  const envJs = babylon.parse(envJsAsText);
  const apiVersionIndex = envJs.tokens.findIndex(function(token) {
    if (token.value === "apiVersion") {
      return true;
    }
    return false;
  });
  const apiVersion = envJs.tokens[apiVersionIndex + 2].value;

  // We always include the arcgis-js-api dependency. If the JS API version is greater than 3.25, we must include dijit-themes:
  // https://github.com/Esri/jsapi-resources/commit/7f26c7bc7a1ee305102cd7b1f95d1631df0edbd5#diff-265400d6fce2c9b60ecb6dbea36d979f
  let dependencies = [
    `esri=arcgis-js-api#${apiVersion}`,
    "dgauges=https://github.com/dmandrioli/dgauges.git#383a47f2216be432d866d1add0a95ce40f62da52"
  ];
  if (apiVersion > 3.25) {
    dependencies.push(
      "dijit-themes=https://github.com/dojo/dijit-themes.git#1.14.0"
    );
  }
  execSync(
    `bower install ${dependencies.join(
      " "
    )} --force-latest  --config.directory=.`,
    syncArgs
  );

  let buildOutput = appRoot + path.sep + "buildOutput";
  let appPackages = buildOutput + path.sep + "app-packages";
  let appOutput = buildOutput + path.sep + "app";

  rimraf.sync(buildOutput);
  fs.mkdirSync(buildOutput);

  prepareScript.setBasePath(appRoot);

  prepareScript.setInfo({
    appConfigFile: appRoot + path.sep + "config.json"
  });

  prepareScript.prepare();
  console.log("Current location: " + appRoot);

  let loadModule = "build";

  dojoConfig = {
    baseUrl: path.join(appRoot, "build-src"), // Where we will put our packages
    async: 1, // We want to make sure we are using the "modern" loader
    hasCache: {
      "host-node": 1, // Ensure we "force" the loader into Node.js mode
      dom: 0 // Ensure that none of the code assumes we have a DOM
    },
    // While it is possible to use config-tlmSiblingOfDojo to tell the
    // loader that your packages share the same root path as the loader,
    // this really isn't always a good idea and it is better to be
    // explicit about our package map.
    packages: [
      {
        name: "dojo",
        location: path.join(appRoot, "build-src", "dojo")
      },
      {
        name: "build",
        location: path.join(appRoot, "build-src", "util/build")
      }
    ],
    deps: [loadModule] // And array of modules to load on "boot"
  };

  process.argv[2] = "load=build";
  process.argv[3] = "profile=app.profile.js";

  try {
    execSync(
      "node " +
        path.join("dojo", "dojo.js") +
        " load=build profile=app.profile.js",
      syncArgs
    );
    console.log("build finished");
  } catch (e) {
    console.log('build always "fails"');
  }

  copyScript.copy(
    {
      buildRoot: appRoot,
      appOutputPath: path.join(appRoot, "buildOutput/app"),
      appPackagePath: path.join(appRoot, "buildOutput/app-packages")
    },
    {}
  );

  utilscripts.cleanApp(path.join(appRoot, "buildOutput/app"));
  utilscripts.cleanFilesInAppSource(appRoot);

  // Return a promise so the caller knows when the build is complete
  return new Promise((resolve, reject) => {
    rimraf(path.join(appRoot, "buildOutput/app-packages"), () => {
      const zip = new AdmZip();
      const outputPath = path.join(appRoot, "buildOutput", "app");
      const outputZipPath = path.join(appRoot, "buildOutput", "app.zip");

      try {
        zip.addLocalFolder(outputPath);
        zip.writeZip(outputZipPath);

        console.log("########## BUILD END TIME: " + new Date() + " ##########");
        // Let the caller know useful path information
        resolve({
          outputPath: outputPath,
          outputZipPath: outputZipPath
        });
      } catch (err) {
        console.log("Oh no! There was an error zipping the final build.", err);
        reject(err);
      }
    });
  });
};
