import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApiKeyEntity } from '../../domain/entities/api-key.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
  ) {}

  async generateForUser(userId: string): Promise<string> {
    const key = crypto.randomBytes(32).toString('hex');
    const apiKey = this.apiKeyRepository.create({
      user: { userId } as UserEntity,
      key,
    });
    await this.apiKeyRepository.save(apiKey);
    return key;
  }

  async validate(key: string): Promise<UserEntity> {
    const record = await this.apiKeyRepository.findOne({
      where: { key, revoked: false },
      relations: ['user'],
    });
    if (!record) throw new UnauthorizedException('Invalid or revoked API key');
    return record.user;
  }

  async revokeApiKey(key: string): Promise<void> {
    await this.apiKeyRepository.update({ key }, { revoked: true });
  }

  async listApiKeysForUser(userId: string): Promise<ApiKeyEntity[]> {
    return await this.apiKeyRepository.find({
      where: { user: { userId } as UserEntity, revoked: false },
      order: { createdAt: 'DESC' },
    });
  }
}