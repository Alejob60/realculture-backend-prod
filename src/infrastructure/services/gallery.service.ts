import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { GeneratedImageEntity } from '../../domain/entities/generated-image.entity';
import { GeneratedVideoEntity } from '../../domain/entities/generated-video.entity';
import { GeneratedAudioEntity } from '../../domain/entities/generated-audio.entity';
import { GeneratedMusicEntity } from '../../domain/entities/generated-music.entity';
import { AzureBlobService } from '../services/azure-blob.services';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(GeneratedImageEntity)
    private readonly imageRepo: Repository<GeneratedImageEntity>,

    @InjectRepository(GeneratedVideoEntity)
    private readonly videoRepo: Repository<GeneratedVideoEntity>,

    @InjectRepository(GeneratedAudioEntity)
    private readonly audioRepo: Repository<GeneratedAudioEntity>,

    @InjectRepository(GeneratedMusicEntity)
    private readonly musicRepo: Repository<GeneratedMusicEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    private readonly azureBlobService: AzureBlobService,
  ) {}

  async getUserGallery(userId: string) {
    const user = await this.userRepo.findOne({ where: { userId } });
    if (!user) throw new Error('Usuario no encontrado');

    const now = new Date();

    const [images, videos, audios, music] = await Promise.all([
      this.imageRepo.find({ where: { user, expiresAt: MoreThan(now) }, order: { createdAt: 'DESC' } }),
      this.videoRepo.find({ where: { user, expiresAt: MoreThan(now) }, order: { createdAt: 'DESC' } }),
      this.audioRepo.find({ where: { user, expiresAt: MoreThan(now) }, order: { createdAt: 'DESC' } }),
      this.musicRepo.find({ where: { user, expiresAt: MoreThan(now) }, order: { createdAt: 'DESC' } }),
    ]);

    const signedImages = await Promise.all(images.map(async (item) => ({
      id: item.id,
      prompt: item.prompt,
      createdAt: item.createdAt,
      expiresAt: item.expiresAt,
      url: await this.azureBlobService.getSignedUrl({
        filename: item.filename,
        container: 'images',
        expiresInSeconds: 24 * 60 * 60,
      }),
    })));

    const signedVideos = await Promise.all(videos.map(async (item) => ({
      id: item.id,
      prompt: item.prompt,
      createdAt: item.createdAt,
      expiresAt: item.expiresAt,
      url: await this.azureBlobService.getSignedUrl({
        filename: item.filename,
        container: 'videos',
        expiresInSeconds: 24 * 60 * 60,
      }),
    })));

    const signedAudios = await Promise.all(audios.map(async (item) => ({
      id: item.id,
      script: item.script,
      createdAt: item.createdAt,
      expiresAt: item.expiresAt,
      url: await this.azureBlobService.getSignedUrl({
        filename: item.filename,
        container: 'audios',
        expiresInSeconds: 24 * 60 * 60,
      }),
    })));

    const signedMusic = await Promise.all(music.map(async (item) => ({
      id: item.id,
      prompt: item.prompt,
      createdAt: item.createdAt,
      expiresAt: item.expiresAt,
      url: await this.azureBlobService.getSignedUrl({
        filename: item.filename,
        container: 'music',
        expiresInSeconds: 24 * 60 * 60,
      }),
    })));

    return {
      images: signedImages,
      videos: signedVideos,
      audios: signedAudios,
      music: signedMusic,
    };
  }
}
