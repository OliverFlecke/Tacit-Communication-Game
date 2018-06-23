/* Strategy:
    0 - Short
    1 - Short + Goal
    2 - Minimize number of unique cells
    3 - Symmetry
*/

%Auxillary Function
filter(ReceiverGoal, SenderGoal, Map) :-
    member({Path, ReceiverGoal}, Map),
    append(_, [SenderGoal], Path).

getErrors(Path, ErrorsMap, Errors) :-
    member({Path, Errors}, ErrorsMap).
getErrors(_, _, []).

appendMap(Map, _, [], Map).
appendMap(Map, Path, [H|T], OutMap) :-
    appendMap(Map, Path, T, NewMap),
    append([{Path, H}], NewMap, OutMap).

% To controll which setting should be in use. Only one of the following predicates should be added
% alternativeSetting(PossibleGoals, Path, PossibleGoals).
alternativeSetting(PossibleGoals, Path, FilteredGoals) :-
    append(_, [SenderGoal], Path),
    subtract(PossibleGoals, [(2,2), SenderGoal], FilteredGoals).

%Receiver
%Params: Path, ErrorsMap, Map, Result, Order, Strategy
getReceiverMove(Path, _, Map, X, _, _) :- member({Path,X}, Map).

%Zero Order, Shortest Goal Path(1)
getReceiverMove(Path, ErrorsMap, _, ReceiverGoal, 0, Strategy) :-
    getPossibleReceiverMoves(Path, ErrorsMap, [], PossibleGoals, 0, Strategy),
    alternativeSetting(PossibleGoals, Path, FilteredGoals),
    random_member(ReceiverGoal, FilteredGoals).

%First Order, Shortest Path(0) or Shortest Goal Path(1)
getReceiverMove(Path, ErrorsMap, Map, ReceiverGoal, Order, Strategy) :-
    Order > 0,
    getPossibleReceiverMoves(Path, ErrorsMap, Map, PossibleGoals, Order, Strategy),
    alternativeSetting(PossibleGoals, Path, FilteredGoals),
    random_member(ReceiverGoal, FilteredGoals), !.

%Zero Order, Any Strategy
getPossibleReceiverMoves(Path, _, Map, [X|[]], 0, _) :-
    member({Path, X}, Map).

%Zero Order, Shortest Goal Path(1)
getPossibleReceiverMoves(Path, ErrorsMap, _, ReceiverGoal, 0, Strategy) :-
    Strategy > 0,
    getErrors(Path, ErrorsMap, Errors),
    subtract(Path, Errors, ReceiverGoal).

%Zero Order, Shortest Path(0)
getPossibleReceiverMoves(Path, ErrorsMap, _, ReceiverGoal, 0, 0) :-
    getErrors(Path, ErrorsMap, Errors),
    subtract([(1,1), (2,1), (3,1), (1,2), (2,2), (3,2), (1,3), (2,3), (3,3)], Errors, ReceiverGoal).

% Any Order, Shortest Path(0),
getPossibleReceiverMoves([H|T], ErrorsMap, Map, PossibleReceiverGoals, Order, Strategy) :-
    Order > 0,
    Path = [H|T],
    append(_, [SenderGoal], Path),
    Temp is Order - 1,
    getErrors(Path, ErrorsMap, Errors),
    setof((X, Y), (isLegalMove((X, Y)), getSenderMove(H, (X, Y), SenderGoal, [H|T], Temp, Strategy, Map)), RGL),
    findall(X, (member(X, RGL), \+ filter(X, SenderGoal, Map)), FilteredGoals),
    subtract(FilteredGoals, Errors, PossibleReceiverGoals),
    \+ same_length(PossibleReceiverGoals, []).

