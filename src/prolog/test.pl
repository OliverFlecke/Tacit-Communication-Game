% % Products
% item(id(1), name(bread)).
% item(id(2), name(water)).
% item(id(3), name(apple)).
% % Shops
% shop(id(1), name(tau), location(spain)).
% shop(id(2), name(swi), location(netherlands)).
% % Stock
% stock(item(1), shop(1), count(23), price(0.33)).
% stock(item(2), shop(1), count(17), price(0.25)).
% stock(item(2), shop(2), count(34), price(0.31)).
% stock(item(3), shop(2), count(15), price(0.45)).



p(a).
p(b).
p(a, b).

test([H|T]) :-
    writeln(H),
    test(T).