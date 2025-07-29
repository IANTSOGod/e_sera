import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResetpasswordDto } from '../dto/Resetpassword.dto';

export function ResetpasswordSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Changement de mdp',
      description: 'Permet a un utilisateur de changer son mdp',
    }),
    ApiBody({ type: ResetpasswordDto }),
    ApiOkResponse({
      description: 'Message de confirmation de mot de passe changé',
    }),
    ApiUnauthorizedResponse({
      description: 'Otp invalide ou expiré après vérification',
    }),
    ApiNotFoundResponse({
      description: 'Email Utilisateur non enregistré dans la bdd',
    }),
    ApiBadRequestResponse({
      description: 'Otp invalide ou Email format invalide',
    }),
  );
}
