import { Controller, Post, Headers, Body } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly githubService: GithubService) {}

  @Post()
  async handleWebhook(@Headers('X-GitHub-Event') event: string, @Body() payload: any) {
    console.log("Received webhook");
    console.log("Event: ", event);
    console.log("Payload: ", payload);
    if (payload.number && payload.action === 'opened') {
      console.log("Processing pull request");
      await this.githubService.processPullRequest(payload);
    }
    return { message: 'Webhook received' };
  }
}
