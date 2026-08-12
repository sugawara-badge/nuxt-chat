import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { User } from 'generated/prisma/client';
import { CredentialsDto } from './dto/credentials.dto';
import { randomBytes } from 'crypto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async create(@Body() createAuthDto: CreateAuthDto): Promise<User> {
    return await this.authService.create(createAuthDto);
  }

  @Post('signin')
  async signIn(@Body() credentialsDto: CredentialsDto) {
    return await this.authService.signIn(credentialsDto);
  }

  @Get('google')
  googleAuth(@Res() res: Response) {
    const state = randomBytes(16).toString('hex');
    // CSRF 対策: state を Cookie（またはセッション）に保存
    res.cookie('oauth_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 10 * 60 * 1000,
    });
    const url = this.authService.createGoogleAuthUrl(state);

    // TODO: 不要になったら削除
    console.log('1-url-----------------------', url);
    return res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const savedState = req.cookies?.['oauth_state'];
    console.log('savedState----------------------', savedState);
    res.clearCookie('oauth_state');
    if (!code || !state || !savedState || state !== savedState) {
      throw new UnauthorizedException('Invalid OAuth state');
    }
    const result = await this.authService.signInWithGoogleCode(code);
    // フロントへ自前 JWT を渡す（簡易例）
    const redirectUrl =
      `${process.env.FRONTEND_URL}/auth/callback` +
      `?token=${encodeURIComponent(result.token)}` +
      `&id=${encodeURIComponent(result.user.id)}` +
      `&name=${encodeURIComponent(result.user.name)}`;
    console.log('redirectUrl---------------', redirectUrl);
    // return res.redirect(redirectUrl);
  }
}
