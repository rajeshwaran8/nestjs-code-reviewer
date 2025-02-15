import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubService } from './github.service';
import { OpenAIService } from './openai.service';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [WebhookController],
  providers: [GithubService, OpenAIService],
})
export class AppModule {}
