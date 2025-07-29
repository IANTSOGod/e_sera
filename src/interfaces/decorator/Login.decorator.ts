import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Logindto } from '../dto/login.dto';

export function LoginSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Connexion utilisateur',
      description:
        'Permet a un utilisateur de se connecter et retourne accesstoken et refresh token',
    }),
    ApiBody({ type: Logindto }),
    ApiOkResponse({ description: 'Donne accesstoken et refreshtoken' }),
    ApiUnauthorizedResponse({
      description: 'Mot de passe incorrect ou email non verifie',
    }),
    ApiNotFoundResponse({ description: 'utilisateur non trouvé' }),
    ApiBadRequestResponse({
      description: 'Mdp(Length=8),email(test@gmail.com)',
    }),
  );
}
