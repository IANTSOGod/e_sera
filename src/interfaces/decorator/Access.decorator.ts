import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function AccessSwagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Renouvellement accesstoken',
      description:
        'Necessite un refreshtoken non expiré en Authorization: Bearer token',
    }),
    ApiOkResponse({ description: 'Retourne un accesstoken ' }),
    ApiUnauthorizedResponse({
      description: 'Refresh token invalide nécessite un re-login',
    }),
  );
}
