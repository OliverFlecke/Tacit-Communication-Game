import * as prolog from "../src/prolog";

describe("Testing prolog is working", () => {
    let filePath = "./src/prolog/test.pl";
    let senderPath = "./src/prolog/sender.pl";
    let receiverPath = "./src/prolog/receiver.pl";

    it("Simple test to interface with prolog", () => {
        let answers = prolog.execute(filePath, 'p(X).');
        expect(answers).toEqual(['X = a ;', 'X = b ;', false])
    })

    it("Test binary predicate", () => {
        let answers = prolog.execute(filePath, 'p(X, Y).');
        expect(answers).toEqual(["X = a, Y = b ;", false]);
    })
    it("Test receiver in map", () => {
        let answers = prolog.execute(receiverPath, 'getMove(left, [(1,2)], [{left, (1,2)}, {right, (3,1)}], X).');
        expect(answers[0]).toEqual("X = (1, 2) ;");
    })
    it("Test receiver not in map", () => {
        let answers = prolog.execute(receiverPath, 'getMove(down, [(1,2)], [{left, 2}, {right, 3}], X).');
        let regex = /X = \([1-9], [1-9]\)/
        expect(answers[0]).toMatch(regex)
    })
    it("Test receiver with lists", () => {
        let answers = prolog.execute(receiverPath, 'getMove([(1,2),(2,2)], [], [{[(1,2),(2,2)], (1,2)}, {[], (1,3)}], X).');
        let regex = /X = \([1-9], [1-9]\)/
        expect(answers[0]).toMatch(regex)
    })

    it("test", () => {
        let answers = prolog.execute('sender', 'getMove((2,2), (1, 2), (3, 2), X, 1, []).');
        console.log(answers);
    })


})