%First Order, Shortest Path(0),
getPossibleReceiverMoves([H|T], ErrorsMap, Map, ReceiverGoal, Order, Strategy) :-
    Order > 0,
    Path = [H|T],
    append(_, [SenderGoal], Path),
    Temp is Order - 1,
    getErrors(Path, ErrorsMap, Errors),
    getPossibleReceiverMoves(Path, ErrorsMap, Map, PossibleLocations, 0, Strategy),
    appendMap(Map, Path, PossibleLocations, SenderMap),

    setof((X, Y), (isLegalMove((X, Y)), getSenderMove(H, (X, Y), SenderGoal, [H|T], Temp, Strategy, SenderMap)), RGL),
    findall(X, (member(X, RGL), \+ filter(X, SenderGoal, Map)), FilteredGoals),
    subtract(FilteredGoals, Errors, TempGoals),
    ((same_length(TempGoals, []), \+ same_length(Errors, [])) ->
        getPossibleReceiverMoves([H|T], [], Map, ReceiverGoal, Order, Strategy);
        ReceiverGoal = TempGoals
    ).

getPossibleReceiverMoves([ReceiverGoal|T], ErrorsMap, _, [ReceiverGoal], _, _) :-
    member({[ReceiverGoal|T], Errors}, ErrorsMap),
    \+ member(ReceiverGoal, Errors).

% Sender move
uniquePath(Path, Map) :- \+ member({Path, _}, Map).

getPathNotInMap(C, ReceiverGoal, SenderGoal, Path, Order, Strategy, Map) :-
    getPath(C, ReceiverGoal, SenderGoal, Path, Order, Strategy, Map),
    !,
    uniquePath(Path, Map).
%Sender
getSenderMove(_, ReceiverGoal, SenderGoal, Path, _, _, Map) :-
    member({Path, ReceiverGoal}, Map),
    append(_, [SenderGoal], Path), !.

getSenderMove(C, ReceiverGoal, SenderGoal, Path, Order, Strategy, Map) :-
    getPathNotInMap(C, ReceiverGoal, SenderGoal, Path, Order, Strategy, Map), !.

getSenderMove(C, ReceiverGoal, SenderGoal, Path, 0, Strategy, Map) :-
    getPath(C, ReceiverGoal, SenderGoal, Path, 0, Strategy, Map),
    uniquePath(Path, Map), !.

% Wiggle
getSenderMove(CurrentLocation, ReceiverGoal, SenderGoal, Path, Order, Strategy, Map) :-
    % Strategy > 0,
    getWigglePath(CurrentLocation, ReceiverGoal, SenderGoal, Path, Order, Strategy, Map).

getWigglePath(CurrentLocation, ReceiverGoal, SenderGoal, Path, _, 2, Map) :-
    generatePath(CurrentLocation, ReceiverGoal, StartToReceiverPath, unique_move),
    generatePath(ReceiverGoal, ReceiverGoal, ReceiverToReceiverPath, unique_move(StartToReceiverPath)),
    length(ReceiverToReceiverPath, L),
    L > 1,
    combinePath(StartToReceiverPath, ReceiverToReceiverPath, StartToReceiverTwicePath),
    generatePath(ReceiverGoal, SenderGoal, ReceiverToSenderPath, unique_move(StartToReceiverTwicePath)),
    combinePath(StartToReceiverTwicePath, ReceiverToSenderPath, Path),
    combinePath(StartToReceiverPath, ReceiverToSenderPath, TestPath),
    member({TestPath, NotRG}, Map),
    NotRG \== ReceiverGoal,
    uniquePath(Path, Map), !.

getWigglePath(CurrentLocation, _, SenderGoal, Path, _, 0, Map) :-
    generatePath(CurrentLocation, SenderGoal, StartToSenderPath, heuristic_move),
    generatePath(SenderGoal, SenderGoal, SenderToSenderPath, move),
    length(SenderToSenderPath, L),
    L > 1,
    combinePath(StartToSenderPath, SenderToSenderPath, Path),
    uniquePath(Path, Map), !.

