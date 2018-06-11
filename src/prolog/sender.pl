:- use_module(library(lists)).
:- use_module(library(random)).

getMove(_, R, S, P, _, M) :-
    member({P, R}, M),
    append(_, [S], P), !.

getMove(C, R, S, P, OR, M) :-
    getPath(C, R, S, P, OR, 0, M),
    \+ member({P, _}, M), !.

%getPath - Params: currentLocation, ReceiverGoalLocation, SenderGoalLocation, Path, Order, TouchedRG, Strategy
/* Strategy:
    0 - Short
    1 - Short + Goal
    2 - Minimize number of unique cells
    3 - Symmetry

*/


%We're at combined goal with no more path to travel
getPath(CL, CL, CL, [], _, _, _) :-
        !.
    
%We're at our goal and have touched receivers goal
getPath(CL, _, CL, _, _, 1, S) :- 
    S =< 1,
    !.

%We're at our goal and we dont care if we touched hers
getPath(CL, _, CL, [CL|[]], 0, _,  0):- !.

%We're at receiver goal, should update that we have touched it
getPath((CLX, CLY), (CLX, CLY), SG, [(CLX,CLY)|T], OR, 0, 1) :-
    length([(CLX,CLY)|T], X),
    X =< 7,
    append(_, [SG], [(CLX,CLY)|T]),
    move((CLX,CLY), (NLX, NLY)),
    getPath((NLX, NLY), (CLX, CLY), SG, T, OR, 1, 1).

%Have touched receivers goal
getPath((CLX, CLY), RG, SG, [(CLX,CLY)|T], OR, 1, 1) :-
    move((CLX,CLY), (NLX, NLY)),
    getPath((NLX, NLY), RG, SG, T, OR, 1, 1).

%Path must include recievers goal
getPath((CLX, CLY), (RGX,RGY), (SGX,SGY), [(CLX,CLY)|T], OR, 0,S) :-
    length([(CLX,CLY)|T], X),
    X =< 7,
    member((RGX,RGY),  [(CLX,CLY)|T]),
    move((CLX,CLY), (NLX, NLY)),
    getPath((NLX, NLY), (RGX,RGY), (SGX,SGY), T, OR, 0,S).

%Basic
getPath((CLX, CLY), RG, SG, [(CLX,CLY)|T], 0, 0, S) :-
    length([(CLX,CLY)|T], X),
    X =< 7,
    move((CLX,CLY), (NLX, NLY)),
    getPath((NLX, NLY), RG, SG, T, 0, 0, S).


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

