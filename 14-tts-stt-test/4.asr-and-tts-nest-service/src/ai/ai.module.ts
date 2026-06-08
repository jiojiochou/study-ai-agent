import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { ConfigService } from '@nestjs/config';
import { ChatOpenAI } from '@langchain/openai';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    {
      provide: 'CHAT_MODEL',
      useFactory: (configService: ConfigService) => {
        return new ChatOpenAI({
          model: configService.get('model_name'),
          apiKey: configService.get('model_key'),
          configuration: {
            baseURL: configService.get('model_url'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AiModule {}
