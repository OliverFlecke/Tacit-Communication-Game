var P = require('./pengines.js');


peng = P.Pengine({
    // server: "http://pengines.swi-prolog.org/pengine",
    server: "http://localhost:3030/pengine",
    // chunk: 2,
    src_text: 'animal(cat).',
    ask: 'animal(Animal)',
    onsuccess: handleSuccess,
    onerror: handleError,
});

function handleSuccess(result) {
    for (const data in result.data) {
        console.log(data);
    }
}

function handleError(data, id) {
    console.log(id);
    console.log(data);
}
