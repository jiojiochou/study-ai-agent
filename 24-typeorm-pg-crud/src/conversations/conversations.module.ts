import { Module } from '@nestjs/common';
import { ConversationService } from './conversations.service';
import { ConversationController } from './conversations.controller';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationsModule {}
