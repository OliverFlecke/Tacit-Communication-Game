// To read files
var fs = require('fs');
var path = require('path');

// Import Tau Prolog core and create a session
var pl = require("../lib/core.js");
require("../lib/lists.js")(pl);
require("../lib/random.js")(pl);

exports.execute = function execute(filePath, query) {
    var session = pl.create(1000);

    // Load the program
    let program = fs.readFileSync(filePath, {encoding: 'utf-8'});
    session.consult(program);

    // Query the goal
    session.query(query);

    // Show answers
    // session.answers(x => console.log(pl.format_answer(x)));
    // session.answers(x => pl.format_answer(x));
    let answers = [];
    session.answers(x => answers.push(pl.format_answer(x)));
    // session.answers(x => answers.push(x));
    return answers;
}
