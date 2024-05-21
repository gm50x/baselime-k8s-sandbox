import { createNestApp } from '@gedai/nestjs-common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await createNestApp(AppModule, { bufferLogs: false });
  await app.listen(4000);
}
bootstrap();
