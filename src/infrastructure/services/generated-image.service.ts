import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { GeneratedImageEntity } from '../../domain/entities/generated-image.entity';
import { UserEntity } from '../../domain/entities/user.entity';
import { AzureBlobService } from '../services/azure-blob.services';

@Injectable()
export class GeneratedImageService {
  constructor(
    @InjectRepository(GeneratedImageEntity)
    private readonly repo: Repository<GeneratedImageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly azureBlobService: AzureBlobService,
  ) {}

  /**
   * Guarda la imagen generada en la base de datos con su URL de Blob y la fecha de expiración
   */
  async saveImage(
    userId: string,
    prompt: string,
    imageUrl: string,
    filename: string,
    plan: string,
  ) {
    const user = await this.userRepo.findOne({ where: { userId } });
    if (!user) throw new Error('Usuario no encontrado');

    const expiresAt = new Date();
    if (plan === 'FREE') {
      expiresAt.setHours(expiresAt.getHours() + 24);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 30);
    }

    const image = this.repo.create({
      user,
      prompt,
      imageUrl,
      filename,
      createdAt: new Date(),
      expiresAt,
    });

    await this.repo.save(image);
    return {
      success: true,
      message: '✅ Imagen guardada en la galería',
      expiresAt,
    };
  }

  /**
   * Recupera las imágenes activas con SAS URL según el plan
   */
  async getImagesByUserId(userId: string) {
    const user = await this.userRepo.findOne({ where: { userId } });
    if (!user) throw new Error('Usuario no encontrado');

    const now = new Date();
    const plan = user.role?.toUpperCase?.() || 'FREE';

    const images = await this.repo.find({
      where: {
        user,
        expiresAt: MoreThan(now),
      },
      order: { createdAt: 'DESC' },
    });

    const result = await Promise.all(
      images.map(async (img) => {
        const expiresInSeconds = plan === 'FREE'
          ? 24 * 60 * 60       // 24h
          : 30 * 24 * 60 * 60;  // 30 días

        const signedUrl = await this.azureBlobService.getSignedUrl({
          filename: img.filename,
          container: 'images',
          expiresInSeconds,
        });

        return {
          id: img.id,
          prompt: img.prompt,
          createdAt: img.createdAt,
          expiresAt: img.expiresAt,
          url: signedUrl,
        };
      }),
    );

    return result;
  }

  /**
   * Elimina imágenes expiradas del contenedor y la base de datos
   */
  async deleteExpiredImages() {
    const now = new Date();
    const expiredImages = await this.repo.find({
      where: { expiresAt: LessThan(now) },
    });

    for (const image of expiredImages) {
      try {
        await this.azureBlobService.deleteBlob(image.filename);
      } catch (err) {
        // log sin detener el borrado en BD
      }
    }

    if (expiredImages.length > 0) {
      await this.repo.remove(expiredImages);
    }
  }
}
