import { Controller, Get, Post, Req } from '@nestjs/common';
import { Res } from '@nestjs/common/decorators';
import { json } from 'stream/consumers';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('sendMessage')
  sendMessage(@Req() req: any, @Res() res: any) {
    const body = req.body;
    console.log("numb", body?.number, "text", body?.text);

    return this.appService.sendMessage(body?.number, body?.text);
  }

  @Get('contacts')
  getContacts(@Res() res: any) {
    return this.appService.getContacts(res);
  }



}
