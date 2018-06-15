:- use_module(library(lists)).
:- use_module(library(random)).

% Utils
myCall(move, A, B, C) :- move(A, B, C).
myCall(hueristic_move, A, B, C) :- hueristic_move(A, B, C).

/* Strategy:
    0 - Short
    1 - Short + Goal
    2 - Minimize number of unique cells
    3 - Symmetry

*/

%Auxillary Function
aux_subtract([], _, []) :- !.
aux_subtract([A|C], B, D) :-
        member(A, B), !,
        aux_subtract(C, B, D).
aux_subtract([A|B], C, [A|D]) :-
        aux_subtract(B, C, D).

aux_matchMap(_,[],[]).

aux_matchMap(Path, Map, Output) :-
    append(_, [X], Path),
    append(W, [{Q,_}], Map),
    \+ append(_, [X], Q),
    aux_matchMap(Path, W, Output).

aux_matchMap(Path, Map, [Y|Z]) :-
    append(_, [X], Path),
    append(W, [{Q,Y}], Map),
    append(_, [X], Q),
    aux_matchMap(Path, W, Z).



%Receiver
%Params: Path, Errors, Map, Result, Order, Strategy
getReceiverMove(Path, _, Map, X, _, _) :-    member({Path,X}, Map).

%Zero Order, Shortest Goal Path(1)
getReceiverMove(Path, Errors, _, ReceiverGoal, 0, Strategy) :-
    getPossibleReceiverMoves(Path, Errors, [], PossibleList, 0, Strategy),
    random_member(ReceiverGoal, PossibleList).

%First Order, Shortest Path(0) or Shortest Goal Path(1)
getReceiverMove(Path, Errors, Map, ReceiverGoal, 1, Strategy):-
    getPossibleReceiverMoves(Path, Errors, Map, PossibleList, 1, Strategy),
    random_member(ReceiverGoal, PossibleList), !.


%Zero Order, Any Strategy
getPossibleReceiverMoves(Path, _, Map, [X|[]], 0, _) :-
    member({Path,X}, Map).

%Zero Order, Shortest Goal Path(1)
getPossibleReceiverMoves(Path, Errors, _, ReceiverGoal, 0, 1) :-
    aux_subtract(Path, Errors, ReceiverGoal).

%Zero Order, Shortest Path(0)
getPossibleReceiverMoves(_, Errors, _, ReceiverGoal, 0, 0) :-
    aux_subtract([(1,1), (2,1), (3,1), (1,2), (2,2), (3,2), (1,3), (2,3), (3,3)], Errors, ReceiverGoal).

%First Order, Shortest Path(0),
getPossibleReceiverMoves([H|T], Errors, Map, ReceiverGoal, Order, Strategy) :-
    append(_, [SenderGoal], [H|T]),
    Temp is Order -1,
    findall(X, (isLegalMove(X), getSenderMove(H, X, SenderGoal, [H|T], Temp, Strategy, Map)), RGL),
    aux_subtract(RGL, Errors, ReceiverGoal).

/* %First Order, Shortest Goal Path(1),
getPossibleReceiverMoves([H|T], Errors, Map, ReceiverGoal, 1, 1) :-
    append(_, [SenderGoal], [H|T]),
    findall(X, (isLegalMove(X), getSenderMove(H, X, SenderGoal, [H|T], 0, 1, Map)), RGL),
    aux_subtract(RGL, Errors, ReceiverGoal),
    length(ReceiverGoal, L),
    L>0.

%Second Order, Shortest Path(0),
getPossibleReceiverMoves([H|T], Errors, Map, ReceiverGoal, 2, 0) :-
    append(_, [SenderGoal], [H|T]),
    findall(X, (isLegalMove(X), getSenderMove(H, X, SenderGoal, [H|T], 1, 0, Map)), RGL),
    aux_subtract(RGL, Errors, ReceiverGoal),
    length(ReceiverGoal, L),
    L>0.

%Second Order, Shortest Goal Path(1),
getPossibleReceiverMoves([H|T], Errors, Map, ReceiverGoal, 2, 1) :-
    append(_, [SenderGoal], [H|T]),
    findall(X, (isLegalMove(X), getSenderMove(H, X, SenderGoal, [H|T], 1, 1, Map)), RGL),
    aux_subtract(RGL, Errors, ReceiverGoal),
    length(ReceiverGoal, L),
    L>0. */

getPathNotInMap(C, ReceiverGoal, SenderGoal, Path, Order, Strategy, Map) :-
    getPath(C, ReceiverGoal, SenderGoal, Path, Order, Strategy, Map),
    !,
    \+ member({Path, _}, Map).
%Sender
getSenderMove(_, ReceiverGoal, SenderGoal, Path, _, _, Map) :-
    member({Path, ReceiverGoal}, Map),
    append(_, [SenderGoal], Path), !.

getSenderMove(C, ReceiverGoal, SenderGoal, Path, Order, Strategy, Map) :-
    getPathNotInMap(C, ReceiverGoal, SenderGoal, Path, Order, Strategy, Map), !.

getSenderMove(CurrentLocation, ReceiverGoal, SenderGoal, Path, _, 1, _):-
    % member({Path, RGX}, Map),
    % RGX \== ReceiverGoal,
    aux_getPath(CurrentLocation, ReceiverGoal, StartToReceiverPath, hueristic_move),
    aux_getPath(ReceiverGoal, ReceiverGoal, ReceiverToReceiverPath, move),
    length(ReceiverToReceiverPath, L),
    L>1,
    combinePath(StartToReceiverPath, ReceiverToReceiverPath, StartToReceiverTwicePath),
    aux_getPath(ReceiverGoal, SenderGoal, ReceiverToSenderPath, hueristic_move),
    combinePath(StartToReceiverTwicePath, ReceiverToSenderPath, Path).


