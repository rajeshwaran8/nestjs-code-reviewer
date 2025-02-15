import { Controller, Post, Headers, Body } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly githubService: GithubService) {}

  @Post()
  async handleWebhook(@Headers('X-GitHub-Event') event: string, @Body() payload: any) {
    if (event === 'pull_request' && payload.action === 'opened') {
      await this.githubService.processPullRequest(payload);
    }
    return { message: 'Webhook received' };
  }
}
    