var { query } = require('./prolog/pengines.js');
// Load in all the necessary agent types.
// import receiver from 'src'
try {
    var filepath = require('./prolog/combinedAgents.pl');
    var isNode = false;
}
catch (ex) {
    // console.warn('Unable to load prolog directly. Most likely running in NodeJs');
    var filepath = 'src/prolog/combinedAgents.pl';
    isNode = true;

    try {
        // To read files in nodeJS
        var fs = require('fs');
        var path = require('path');
    }
    catch (ex) {
        // In GitHub Pages
    }
}

function readFile(filepath) {
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

let program = readFile(filepath);

async function execute(text) {
    console.time('querying');
    // Query the prolog engine
    const answers = await query(text, { template: 'X' });
    console.timeEnd('querying');

    if (typeof answers[0] !== 'object') {
        console.log(answers[0]);
    } else {
        answers[0].forEach(answer => {
            console.log(answer.args);
        });
    }

    return answers;
}

exports.execute = execute;

if (process.argv[2]) {
    setTimeout(() => {
        execute(process.argv[2]);
    }, 1000);
} else {
    setTimeout(() => {
        execute('getSenderMove((2,2), (1, 1), (2, 2), X, 0, 1, [])');
    }, 1000);
}
