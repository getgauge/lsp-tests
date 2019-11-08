var fs = require("fs");
var ncp = require("ncp").ncp;
var os = require("os");
var file = require("./util/fileExtension");
var tmpobj;

function copyDataToDir(data,projectDir,done){
  ncp(data, projectDir,done);
}

function createTempDirectory(){
  tmpobj = fs.mkdtempSync(os.tmpdir());
  if(os.platform()=="darwin")
    return "/private"+tmpobj;
  return tmpobj;
}

function getProjectDirectory(){
  return "/private"+tmpobj;
}

function removeCallback(){
  if(tmpobj)
  {
    tmpobj.removeCallback();
  }
}

function removeTempDirectory(){
  if(tmpobj)
    file.rmDir(tmpobj);
}

module.exports={
  createTempDirectory:createTempDirectory,
  copyDataToDir:copyDataToDir,
  getProjectDirectory:getProjectDirectory,
  removeTempDirectory:removeTempDirectory,
  removeCallBack:removeCallback
};