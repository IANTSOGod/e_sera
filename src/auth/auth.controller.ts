import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Accesstokendto } from 'src/interfaces/dto/accesstoken.dto';
import { Credentialdto } from 'src/interfaces/dto/credential.dto';
import { Logindto } from 'src/interfaces/dto/login.dto';
import { OtpSendDto } from 'src/interfaces/dto/OtpSend.dto';
import { OtpVerificationDto } from 'src/interfaces/dto/OtpVerification.dto';
import { ResetpasswordDto } from 'src/interfaces/dto/Resetpassword.dto';
import { Signupdto } from 'src/interfaces/dto/signup.dto';
import { AuthService } from './auth.service';
import { JwtAccessAuthGuard } from './guards/JwtAccessAuthGuard';
import { JwtRefreshAuthGuard } from './guards/JwtRefreshAuthGuard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @UseGuards(JwtAccessAuthGuard)
  @Get('/me')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtention info utilisateur',
    description: 'Nécessite un accestoken en Authorization: Bearer token',
  })
  @ApiOkResponse({
    description: 'Retourne des info utilisateur',
  })
  @ApiUnauthorizedResponse({
    description: 'Access token invalide',
  })
  private me(@Request() req: { user: Credentialdto }) {
    return req.user;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('/access')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Renouvellement accesstoken',
    description:
      'Necessite un refreshtoken non expiré en Authorization: Bearer token',
  })
  @ApiOkResponse({ description: 'Retourne un accesstoken ' })
  @ApiUnauthorizedResponse({
    description: 'Refresh token invalide nécessite un re-login',
  })
  private access(@Request() req: { user: Accesstokendto }) {
    return { accessToken: req.user.accesstoken };
  }

  @Post('/login')
  @ApiOperation({
    summary: 'Connexion utilisateur',
    description:
      'Permet a un utilisateur de se connecter et retourne accesstoken et refresh token',
  })
  @ApiBody({ type: Logindto })
  @ApiOkResponse({ description: 'Donne accesstoken et refreshtoken' })
  @ApiUnauthorizedResponse({
    description: 'Mot de passe incorrect ou email non verifie',
  })
  @ApiNotFoundResponse({ description: 'utilisateur non trouvé' })
  @ApiBadRequestResponse({ description: 'Mdp(Length=8),email(test@gmail.com)' })
  async login(@Body() body: Logindto) {
    return this.authservice.login(body);
  }

  @Post('/register/EAP')
  @ApiOperation({
    summary: 'Inscription utilisateur via email',
    description: 'Permet de creer un compte utilisateur de base non vérifié',
  })
  @ApiBody({ type: Signupdto })
  @ApiOkResponse({
    description: 'Utilisateur cree avec succes et retourne l email a confirme',
  })
  @ApiInternalServerErrorResponse({ description: 'Inscription en bdd echoué' })
  @ApiBadRequestResponse({
    description:
      'Mdp(Length=8),email(test@gmail.com),username(string not null)',
  })
  async registerEAP(@Body() body: Signupdto) {
    return this.authservice.registerEmailandPassword(body);
  }

  @Post('/sendotp')
  @ApiOperation({
    summary: 'Envoi de code de vérification de compte',
    description:
      'Permet a un utilisateur de recevoir un code otp pour la vérification de compte',
  })
  @ApiBody({ type: OtpSendDto })
  @ApiOkResponse({ description: 'Otp envoyé par email' })
  @ApiInternalServerErrorResponse({ description: 'Problème env email' })
  async sendotp(@Body() body: OtpSendDto) {
    return this.authservice.sendOtp(body);
  }

  @Post('/verifyotp')
  @ApiOperation({
    summary: 'Vérification du code de vérification de compte',
    description: 'Permet a un utilisateur de valider son compte',
  })
  @ApiBody({ type: OtpVerificationDto })
  @ApiOkResponse({ description: 'Retourne accesstoken et refreshtoken' })
  @ApiUnauthorizedResponse({ description: 'Otp invalide ou expire' })
  @ApiInternalServerErrorResponse({ description: 'Erreur de mise a jour bdd' })
  async verifyotp(@Body() body: OtpVerificationDto) {
    return this.authservice.verifyAccount(body);
  }

  @Post('/sendresetcode')
  @ApiOperation({
    summary: 'Envoi du code de changement de mot de passe',
    description:
      'Permet a un utilisateur de recevoir un code pour pouvoir acceder apres a la page de changement de mot de passe',
  })
  @ApiBody({ type: OtpSendDto })
  async sendresetcode(@Body() body: OtpSendDto) {
    return this.authservice.sendResetCode(body);
  }

  @Post('/resetpassword')
  @ApiOperation({
    summary: 'Changement de mdp',
    description: 'Permet a un utilisateur de changer son mdp',
  })
  @ApiBody({ type: ResetpasswordDto })
  async resetpassword(@Body() body: ResetpasswordDto) {
    return this.authservice.resetPassword(body);
  }
}
