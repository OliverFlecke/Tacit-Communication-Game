// Load in all the necessary agent types.
// import receiver from 'src'
try {
    var receiver = require('./prolog/combinedAgents.pl');
    var sender = require('./prolog/combinedAgents.pl');
    var test = require("./prolog/test.pl")
    var isNode = false;
}
catch (ex) {
    // console.warn('Unable to load prolog directly. Most likely running in NodeJs');
    var receiver = 'src/prolog/combinedAgents.pl';
    // receiver = 'src/prolog/path.pl';
    var sender = 'src/prolog/combinedAgents.pl';
    isNode = true;
    // To read files
    var fs = require('fs');
    var path = require('path');
}

// Import Tau Prolog core and create a session
var pl = require("./lib/core.js");
require("./lib/lists.js")(pl);
require("./lib/random.js")(pl);

let program = readFile('receiver');
let session = pl.create(1000000);
session.consult(program);

if (process.argv[2]) {
    let query = process.argv[2];
    session.query(query);
    console.time('querying');
    session.answers(x => console.log(pl.format_answer(x)));
    console.timeEnd('querying');
}

exports.execute = function execute(agent, query) {
    // Load the program
    if (!program) {
        program = readFile(agent);
        session.consult(program);
    }

    // Query the goal
    session.query(query);

    let answers = [];
    session.answers(x => {
        if (x.links) {
            answers.push(pl.format_answer(x));
        }
        else {
            answers.push(x);
        }
    });
    return answers;
}

function readFile(agent) {
    let filepath = '';
    switch (agent) {
        case 'receiver':
            filepath = receiver;
            break;
        case 'sender':
            filepath = sender;
            break;
        default:
            break;
    }

    if (isNode) {
        return fs.readFileSync(filepath, { encoding: 'utf-8' });
    }

    if (filepath.match('/static/media/')) {
        var request = new XMLHttpRequest();
        request.open('GET', filepath, false);
        request.send(null);
        return request.responseText;
    }

    return filepath;
}