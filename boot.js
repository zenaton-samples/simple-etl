// load dependencies
const { workflow, task } = require('zenaton');

// define tasks
task("GetMovies", require("./tasks/GetMovies"));
task("GetCharacterData", require("./tasks/GetCharacterData"));
task("SendByEmail", require("./tasks/SendByEmail"));

// define workflows
workflow("SimpleETL", require("./workflows/SimpleEtl"));
