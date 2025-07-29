import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function Meswagger() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obtention info utilisateur',
      description: 'Nécessite un accestoken en Authorization: Bearer token',
    }),
    ApiOkResponse({
      description: 'Retourne des info utilisateur',
    }),
    ApiUnauthorizedResponse({
      description: 'Access token invalide',
    }),
  );
}
