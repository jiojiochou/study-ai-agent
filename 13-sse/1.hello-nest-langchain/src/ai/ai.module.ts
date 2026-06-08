import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ChatOpenAI } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: 'CHAT_MODEL',
      useFactory(configService: ConfigService) {
        return new ChatOpenAI({
          model: configService.get<string>('model_name')!,
          apiKey: configService.get<string>('model_key')!,
          temperature: 0.7,
          configuration: {
            baseURL: configService.get<string>('model_url')!,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AiModule {}
