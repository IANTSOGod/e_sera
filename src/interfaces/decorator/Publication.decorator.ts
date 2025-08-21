import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Createpubdto } from '../dto/createpub.dto';

export function Publicationswagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Creation de publication',
      description:
        'Un utilisateur cree une publication de base sans image,coms,partage',
    }),
    ApiOkResponse({
      description: 'Renvoie un message de publication créé',
    }),
    ApiBody({ type: Createpubdto }),
    ApiInternalServerErrorResponse({
      description: "message d'erreur de publication",
    }),
    ApiBadRequestResponse({
      description: 'Un des champs est vide',
    }),
  );
}
