import * as prolog from "../src/prolog";

describe("Testing prolog is working", () => {
    let filePath = "./src/prolog/test.pl";

    it("Simple test to interface with prolog", () => {
        var answers = prolog.execute(filePath, 'p(X).');
        expect(answers).toEqual(['X = a ;', 'X = b ;', false])
    })

    it("Test binary predicate", () => {
        var answers = prolog.execute(filePath, 'p(X, Y).');
        expect(answers).toEqual(["X = a, Y = b ;", false]);
    })
})