// load dependencies
const { workflow } = require('zenaton');

// load definitions
const workflowDefinition = require("./workflows/SimpleEtl");

workflow("SimpleEtl", workflowDefinition);
