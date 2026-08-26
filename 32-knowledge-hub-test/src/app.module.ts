import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentModule } from './document/document.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { DocumentEntity } from './document/entities/document.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 配置管理模块, 主要用于加载环境变量
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // 通知nestjs把provide按数组的顺序传给useFactory参数
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('POSTGRES_HOST', 'localhost'),
        port: config.get<number>('POSTGRES_PORT', 5432),
        username: config.get<string>('POSTGRES_USER', 'user'),
        password: config.get<string>('POSTGRES_PASSWORD', '123456'),
        database: config.get<string>('POSTGRES_DB', 'knowledge_hub'),
        entities: [DocumentEntity],
        synchronize: false,
      }),
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>(
          'MONGO_URI',
          'mongodb://mongo_user:mongo_pass123@localhost:27017/knowledge_hub?authSource=admin',
        ),
      }),
    }),
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
