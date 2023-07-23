import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);
  await appService.startVenomSession(); // Iniciar a sessão do WhatsApp antes de ouvir na porta 3000
  await app.listen(3000);
}

bootstrap();
