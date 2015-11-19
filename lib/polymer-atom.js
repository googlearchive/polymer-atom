/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
 /* jshint node:true */

function atomPolylint() {
  var polylint = require('polylint');
  var path = require('path');
  return {
    name: 'atom-polymer',
    grammarScopes: ['text.html.basic'],
    scope: 'file',
    lintOnFly: true,
    lint: function(textEditor) {
      var fileAbsPath = textEditor.getPath();
      var fileText = textEditor.getText();
      var relativized = atom.project.relativizePath(fileAbsPath);
      var projectDir = relativized[0];
      var filePath = relativized[1];
      return polylint(
        filePath,
        {
          root: projectDir,
          redirect: 'bower_components',
          content: fileText,
          resolver: 'permissive'
        }
      ).then(function(lintErrors){
        var errors = [];
        lintErrors.forEach(function(warning){
          if (warning.filename !== filePath) {
            return;
          }
          console.log(warning.message);
          errors.push({
            type: warning.fatal ? 'Error' : 'Warning',
            text: warning.message,
            filePath: fileAbsPath,
            range: [
              [warning.location.line-1, warning.location.column-1],
              [warning.location.line-1, warning.location.column-1]
            ]
          });
        });
        return errors;
      }).catch(function(err){
        if (err.ownerDocument == filePath) {
          return [{
            type: 'E',
            text: err.message,
            filePath: fileAbsPath,
            range: [
              [err.location.line - 1, err.location.column-1],
              [err.location.line - 1, err.location.column-1],
            ]
          }]
        }
        console.error(err);
        return [];
      });
    }
  };
}

module.exports = {
  provideLinter: atomPolylint
};
