import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OtpVerificationDto } from '../dto/OtpVerification.dto';

export function VerifyotpSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Vérification du code de vérification de compte',
      description: 'Permet a un utilisateur de valider son compte',
    }),
    ApiBody({ type: OtpVerificationDto }),
    ApiOkResponse({ description: 'Retourne accesstoken et refreshtoken' }),
    ApiUnauthorizedResponse({
      description: 'Otp invalide ou expire après vérification',
    }),
    ApiInternalServerErrorResponse({
      description: 'Erreur de mise a jour bdd',
    }),
    ApiBadRequestResponse({
      description: 'Email format invalide ou otp format invalide',
    }),
  );
}
