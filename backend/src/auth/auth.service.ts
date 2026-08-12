import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtPayload } from 'src/types/jwtPayload';
import { JwtService } from '@nestjs/jwt';
import { createGoogleOAuthClient } from './google-oauth.client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { name, email, password } = createAuthDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }

  async signIn(credentialsDto: CredentialsDto) {
    const { email, password } = credentialsDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payLoad: JwtPayload = {
        sub: user.id,
        username: user.name,
      };
      const token = this.jwtService.sign(payLoad);

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };
    }
    throw new UnauthorizedException();
  }

  // 1) 認可 URL を作る
  createGoogleAuthUrl(state: string) {
    const client = createGoogleOAuthClient();
    return client.generateAuthUrl({
      access_type: 'online', // refresh 不要なら online で可
      scope: ['openid', 'email', 'profile'],
      state,
      prompt: 'select_account',
      // TODO: nonceの理解
      // OIDC として厳密にするなら nonce も付ける
      // include_granted_scopes: true,
    });
  }

  // 2) code → tokens → id_token 検証 → 自前 JWT
  async signInWithGoogleCode(code: string) {
    const client = createGoogleOAuthClient();

    const { tokens } = await client.getToken(code);
    // tokens.id_token / tokens.access_token / tokens.refresh_token?

    if (!tokens.id_token) {
      throw new UnauthorizedException('id_token missing');
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new UnauthorizedException('Invalid id_token');
    }
    if (payload.email_verified === false) {
      throw new UnauthorizedException('Email not verified');
    }

    // ※ nonce を付けた場合は payload.nonce も照合する

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name ?? email;

    // let user = await this.prismaService.user.findFirst({
    //   where: { OR: [{ googleId }, { email }] },
    // });

    // if (!user) {
    //   user = await this.prismaService.user.create({
    //     data: { googleId, email, name },
    //   });
    // } else if (!user.googleId) {
    //   user = await this.prismaService.user.update({
    //     where: { id: user.id },
    //     data: { googleId },
    //   });
    // }

    // const token = this.jwtService.sign({
    //   sub: user.id,
    //   username: user.name,
    // });

    // return {
    //   token,
    //   user: { id: user.id, name: user.name, email: user.email },
    // };
  }
}
