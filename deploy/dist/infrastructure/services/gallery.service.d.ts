import { Repository } from 'typeorm';
import { GeneratedImageEntity } from '../../domain/entities/generated-image.entity';
import { GeneratedVideoEntity } from '../../domain/entities/generated-video.entity';
import { GeneratedAudioEntity } from '../../domain/entities/generated-audio.entity';
import { GeneratedMusicEntity } from '../../domain/entities/generated-music.entity';
export declare class GalleryService {
    private readonly imageRepo;
    private readonly videoRepo;
    private readonly audioRepo;
    private readonly musicRepo;
    constructor(imageRepo: Repository<GeneratedImageEntity>, videoRepo: Repository<GeneratedVideoEntity>, audioRepo: Repository<GeneratedAudioEntity>, musicRepo: Repository<GeneratedMusicEntity>);
    getUserGallery(userId: string): Promise<{
        images: GeneratedImageEntity[];
        videos: GeneratedVideoEntity[];
        audios: GeneratedAudioEntity[];
        music: GeneratedMusicEntity[];
    }>;
}
