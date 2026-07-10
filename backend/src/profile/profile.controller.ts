import { Controller, Get } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  @Get()
  getProfile() {
    return {
      name: 'オオタスカシバコンサルタント',
      title: 'ITコンサルタント / エンジニア',
      bio: '製造業DXやアプリ開発（NestJS）、ネットワークインフラまで幅広く対応しています。',
    };
  }
}
