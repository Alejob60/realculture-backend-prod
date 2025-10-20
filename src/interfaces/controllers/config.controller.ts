import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../guards/api-key.guard';

@Controller('config')
@UseGuards(ApiKeyGuard)
export class ConfigController {
  @Get()
  async getConfig() {
    return {
      aiServiceUrl: 'https://ai.misy.ai',
      apiEndpoint: 'https://api.misy.ai/v1',
      dbUrl: 'mongodb://internal.misy.ai:27017/context',
      telemetry: 'https://telemetry.misy.ai/v1'
    };
  }
}