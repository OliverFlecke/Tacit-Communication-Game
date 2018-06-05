import * as prolog from "../src/prolog";

describe("Testing prolog is working", () => {
    let filePath = "./src/prolog/test.pl";
    let senderPath = "./src/prolog/sender.pl";
    let receiverPath = "./src/prolog/receiver.pl";

    it("Simple test to interface with prolog", () => {
        var answers = prolog.execute(filePath, 'p(X).');
        expect(answers).toEqual(['X = a ;', 'X = b ;', false])
    })

    it("Test binary predicate", () => {
        var answers = prolog.execute(filePath, 'p(X, Y).');
        expect(answers).toEqual(["X = a, Y = b ;", false]);
    })
    it("Test receiver in map", () => {
        var answers = prolog.execute(receiverPath, 'getMove(left, [(1,2)], [{left, (1,2)}, {right, (3,1)}], X).');
        expect(answers[0]).toEqual("X = (1, 2) ;");
    })
    it("Test receiver not in map", () => {
        var answers = prolog.execute(receiverPath, 'getMove(down, [(1,2)], [{left, 2}, {right, 3}], X).');
        var regex = /X = \([1-9], [1-9]\)/
        expect(answers[0]).toMatch(regex)
    })




})