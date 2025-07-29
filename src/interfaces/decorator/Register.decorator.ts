import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Signupdto } from '../dto/signup.dto';

export function RegisterSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Inscription utilisateur via email',
      description: 'Permet de creer un compte utilisateur de base non vérifié',
    }),
    ApiBody({ type: Signupdto }),
    ApiOkResponse({
      description:
        'Utilisateur cree avec succes et retourne l email a confirme',
    }),
    ApiInternalServerErrorResponse({
      description: 'Inscription en bdd echoué',
    }),
    ApiBadRequestResponse({
      description:
        'Mdp(Length=8),email(test@gmail.com),username(string not null)',
    }),
  );
}
