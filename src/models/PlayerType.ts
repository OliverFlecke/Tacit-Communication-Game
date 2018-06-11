enum PlayerType {
    Human,
    ZeroOrder,
    FirstOrder,
    SecondOrder,
}

export function PlayerTypeValues(): PlayerType[] {
    return Object.keys(PlayerType).filter(x => isNaN(Number(x))).map(x => PlayerType[x]);
}

export default PlayerType;