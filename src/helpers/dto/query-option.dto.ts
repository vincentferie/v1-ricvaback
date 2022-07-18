
import { IsOptional, IsNotEmpty, IsArray, IsObject, IsString, IsNumber } from "class-validator";


/** Join
*@param alias: table name (user)
*@param leftJoinAndSelect: {profile: "user.profile",...}
*/
class Join {
    @IsString()
    alias: string;

    @IsObject()
    leftJoinAndSelect: Object;
}

/** Cache
*@param id: optional define table name(users_admins)
*@param milliseconds: Temps de mise en cache. Obligatoire avec id 25000
*@param duration: utiliser seul en specifiant la durée du caching 25000
*/
class Cache {
    @IsString()
    @IsOptional()
    id: string;

    @IsNumber()
    @IsOptional()
    milliseconds: number;

    @IsNumber()
    @IsOptional()
    duration: number;
}


/** Query option
 * @param select: tableau de chaine de caractère des noms de colonne de la table
 * @param relations: tableau de chaine de caractère des noms des tables en relations (nom precis)
 * @param join: Jointure : {alias: "user", leftJoinAndSelect: {profile: "user.profile"}}
 * @param where Exemple : [{"user.isAdmin = :isAdmin", { isAdmin: true })}, {...}, ..] // Binding request
 * @param order Le Tri : { name: "ASC", id: "DESC" }
 * @param skip Remplace le offset mettre 0
 * @param take Remplace le Row mettre a 10 ou 15 par defaut.
 * @param cache definir le cache
 */
export class QueryOptionDto {
    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    select: Array<string>;

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    relations: Array<string>;

    @IsOptional()
    @IsNotEmpty()
    @IsObject()
    join: Join; // Specifier mieux la relation

    @IsOptional()
    @IsNotEmpty()
    @IsArray()
    where: Array<Object>//[{ mode: "Timber" }]

    @IsOptional()
    @IsNotEmpty()
    @IsObject()
    order: Object;//{ name: "ASC", id: "DESC" }

    @IsOptional()
    @IsNumber()
    skip: number;  // Remplace le Offset en Postgres pour les paginations

    @IsOptional()
    @IsNumber()
    take: number;  // Remplace le Row en Postgres pour les paginations

    @IsOptional()
    cache: number | boolean | Cache;
}