getWigglePath(CurrentLocation, ReceiverGoal, SenderGoal, Path, _, _, Map) :-
    generatePath(CurrentLocation, ReceiverGoal, StartToReceiverPath, heuristic_move),
    generatePath(ReceiverGoal, ReceiverGoal, ReceiverToReceiverPath, move),
    length(ReceiverToReceiverPath, L),
    L > 1,
    combinePath(StartToReceiverPath, ReceiverToReceiverPath, StartToReceiverTwicePath),
    generatePath(ReceiverGoal, SenderGoal, ReceiverToSenderPath, heuristic_move),
    combinePath(StartToReceiverTwicePath, ReceiverToSenderPath, Path),
    combinePath(StartToReceiverPath, ReceiverToSenderPath, TestPath),
    member({TestPath, NotRG}, Map),
    NotRG \== ReceiverGoal,
    uniquePath(Path, Map), !.


% Zero Order, Shortest Path(0),
getPath(CurrentLocation, _, SenderGoal, Path, 0, 0,_) :-
    member(Move, [heuristic_move, move]),
    generatePath(CurrentLocation, SenderGoal, Path, Move).

%Zero Order, Shortest Goal Path(1),
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 0, 1, _) :-
    generatePath(CurrentLocation, ReceiverGoal, P1, heuristic_move),
    generatePath(ReceiverGoal, SenderGoal, P2, heuristic_move),
    combinePath(P1, P2, Path).

% 1st Order, Shortest Path(0),
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 1, 0, Map) :-
    generatePath(CurrentLocation, SenderGoal, Path, heuristic_move),
    getPossibleReceiverMoves(Path, [], Map, RGL, 0, 0),
    member(ReceiverGoal, RGL).


% 1st Order, Shortest Goal Path(1)
getPath(CurrentLocation, SenderGoal, SenderGoal, Path, 1, 1, _) :-
    generatePath(CurrentLocation, SenderGoal, Path, heuristic_move).
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 1, 1, Map) :-
    generatePath(CurrentLocation, ReceiverGoal, P1 , heuristic_move),
    generatePath(ReceiverGoal, SenderGoal, P2 , heuristic_move),
    combinePath(P1, P2, Path),
    getPossibleReceiverMoves(Path, [], Map, RGL, 0, 1),
    member(ReceiverGoal, RGL).

% 2nd Order, Shortest Path(0),
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 2, 0, Map) :-
    generatePath(CurrentLocation, SenderGoal, Path, heuristic_move),
    getPossibleReceiverMoves(Path, [], Map, RGL, 1, 0),
    member(ReceiverGoal, RGL).

% 2nd Order, Shortest Goal Path(1),
getPath(CurrentLocation, SenderGoal, SenderGoal, Path, 2, 1, _) :-
    generatePath(CurrentLocation, SenderGoal, Path, heuristic_move).
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 2, 1, Map) :-
    generatePath(CurrentLocation, ReceiverGoal, P1, heuristic_move),
    generatePath(ReceiverGoal, SenderGoal, P2, heuristic_move),
    combinePath(P1, P2, Path),
    getPossibleReceiverMoves(Path, [], Map, RGL, 1, 1),
    member(ReceiverGoal, RGL).

% Zero Order, Unique Path(2),
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 0, 2, _) :-
    generatePath(CurrentLocation, ReceiverGoal, P1, unique_move),
    generatePath(ReceiverGoal, SenderGoal, P2, unique_move(P1)),
    combinePath(P1, P2, Path).

% 1st Order, Unique Path(2)
getPath(CurrentLocation, SenderGoal, SenderGoal, Path, 1, 2, _) :-
    generatePath(CurrentLocation, SenderGoal, Path, unique_move).
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 1, 2, Map) :-
    generatePath(CurrentLocation, ReceiverGoal, P1 , unique_move),
    generatePath(ReceiverGoal, SenderGoal, P2 , unique_move(P1)),
    combinePath(P1, P2, Path),
    getPossibleReceiverMoves(Path, [], Map, RGL, 0, 2),
    member(ReceiverGoal, RGL).

