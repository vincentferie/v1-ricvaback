export enum State {
    pending = 0,
    validated = 1,
    rejected = -1
}

export enum StateLots {
    nantis = 1,
    relacher = 2,
    denantis = 3,
}
export enum StateEmpotage {
    chm_conteneur = 1,
    chm_plomb = 2,
    surpoids = 3,

}

export enum StateChargement {
    valider = 1,
    rejeter = 0,
    refraction = 2
}

export enum StateTirage {
    decouvert = 1,
    nantissement = 2,
    rapatriement = 3,
    subvention = 4,
    autres = 5
}

export enum StateBooking{
    encours = 0,
    terminer = 1
}