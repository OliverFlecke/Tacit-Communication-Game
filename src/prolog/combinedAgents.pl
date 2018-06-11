:- use_module(library(lists)).
:- use_module(library(random)).

%Auxillary Function
aux_subtract([], _, []) :- !.
aux_subtract([A|C], B, D) :-
        member(A, B), !,
        aux_subtract(C, B, D).
aux_subtract([A|B], C, [A|D]) :-
        aux_subtract(B, C, D).

aux_matchMap(_,[],[]).

aux_matchMap(P, M, O) :-
    append(_, [X], P),
    append(W, [{Q,_}], M),
    \+ append(_, [X], Q),
    aux_matchMap(P, W, O).

aux_matchMap(P, M, [Y|Z]) :-
    append(_, [X], P),
    append(W, [{Q,Y}], M),
    append(_, [X], Q),
    aux_matchMap(P, W, Z).



%Receiver
%Params: Path, Errors, Map, Result, Order, Strategy
getReceiverMove(P, _, M, X, _, _) :-
    member({P,X}, M).


%Zero Order, Shortest Goal Path(1)
getReceiverMove(P, E, _, R, 0, 1) :-
    aux_subtract(P, E, PL),
    random_member(R, PL).

%First Order, Shortest Path(0)
getReceiverMove(P, E, M, R, 1, 0) :-
    aux_subtract([(1,1), (2,1), (3,1), (1,2), (2,2), (3,2), (1,3), (2,3), (3,3)], E, PL),
    aux_matchMap(P, M, O),
    aux_subtract(PL, O, PO),
    random_member(R, PO), !.

%First Order, Shortest Goal Path(1)
getReceiverMove(P, E, M, R, 1, 0) :-
    aux_subtract(P, E, PL),
    aux_matchMap(P, M, O),
    aux_subtract(PL, O, PO),
    random_member(R, PO), !.

getReceiverMove(_, E, _, X, _, _) :-
    aux_subtract([(1,1), (2,1), (3,1), (1,2), (2,2), (3,2), (1,3), (2,3), (3,3)], E, PL),
    random_member(X, PL).


%Zero Order, Any Strategy
getPossibleReceiverMoves(P, _, M, [X|[]], 0, _) :-
    member({P,X}, M).

%Zero Order, Shortest Goal Path(1)
getPossibleReceiverMoves(P, E, _, PL, 0, 1) :-
    aux_subtract(P, E, PL).

%Zero Order, Shortest Path(0)
getPossibleReceiverMoves(_, E, _, PL, 0, 0) :-
    aux_subtract([(1,1), (2,1), (3,1), (1,2), (2,2), (3,2), (1,3), (2,3), (3,3)], E, PL).



%Sender
getSenderMove(_, R, SG, P, _, _, M) :-
    member({P, R}, M),
    append(_, [SG], P), !.

getSenderMove(C, R, SG, P, OR, S, M) :-
    getPath(C, R, SG, P, OR, S, M),
    \+ member({P, _}, M), !.


%getPath Params: CurrentLocation, ReceiverGoalLocation, SenderGoalLocation, Path, Order, Strategy, Map
/* Strategy:
    0 - Short
    1 - Short + Goal
    2 - Minimize number of unique cells
    3 - Symmetry

*/
% Zero Order, Shortest Path(0),
getPath(CL, _, SG, P, 0, 0,_):-
    aux_getPath(CL, SG, P).


%Zero Order, Shortest Goal Path(1),
getPath(CL, RG, SG, P, 0, 1, _) :-
    aux_getPath(CL, RG, P1),
    aux_getPath(RG, SG, P2),
    append(P1, P2, P).

% 1st Order, Shortest Path(0),
getPath(CL, RG, SG, P, 1, 0, M) :-
    %Path, Errors, Map, Result
    aux_getPath(CL, SG, P),
    % append(_, [SG], P),
    getPossibleReceiverMoves(P, [], M, RGL, 0, 0),
    member(RG, RGL).


% 1st Order, Shortest Goal Path(1)
getPath(CL, SG, SG, P, 1, 1, _) :-
    aux_getPath(CL, SG, P).
getPath(CL, RG, SG, P, 1, 1, M) :-
    aux_getPath(CL, RG, P1),
    aux_getPath(RG, SG, P2),
    combinePath(P1, P2, P),
    getPossibleReceiverMoves(P, [], M, RGL, 0, 1),
    member(RG, RGL).

% [H| X] [X | T] -> [H|X|T]
combinePath([], Y, Y).
combinePath(X, [], X).
combinePath(X, [H|Y], P) :-
    append(_, [H], X),
    append(X, Y, P), !.
combinePath(X, Y, P) :- append(X, Y, P).

aux_getPath(X, X, []) :- !.
aux_getPath(X, Y, [X|P]) :- aux_getPathHelper(X, Y, P), !.

aux_getPathHelper(X, X, []) :- !.
aux_getPathHelper(H, Y, [X|T]) :-
    length(T, L), L < 10,
    hueristic_move(H, X, Y),
    aux_getPathHelper(X, Y, T).

abs(X, Y) :-
    X < 0,
    Y is -X, !.
abs(X, X).

manhattan_dist((CLX, CLY), (GX, GY), D) :-
    abs(GX - CLX, X),
    abs(CLY - GY, Y),
    D is X + Y.

hueristic_move(C, N, G) :-
    manhattan_dist(C, G, D),
    move(C, N),
    manhattan_dist(N, G, DN),
    D =:= DN + 1.

%Params: currentLocation, newLocation
move((CLX, CLY), (NLX, NLY)) :-
    NLY is CLY,
    NLX is CLX + 1,
    isWithInBounds(NLX),
    isWithInBounds(NLY).

move((CLX, CLY), (NLX, NLY)) :-
    NLY is CLY,
    NLX is CLX - 1,
    isWithInBounds(NLX),
    isWithInBounds(NLY).

move((CLX, CLY), (NLX, NLY)) :-
    NLX is CLX,
    NLY is CLY + 1,
    isWithInBounds(NLX),
    isWithInBounds(NLY).

move((CLX, CLY), (NLX, NLY)) :-
    NLX is CLX,
    NLY is CLY - 1,
    isWithInBounds(NLX),
    isWithInBounds(NLY).


isWithInBounds(X) :-
    >(X,0),
    <(X,4).

