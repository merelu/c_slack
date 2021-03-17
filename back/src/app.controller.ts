import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// req, res에 대해 알아요
//공통적인 라우터
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get('user') // GET /user
  // getUser(): string {
  //   return this.appService.getUser();
  // }
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
