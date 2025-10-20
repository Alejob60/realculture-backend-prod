import { Controller, Post, UseGuards, Req, Get, Delete, Param, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiKeyService } from '../../infrastructure/services/api-key.service';

@Controller('auth/api-key')
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('generate')
  async generate(@Req() req: Request) {
    const key = await this.apiKeyService.generateForUser((req.user as any).userId);
    return { apiKey: key };
  }

  @UseGuards(JwtAuthGuard)
  @Get('list')
  async list(@Req() req: Request) {
    const apiKeys = await this.apiKeyService.listApiKeysForUser((req.user as any).userId);
    return { apiKeys };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('revoke/:key')
  async revoke(@Param('key') key: string) {
    await this.apiKeyService.revokeApiKey(key);
    return { message: 'API key revoked successfully' };
  }
}