% 2nd Order, Unique path(2)
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 2, 2, Map) :-
    generatePath(CurrentLocation, ReceiverGoal, P1, unique_move),
    generatePath(ReceiverGoal, SenderGoal, P2, unique_move(P1)),
    combinePath(P1, P2, Path),
    getPossibleReceiverMoves(Path, [], Map, RGL, 1, 2),
    member(ReceiverGoal, RGL).

% [H| X] [X | T] -> [H|X|T]
combinePath([], Y, Y).
combinePath(X, [], X).
combinePath(X, [H|Y], Path) :-
    append(_, [H], X),
    append(X, Y, Path), !.
combinePath(X, Y, Path) :- append(X, Y, Path).

% Check the length is not too long
check_length([_], _).
check_length([_, _], _).
check_length([_, _, _], _).
check_length([_, _, _, _], _).
check_length([_, _, _, _, _], _).
% check_length([_, _, _, _], MoveFunction) :- MoveFunction \== move.
% check_length([_, _, _, _, _], MoveFunction) :- MoveFunction \== move.

generatePath(X, X, [X], _).
generatePath(X, Y, [X|Path], MoveFunction) :- generatePathHelper(X, Y, Path, MoveFunction).

generatePathHelper(X, X, [], heuristic_move) :- !.
generatePathHelper(X, X, [], _).
generatePathHelper(X, Y, [H|T], MoveFunction) :-
    check_length([H|T], MoveFunction),
    findall(J, myCall(MoveFunction, X, J, Y, [H|T]), ResultList),
    member(H, ResultList),
    generatePathHelper(H, Y, T, MoveFunction).

abs(X, Y) :- X < 0, Y is -X, !.
abs(X, X).

% manhattan_dist((CLX, CLY), (GX, GY), D) :-
%     tracing,
%     notrace,
%     manhattan_dist2((CLX, CLY), (GX, GY), D),
%     trace.
% manhattan_dist((CLX, CLY), (GX, GY), D) :-
%     manhattan_dist2((CLX, CLY), (GX, GY), D).

manhattan_dist((CLX, CLY), (GX, GY), D) :-
    abs(GX - CLX, X),
    abs(GY - CLY, Y),
    D is X + Y.

heuristic_move(C, N, G, _) :-
    manhattan_dist(C, G, D),
    move(C, N, _, _),
    manhattan_dist(N, G, DN),
    D =:= DN + 1.

%Params: currentLocation, newLocation
move((CLX, CLY), (NLX, CLY), _, _) :-
    NLX is CLX + 1,
    isLegalMove((NLX, CLY)).

move((CLX, CLY), (NLX, CLY), _, _) :-
    NLX is CLX - 1,
    isLegalMove((NLX, CLY)).

move((CLX, CLY), (CLX, NLY), _, _) :-
    NLY is CLY + 1,
    isLegalMove((CLX, NLY)).

move((CLX, CLY), (CLX, NLY), _, _) :-
    NLY is CLY - 1,
    isLegalMove((CLX, NLY)).

unique_move(CurrentLocation, NextLocation, GoalLocation, Path) :-
    heuristic_move(CurrentLocation, NextLocation, GoalLocation, _),
    member(NextLocation, Path), !.
unique_move(CurrentLocation, NextLocation, GoalLocation, _) :-
    heuristic_move(CurrentLocation, NextLocation, GoalLocation, _), !.
unique_move(CurrentLocation, NextLocation, GoalLocation, Path) :-
    move(CurrentLocation, NextLocation, GoalLocation, _),
    member(NextLocation, Path).

isLegalMove((X, Y)) :- member(X, [1,2,3]), member(Y, [1,2,3]).

% Utils
myCall(move, A, B, C, P) :- move(A, B, C, P).
myCall(heuristic_move, A, B, C, P) :- heuristic_move(A, B, C, P).
% myCall(unique_move, A, B, C, P) :- unique_move(A, B, C, P).
myCall(unique_move, A, B, C, _) :- unique_move(A, B, C, []).
myCall(unique_move(P), A, B, C, _) :- unique_move(A, B, C, P), !.
% myCall(unique_move(_), A, B, C, P) :- unique_move(A, B, C, P).
