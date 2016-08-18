var ts = require('typescript')
var tsconfig = require('./tsconfig.json')

module.exports = {
  
	// register custom compilers
	customCompilers: {
		// for tags with lang="ts"
		ts: function(content, cb){
			var compilerOptions = tsconfig 
			//var compilerOptions = { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES5, experimentalDecorators:true };
            
			var res = ts.transpileModule(content, { compilerOptions: compilerOptions, moduleName: '', reportDiagnostics: true })
			if(res.diagnostics.length == 0){
				cb(null, res.outputText)
			} else {
				var err = ''
				var arrayLength = res.diagnostics.length
				for(var i = 0; i < arrayLength; i++) {
					err += res.diagnostics[i].file.fileName + ': error TS' + res.diagnostics[i].code + ': ' + res.diagnostics[i].messageText + '\n'
				}
				return cb(err)
			}
		}
	}
}


            