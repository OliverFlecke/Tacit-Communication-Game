// To read files
var fs = require('fs');
var path = require('path');

// Import Tau Prolog core and create a session
var pl = require("../libs/core.js");
require("../libs/lists.js")(pl);
require("../libs/random.js")(pl);
var session = pl.create(1000);

// Load the program
let filePath = "./src/prolog/test.pl";
let program = fs.readFileSync(filePath, {encoding: 'utf-8'});
session.consult(program);

let item = process.argv[2];

// Query the goal
session.query(item);

// Show answers
session.answers(x => console.log(pl.format_answer(x)));