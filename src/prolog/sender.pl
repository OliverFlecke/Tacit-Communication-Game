%Params: currentLocation, ReceiverGoalLocation, SenderGoalLocation, 
getPath(CL, CL, CL, P) :- 
    writeln(P),
    !.

getPath(CL, RG, CL, P) :-
    member(RG, P),
    writeln(P),
    !.

getPath((CLX, CLY), (RGX,RGY), (SGX,SGY), P) :-
    length(P, X),
    X < 6,
    move((CLX,CLY), (NLX, NLY)),
    append([(NLX,NLY)], P, NP),
    getPath((NLX, NLY), (RGX,RGY), (SGX,SGY), NP).


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

