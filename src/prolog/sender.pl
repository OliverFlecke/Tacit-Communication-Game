:- use_module(library(lists)).
:- use_module(library(random)).

getMove(_, R, S, P, _, M) :-
    member({P, R}, M),
    append(_, [S], P), !.

getMove(C, R, S, P, OR, M) :-
    getPath(C, R, S, P, OR, 0, M),
    \+ member({P, _}, M), !.

getPath(CL, CL, CL, [], _, _, _) :-
    !.

getPath(CL, _, CL, _, _, 1, _) :- !.


%Params: currentLocation, ReceiverGoalLocation, SenderGoalLocation, Path, Order, TouchedRG, Map
getPath((CLX, CLY), (CLX, CLY), SG, [(CLX,CLY)|T], OR, 0, M) :-
    length([(CLX,CLY)|T], X),
    X =< 7,
    OR >= 1,
    append(_, [SG], [(CLX,CLY)|T]),
    move((CLX,CLY), (NLX, NLY)),
    getPath((NLX, NLY), (CLX, CLY), SG, T, OR, 1, M).



getPath((CLX, CLY), RG, SG, [(CLX,CLY)|T], OR, 1, M) :-
    move((CLX,CLY), (NLX, NLY)),
    getPath((NLX, NLY), RG, SG, T, OR, 1, M).


getPath((CLX, CLY), (RGX,RGY), (SGX,SGY), [(CLX,CLY)|T], OR, 0, M) :-
    length([(CLX,CLY)|T], X),
    X =< 7,
    member((RGX,RGY),  [(CLX,CLY)|T]),
    move((CLX,CLY), (NLX, NLY)),
    getPath((NLX, NLY), (RGX,RGY), (SGX,SGY), T, OR, 0, M).


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

