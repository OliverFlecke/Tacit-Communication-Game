import * as prolog from "../src/prolog";

describe("Testing prolog is working", () => {
    let filePath = "test";
    let senderPath = "sender";
    let receiverPath = "receiver";

    it("Simple test to interface with prolog", () => {
        let answers = prolog.execute(filePath, 'p(X).');
        expect(answers).toEqual(['X = a ;', 'X = b ;', false])
    })

    it("Test binary predicate", () => {
        let answers = prolog.execute(filePath, 'p(X, Y).');
        expect(answers).toEqual(["X = a, Y = b ;", false]);
    })
    it("Test receiver in map", () => {
        let answers = prolog.execute(receiverPath, 'getMove(left, [(1,2)], [{left, (1,2)}, {right, (3,1)}], X, 0).');
        expect(answers[0]).toEqual("X = (1, 2) ;");
    })
    it("Test receiver not in map", () => {
        let answers = prolog.execute(receiverPath, 'getMove(down, [(1,2)], [{left, 2}, {right, 3}], X, 0).');
        let regex = /X = \([1-9], [1-9]\)/
        expect(answers[0]).toMatch(regex)
    })
    it("Test receiver with lists", () => {
        let answers = prolog.execute(receiverPath, 'getMove([(1,2),(2,2)], [], [{[(1,2),(2,2)], (1,2)}, {[], (1,3)}], X, 0).');
        let regex = /X = \([1-9], [1-9]\)/
        expect(answers[0]).toMatch(regex)
    })

    it("test", () => {
        let answers = prolog.execute('sender', 'getSenderMove((2,2), (2,3), (3,2), X, 1, [], 0).');
        console.log(answers);
    })

    test.only('receiver move', () => {
        let answer = prolog.execute('sender', 'getReceiverMove([(2, 2),(1, 2),(2, 2),(3, 2),(3, 1)], [], [], X, 1, 1).');
        expect(answer[0]).toEqual('X = (1, 2) ;');
    });


})