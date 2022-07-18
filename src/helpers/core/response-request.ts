/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { isObject } from "util";
import { HttpStatus } from "@nestjs/common";
import { isEmpty } from "class-validator";

export const responseRequest = (paramResponse: ParamResponse) => {
    let response;
    let stateTab = 0;

    if (isObject(paramResponse)) {

        switch (paramResponse.status) {
            case 'other': {
                response = {
                    response: {
                        state: HttpStatus.OK,
                        message: paramResponse.params,
                        data: paramResponse.data,
                    },
                }; stateTab = HttpStatus.OK;
            } break;
            case 'found': {
                response = {
                    response: {
                        state: HttpStatus.ACCEPTED,
                        message: paramResponse.data.length + ' trouvé(s)',
                        data: paramResponse.data,
                    },
                }; stateTab = HttpStatus.ACCEPTED;
            } break;
            case 'foundQuery': {
                response = {
                    response: {
                        state: HttpStatus.ACCEPTED,
                        message: paramResponse.params + ' trouvé(s)',
                        data: paramResponse.data
                    }
                }; stateTab = HttpStatus.ACCEPTED;
            } break;
            case 'errorFound': {
                response = {
                    response: {
                        state: HttpStatus.NOT_FOUND,
                        message: !isEmpty(paramResponse.params) ? paramResponse.params : `Aucun résultat trouvé!`,
                        data: paramResponse.data
                    }
                }; stateTab = HttpStatus.NOT_FOUND;
            } break;
            case 'inserted': {
                response = {
                    response: {
                        state: HttpStatus.CREATED,
                        message: 'Insertion éffectué avec succès!',
                        data: paramResponse.data
                    }
                }; stateTab = HttpStatus.CREATED;
            } break;
            case 'errorInserted': {
                response = {
                    response: {
                        state: HttpStatus.CONFLICT,
                        message: !isEmpty(paramResponse.params) ? paramResponse.params : `L'insertion à échouer!`,
                        data: paramResponse.data
                    }
                }; stateTab = HttpStatus.CONFLICT;
            } break;
            case 'updated': {
                response = {
                    response: {
                        state: HttpStatus.ACCEPTED,
                        message: `Les données ont été mise à jour!`,
                        data: paramResponse.data
                    }
                }; stateTab = HttpStatus.ACCEPTED;
            } break;
            case 'errorUpdated': {
                response = {
                    response: {
                        state: HttpStatus.NOT_ACCEPTABLE,
                        message: Object.keys(paramResponse.params).length > 0 ? paramResponse.params : `La mise à jour à échouer!`,
                        data: paramResponse.data
                    }
                }; stateTab = HttpStatus.NOT_ACCEPTABLE;
            } break;
            case 'deleted': {
                response = {
                    response: {
                        state: HttpStatus.ACCEPTED,
                        message: `Les données ont été supprimé avec succès!`,
                        data: paramResponse.data
                    }
                }; stateTab = HttpStatus.ACCEPTED;
            } break;
            case 'errorDeleted': {
                response = {
                    response: {
                        state: HttpStatus.NOT_ACCEPTABLE,
                        message: Object.keys(paramResponse.params).length > 0 ? paramResponse.params : `La suppression à échouer!`,
                        data: paramResponse.data
                    }
                }; stateTab = HttpStatus.NOT_ACCEPTABLE;
            } break;
            case 'errorRequest': {
                response = {
                    response: {
                        state: HttpStatus.BAD_REQUEST,
                        message: paramResponse.params ?? `Les paramètres de la requêtes ne sont pas acceptés!`,
                        data: paramResponse.data
                    }
                }; stateTab = HttpStatus.BAD_REQUEST;
            } break;
            case 'errorPayload': {
                response = {
                    response: {
                        state: HttpStatus.PAYLOAD_TOO_LARGE,
                        message: paramResponse.params ?? `La taille de la payload est supérieur à celle definie!`,
                        data: paramResponse.data
                    },
                }; stateTab = HttpStatus.PAYLOAD_TOO_LARGE;
            } break;
            case 'errorOtherRequest': {
                response = {
                    response: {
                        state: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: paramResponse.params ?? `Une erreur interne est survenue, Verifier les logs!`,
                        data: paramResponse.data
                    },
                }; stateTab = HttpStatus.INTERNAL_SERVER_ERROR;
            } break;
            case 'unAutorized': {
                response = {
                    response: {
                        state: HttpStatus.UNAUTHORIZED,
                        message: paramResponse.params ?? `Vous n'avez pas d'autorisation valide!`,
                        data: paramResponse.data
                    },
                }; stateTab = HttpStatus.UNAUTHORIZED;
            } break;
            default: break;
        }
    }

    return [response, stateTab];
};

export interface ParamResponse {
    status: string;
    params: any;
    data: any;
}