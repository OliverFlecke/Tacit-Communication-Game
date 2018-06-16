var jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
// global.document = document;
var $ = require("./jquery-2.0.3.min.js")(window);

// var jsdom = require('jsdom');
// const { JSDOM } = jsdom;
// const { window } = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);

const prologData = {
    "src_text":
        "\n\n\t        q(X) :- p(X).\n\n\t\t    p(a). p(b). p(c). p(d). p(e). p(f). p(g).\n\n        ",
        "format": "json",
        "ask": "q(X)"
    }

$.ajax({
    type: "POST",
    url: "http://localhost:3030" +
        '/send?format=JSON' +
        '&id=' + '959eeba7-3103-41e9-a2dc-f55a8c04a419',
    data: prologData,
    contentType: "application/x-prolog; charset=UTF-8",
    success: function (obj) {
        console.log(obj);
        // pengine.process_response(obj);
    },
    error: function (jqXHR, textStatus, errorThrown) {
        console.log('error');
        // pengine.error(jqXHR, textStatus, errorThrown);
    },
    complete: function () {
        console.log('complete');
        // pengine.request = undefined;
    }
});