/** Query option
 * @param select : tableau de chaine de caractère des noms de colonne de la table
 * @param relations: tableau de chaine de caractère des noms des tables en relations (nom precis)
 * @param join: Jointure : {alias: "user", leftJoinAndSelect: {profile: "user.profile"}}
 * @param where Exemple : [{"user.isAdmin = :isAdmin", { isAdmin: true })}, {...}, ..] // Binding request
 * @param order Le Tri : { name: "ASC", id: "DESC" }
 * @param skip Remplace le offset initialisé à 0
 * @param take Remplace le Row initialisé à 10 ou 15 par defaut.
 * @param cache definir le cache
 */

export interface QueryOptionModel {
    select: Array<string>;
    relations: Array<string>;
    join: Join;
    where: Array<object>;
    order: object;
    skip: number;
    take: number;
    cache: number | boolean | object;
}

interface Join {
    alias: string;
    leftJoinAndSelect: object;
}
