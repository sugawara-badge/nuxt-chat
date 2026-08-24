import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import {
  Strategy,
  Profile,
  GoogleCallbackParameters,
} from 'passport-google-oauth20';

config(); // .envファイルを使えるようにする

// 第3引数 true = validate の引数個数+1 を Passport に伝え、params(id_token) を受け取る
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google', true) {
  constructor() {
    console.log('GoogleStrategy-constructor------------------');
    // Passportのstrategyに関する設定
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.CALLBACK_URL!,
      scope: ['openid', 'email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    params: GoogleCallbackParameters,
    profile: Profile,
  ) {
    console.log('GoogleStrategy-validate------------------', params);

    const { name, emails, photos } = profile;

    return {
      email: emails?.[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0]?.value,
      accessToken,
      idToken: params.id_token,
    };
  }
}
