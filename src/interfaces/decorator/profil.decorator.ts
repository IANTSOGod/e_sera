import {
  applyDecorators,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function ProfileSwagger() {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    UseInterceptors(FileInterceptor('profilePhoto')),
    ApiOperation({ summary: 'Mettre à jour la photo de profil' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'Photo de profil et email',
      schema: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            description: "Email de l'utilisateur",
          },
          profilePhoto: {
            type: 'string',
            format: 'binary',
            description: 'Fichier image (JPG, PNG, WEBP)',
          },
        },
        required: ['email', 'profilePhoto'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Photo de profil mise à jour avec succès',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          photoUrl: { type: 'string' },
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Données invalides' }),
    ApiResponse({ status: 404, description: 'Utilisateur non trouvé' }),
  );
}
