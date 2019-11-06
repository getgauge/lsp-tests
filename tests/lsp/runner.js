"use strict"
const file = require('../util/fileExtension');
var path = require('path');
const cwd = process.cwd();
const { execSync } = require('child_process');

function copyManifest(projectPath, runner) {
    file.copyFile(path.join(cwd,"data", "manifest/manifest-" + runner + ".json"), path.join(projectPath, "manifest.json"))
}

function prerequisite(projectPath, runner) {
    if (runner == "ruby") {
        var output = execSync('gauge version -m');
        var version = JSON.parse(output.toString()).plugins.find(p => p.name == "ruby").version;
        var gemFilePath = path.join(projectPath, "Gemfile");
        var fileContent = file.parseContent(gemFilePath);
        var newContent = "" ;
        if(process.env.USE_LOCAL_GAUGE_RUBY == "true" )
            newContent = `gem 'gauge-ruby', '~>${version}', :path => ENV['LOCAL_GAUGE_RUBY_PATH'] || '${process.cwd()}/../gauge-ruby', :group => [:development, :test]`;
        else
            newContent = `gem 'gauge-ruby', '~>${version}', :github => 'getgauge/gauge-ruby', :branch => ENV['RUBY_PLUGIN_BRANCH'] || 'master', :group => [:development, :test]`;
            console.log(newContent)
        var result = fileContent.replace(/gem 'gauge-ruby'.*:group => \[:development, :test\]/, newContent);
        file.write(gemFilePath, result);
        var vendorFolderPath = path.join(process.cwd(), "data", "vendor");
        execSync('bundle install --path ' + vendorFolderPath, { encoding: 'utf8', cwd: projectPath });
    }
}

module.exports = {
    copyManifest:copyManifest,
    prerequisite:prerequisite
} 