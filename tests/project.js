var languageclient = require("./lsp/languageclient");
const gaugeDaemon = require("./lsp/gauge");
var _user = require("./user");
var fileExtension = require("./util/fileExtension");
var path = require("path");
var customLogPath;

step("execute gauge language runner pre-requisite", function () {
  var projectPath = gauge.dataStore.scenarioStore.get("projectPath");
  languageclient.prerequisite(projectPath,process.env.language);
});

step("Start LSP and initialize - This should be the first request from the client to the server", async function () {
  try{
    await languageclient.openProject();
  }
  catch(err){
    console.log(err.stack);
    gauge.message(err.stack);

    throw new Error("unable to start gauge daemon "+err);
  }
});

beforeScenario(function(context){
  customLogPath = context.currentSpec.name+"/"+context.currentScenario.name;
});

step("invoke shutDown and exit of LSP", async function () {
  try{
    await languageclient.shutDown();
  }catch(err){
    console.log(err.stack);
    gauge.message(err.stack);

    throw new Error("trying to stop gauge daemon failed "+err);
  }
});

step("cache gauge init template if not already present", function () {
  var runner = (process.env.language=="javascript")?"js":process.env.language;
  var resourcePath = path.join("./resources",runner);
  if(fileExtension.createDirIfNotPresent(resourcePath))
    gaugeDaemon.initializeWithTemplate(resourcePath, runner); 
});

step("copy project template from cache", function (done) {
  var projectPath = gauge.dataStore.scenarioStore.get("projectPath");

  var runner = (process.env.language=="javascript")?"js":process.env.language;
  var resourcePath = path.join("./resources",runner);

  _user.copyDataToDir(resourcePath,projectPath,done);
});

step("remove the env, specs and impl folders copied from the template", function () {
  var projectPath = gauge.dataStore.scenarioStore.get("projectPath");

  fileExtension.remove(path.join(projectPath, "manifest.json"));
  fileExtension.rmContentsOfDir(path.join(projectPath,"specs"));
  fileExtension.rmContentsOfDir(path.join(projectPath,"env"));
  if(process.env.noSrcImplDirectory)
  {
    fileExtension.remove(path.join(projectPath,process.env.defaultSourceFile+process.env.languageExtension));
  }
  else
    fileExtension.rmContentsOfDir(path.join(projectPath,process.env.implDirectory));
});

step("create temporary directory", function() {
  var projectPath = _user.createTempDirectory();
  console.log(JSON.stringify({ logLevel: "info", message: `Current project path: ${projectPath}` }));
  gauge.dataStore.scenarioStore.put("projectPath", projectPath);
  process.env.use_test_ga=true;
  process.env.logs_directory = path.relative(projectPath,"logs")+"/lsp-tests/"+customLogPath;
});

step("copy data - env, specifications and implementation folders of required data from <data>", function (data, done) {
  var projectPath = gauge.dataStore.scenarioStore.get("projectPath");
  _user.copyDataToDir(data,projectPath,done);
});

step("remove the temporary directory", function() {
  fileExtension.rmContentsOfDir(gauge.dataStore.scenarioStore.get("projectPath"));
});