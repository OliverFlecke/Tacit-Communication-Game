:- use_module(library(lists)).
:- use_module(library(random)).

%Params: Path, Errors, Map, Result
getMove(P, _, M, X, OR) :-
    OR >= 0,
    member({P,X}, M).

getMove(_, E, _, X, OR) :-
    OR >= 0,
    subtract([(1,1), (2,1), (3,1), (1,2), (2,2), (3,2), (1,3), (2,3), (3,3)], E, PL),
    random_member(X, PL).

%Auxillary Function
subtract([], _, []) :- !.
subtract([A|C], B, D) :-
        member(A, B), !,
        subtract(C, B, D).
subtract([A|B], C, [A|D]) :-
        subtract(B, C, D).