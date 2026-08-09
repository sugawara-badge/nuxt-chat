import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req) {
    console.log('req---------------------------', req);
    return {
      name: 'オオタスカシバコンサルタント',
      title: 'ITコンサルタント / エンジニア',
      bio: '製造業DXやアプリ開発（NestJS）、ネットワークインフラまで幅広く対応しています。',
    };
  }
}
