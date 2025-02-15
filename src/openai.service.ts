import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class OpenAIService {
  private readonly openAIUrl = process.env.AZURE_OPENAI_URL;
  private readonly apiKey = process.env.AZURE_OPENAI_API_KEY;
  private readonly deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT;

  async reviewCode(code: string): Promise<string> {
    const prompt = `Analyze the following TypeScript/NestJS code for best practices, security vulnerabilities, and performance optimizations. Provide a detailed review:\n\n${code}`;

    const response = await axios.post(
      `${this.openAIUrl}/openai/deployments/${this.deploymentName}/chat/completions?api-version=2023-05-15`,
      {
        messages: [{ role: 'system', content: 'You are a senior NestJS code reviewer.' }, { role: 'user', content: prompt }],
        max_tokens: 500,
      },
      { headers: { 'Content-Type': 'application/json', 'api-key': this.apiKey } }
    );

    return response.data.choices[0].message.content;
  }
}
