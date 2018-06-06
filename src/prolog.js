// Load in all the necessary agent types.
let receiver = require('src/prolog/receiver.pl');
let sender = require('src/prolog/sender.pl');
// To read files
var fs = require('fs');
var path = require('path');

// Import Tau Prolog core and create a session
var pl = require("./lib/core.js");
require("./lib/lists.js")(pl);
require("./lib/random.js")(pl);

exports.execute = function execute(agent, query) {
    var session = pl.create(10000000);

    // Load the program
    let program = '';
    switch (agent) {
        case 'receiver':
            program = readFile(receiver);
            break;
        case 'sender':
            program = readFile(sender);
            break;
        default:
            break;
    }
    session.consult(program);

    // Query the goal
    session.query(query);

    let answers = [];
    session.answers(x => {
        if (x.links) {
            // answers.push(x.links.X.id);
            answers.push(pl.format_answer(x));
        }
        else {
            answers.push(x);
        }
    });
    return answers;
}

function readFile(filepath) {
    var request = new XMLHttpRequest();
    request.open('GET', filepath, false);
    request.send(null);
    var returnValue = request.responseText;

    return returnValue;
}