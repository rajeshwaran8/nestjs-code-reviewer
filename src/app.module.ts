import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GithubService } from './github.service';
import { OpenAIService } from './openai.service';
import { WebhookController } from './webhook.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [WebhookController, AppController],
  providers: [GithubService, OpenAIService, AppService],
})
export class AppModule {}
