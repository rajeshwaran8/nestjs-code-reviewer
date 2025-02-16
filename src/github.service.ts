import { Injectable } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import axios from 'axios';

@Injectable()
export class GithubService {
  private readonly githubToken = process.env.GITHUB_TOKEN;

  constructor(private readonly openAIService: OpenAIService) {}

  async processPullRequest(payload: any) {
    console.log("Processing pull request");
    const repo = payload.repository.full_name;
    const prNumber = payload.pull_request.number;
    const files = await this.getChangedFiles(repo, prNumber);
    console.log("Files: ", files);
    for (const file of files) {
      const code = await this.getFileContent(repo, file.filename);
      console.log("Code: ", code);
      const reviewComments = await this.openAIService.reviewCode(code);
      console.log("Review Comments: ", reviewComments);
      if (reviewComments) {
        await this.commentOnPR(repo, prNumber, file.filename, reviewComments);
        console.log("Commented on PR");
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
    console.log("Commenting on PR");
    const url = `https://api.github.com/repos/${repo}/issues/${prNumber}/comments`;
    await axios.post(url, { body: `Code Review for \`${filename}\`:\n${comment}` }, { headers: this.getAuthHeaders() });
  }

  private getAuthHeaders() {
    return { Authorization: `token ${this.githubToken}`, Accept: 'application/vnd.github.v3+json' };
  }
}