% Zero Order, Shortest Path(0),
getPath(CurrentLocation, _, SenderGoal, Path, 0, 0,_):-
    aux_getPath(CurrentLocation, SenderGoal, Path, hueristic_move).

%Zero Order, Shortest Goal Path(1),
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 0, 1, _) :-
    aux_getPath(CurrentLocation, ReceiverGoal, P1, hueristic_move),
    aux_getPath(ReceiverGoal, SenderGoal, P2, hueristic_move),
    combinePath(P1, P2, Path).

% 1st Order, Shortest Path(0),
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 1, 0, Map) :-
    aux_getPath(CurrentLocation, SenderGoal, Path, hueristic_move),
    getPossibleReceiverMoves(Path, [], Map, RGL, 0, 0),
    member(ReceiverGoal, RGL).


% 1st Order, Shortest Goal Path(1)
getPath(CurrentLocation, SenderGoal, SenderGoal, Path, 1, 1, _) :-
    aux_getPath(CurrentLocation, SenderGoal, Path, hueristic_move).
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 1, 1, Map) :-
    aux_getPath(CurrentLocation, ReceiverGoal, P1 , hueristic_move),
    aux_getPath(ReceiverGoal, SenderGoal, P2 , hueristic_move),
    combinePath(P1, P2, Path),
    getPossibleReceiverMoves(Path, [], Map, RGL, 0, 1),
    member(ReceiverGoal, RGL).


% 2nd Order, Shortest Path(0),
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 2, 0, Map) :-
    aux_getPath(CurrentLocation, SenderGoal, Path, hueristic_move),
    getPossibleReceiverMoves(Path, [], Map, RGL, 1, 0),
    member(ReceiverGoal, RGL).

% 2nd Order, Shortest Goal Path(1),
getPath(CurrentLocation, SenderGoal, SenderGoal, Path, 2, 1, _) :-
    aux_getPath(CurrentLocation, SenderGoal, Path, hueristic_move).
getPath(CurrentLocation, ReceiverGoal, SenderGoal, Path, 2, 1, Map) :-
    aux_getPath(CurrentLocation, ReceiverGoal, P1, hueristic_move),
    aux_getPath(ReceiverGoal, SenderGoal, P2, hueristic_move),
    combinePath(P1, P2, Path),
    getPossibleReceiverMoves(Path, [], Map, RGL, 1, 1),
    member(ReceiverGoal, RGL).

% [H| X] [X | T] -> [H|X|T]
combinePath([], Y, Y).
combinePath(X, [], X).
combinePath(X, [H|Y], Path) :-
    append(_, [H], X),
    append(X, Y, Path), !.
combinePath(X, Y, Path) :- append(X, Y, Path).

aux_getPath(X, X, [X], _).
aux_getPath(X, Y, [X|Path], MoveFunction) :-
    (var(Path) -> L is 0 ; length(Path, L)),
    aux_getPathHelper(X, Y, Path, MoveFunction, L).


check_length([_], _).
check_length([_, _], _).
check_length([_, _, _], _).
check_length([_, _, _, _], MoveFunction) :- MoveFunction \== move.
check_length([_, _, _, _, _], MoveFunction) :- MoveFunction \== move.

aux_getPathHelper(_, _, _, _, 10) :- !, fail.
aux_getPathHelper(X, X, [], hueristic_move, _) :- !.
aux_getPathHelper(X, X, [], _, _).
aux_getPathHelper(X, X, [H|T], MoveFunction, L) :-
    check_length([H|T], MoveFunction),
    findall(J, move(X, J, X), ResultList),
    member(H, ResultList),
    aux_getPathHelper(H, X, T, MoveFunction, L + 1).
aux_getPathHelper(X, Y, [H|T], MoveFunction, L) :-
    check_length([H|T], MoveFunction),
    findall(J, myCall(MoveFunction, X, J, Y), ResultList),
    member(H, ResultList),
    aux_getPathHelper(H, Y, T, MoveFunction, L + 1).


abs(X, Y) :-
    X < 0,
    Y is -X, !.
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
    abs(CLY - GY, Y),
    D is X + Y.

hueristic_move(C, N, G) :-
    manhattan_dist(C, G, D),
    move(C, N,_),
    manhattan_dist(N, G, DN),
    D =:= DN + 1.

%Params: currentLocation, newLocation
move((CLX, CLY), (NLX, NLY), _) :-
    NLY is CLY,
    NLX is CLX + 1,
    isLegalMove((NLX, NLY)).

move((CLX, CLY), (NLX, NLY), _) :-
    NLY is CLY,
    NLX is CLX - 1,
    isLegalMove((NLX, NLY)).

move((CLX, CLY), (NLX, NLY),_) :-
    NLX is CLX,
    NLY is CLY + 1,
    isLegalMove((NLX, NLY)).

move((CLX, CLY), (NLX, NLY),_) :-
    NLX is CLX,
    NLY is CLY - 1,
    isLegalMove((NLX, NLY)).

isLegalMove(Point) :-
    member(Point,[(1,1), (2,1), (3,1), (1,2), (2,2), (3,2), (1,3), (2,3), (3,3)]).

