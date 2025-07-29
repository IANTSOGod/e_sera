import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { OtpSendDto } from '../dto/OtpSend.dto';

export function SendotpSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Envoi de code de vérification de compte',
      description:
        'Permet a un utilisateur de recevoir un code otp pour la vérification de compte',
    }),
    ApiBody({ type: OtpSendDto }),
    ApiOkResponse({ description: 'Otp envoyé par email' }),
    ApiInternalServerErrorResponse({ description: 'Problème env email' }),
    ApiBadRequestResponse({ description: 'Email format invalide' }),
  );
}
