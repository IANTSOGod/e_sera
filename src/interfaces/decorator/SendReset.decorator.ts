import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { OtpSendDto } from '../dto/OtpSend.dto';

export function SendResetSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Envoi du code de changement de mot de passe',
      description:
        'Permet a un utilisateur de recevoir un code pour pouvoir acceder apres a la page de changement de mot de passe',
    }),
    ApiBody({ type: OtpSendDto }),
    ApiOkResponse({ description: 'Message de confirmation envoi email' }),
    ApiInternalServerErrorResponse({ description: 'Message email non envoyé' }),
    ApiBadRequestResponse({ description: 'Email format invalide' }),
  );
}
