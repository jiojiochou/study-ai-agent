import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动剥离DTO里未声明的参数
      transform: true, // 自动转换参数的类型根据DTO里面ts的类型标注和装饰器里面的type声明
      forbidNonWhitelisted: true, // 客户端传入未被DTO定义的属性的时候直接抛出异常
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
