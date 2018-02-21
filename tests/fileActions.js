var assert = require('assert');
var file = require('./util/fileExtension');
var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');
step('open file <relativeFilePath>', async function (relativeFilePath) {
    try {
        await languageclient.openFile(relativeFilePath);
    } catch (err) {
        throw new Error('unable to open file ' + err);
    }
});
step('open file <relativeFilePath> with content <content>', async function (relativeFilePath, beforeFormatFile) {
    try {
        await languageclient.openFile(relativeFilePath, beforeFormatFile);
    } catch (err) {
        throw new Error('unable to open file ' + err);
    }
});
function handleCodeLensDetails(responseMessage, expectedDetails) {
    for (var rowIndex = 0; rowIndex < expectedDetails.length; rowIndex++) {
        var expectedDetail = expectedDetails[rowIndex];
        gauge.message('verify code lens details');
        assert.deepEqual(responseMessage[rowIndex].range, expectedDetail.range);
    }
}
step('open file with details <jsonDetails>', async function (jsonDetails) {
    var details = builder.loadJSON(jsonDetails);
    try {
        await languageclient.openFile(details.input.uri);
    } catch (err) {
        throw new Error('unable to open file ' + err);
    }
});
step('edit file content <arg0> to <arg1> and save', async function (relativeFilePath, contentFile) {
    try {
        await languageclient.editFile(relativeFilePath, contentFile);
        var filePath = languageclient.filePath(relativeFilePath)
        var contentFilePath = languageclient.filePath(contentFile)
        await file.save(filePath,contentFilePath)
        await languageclient.saveFile(relativeFilePath);
    } catch (err) {
        throw new Error('unable to open file ' + err);
    }
});

step('restore file <arg0> with content <arg1>', async function (relativeFilePath, contentFile) {
    try {
        var filePath = languageclient.filePath(relativeFilePath)
        var contentFilePath = languageclient.filePath(contentFile)
        await file.save(filePath,contentFilePath)
    } catch (err) {
        throw new Error('unable to open file ' + err);
    }
});