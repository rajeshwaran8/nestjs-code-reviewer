import { Injectable } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import axios from 'axios';

@Injectable()
export class GithubService {
  private readonly githubToken = process.env.GITHUB_TOKEN;

  constructor(private readonly openAIService: OpenAIService) {}

  async processPullRequest(payload: any) {
    const repo = payload.repository.full_name;
    const prNumber = payload.pull_request.number;
    const files = await this.getChangedFiles(repo, prNumber);

    for (const file of files) {
      const code = await this.getFileContent(repo, file.filename);
      const reviewComments = await this.openAIService.reviewCode(code);

      if (reviewComments) {
        await this.commentOnPR(repo, prNumber, file.filename, reviewComments);
      }
    }
  }

  private async getChangedFiles(repo: string, prNumber: number) {
    const url = `https://api.github.com/repos/${repo}/pulls/${prNumber}/files`;
    const response = await axios.get(url, { headers: this.getAuthHeaders() });
    return response.data;
  }

  private async getFileContent(repo: string, filename: string) {
    const url = `https://api.github.com/repos/${repo}/contents/${filename}`;
    const response = await axios.get(url, { headers: this.getAuthHeaders() });
    return Buffer.from(response.data.content, 'base64').toString('utf-8');
  }

  private async commentOnPR(repo: string, prNumber: number, filename: string, comment: string) {
    const url = `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`;
    await axios.post(url, { body: `Code Review for \`${filename}\`:\n${comment}` }, { headers: this.getAuthHeaders() });
  }

  private getAuthHeaders() {
    return { Authorization: `token ${this.githubToken}`, Accept: 'application/vnd.github.v3+json' };
  }
}
