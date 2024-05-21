import { createNestApp } from '@gedai/nestjs-common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await createNestApp(AppModule, { bufferLogs: false });
  const config = app.get(ConfigService);
  const port = config.get('PORT', '3000');
  await app.listen(port);
}
bootstrap();
