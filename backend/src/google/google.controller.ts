import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  // ここにリクエストがいくことでoauth認証フローのスタート
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {}

  // 認証フローが終了し、アクセストークンを取得したら、ここにリダイレクトされる
  @Get('redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req) {
    // この時点でreq.userに上のほうで定義したvalidateで抜き出した認証情報が入っている(名前、メールアドレス、画像など)
    // 具体的な処理はserviceにやらせる
    return this.googleService.googleLogin(req);
  }
}
