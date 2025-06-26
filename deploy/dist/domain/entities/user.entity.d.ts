import { Content } from './content.entity';
import { GeneratedImageEntity } from './generated-image.entity';
import { UserRole } from '../enums/user-role.enum';
import { GeneratedVideoEntity } from './generated-video.entity';
import { GeneratedAudioEntity } from './generated-audio.entity';
import { GeneratedMusicEntity } from './generated-music.entity';
export declare class UserEntity {
    userId: string;
    email: string;
    name?: string;
    password?: string;
    googleId?: string;
    role: UserRole;
    plan: string;
    picture?: string;
    credits: number;
    createdAt: Date;
    contents: Content[];
    generatedImages: GeneratedImageEntity[];
    generatedVideos: GeneratedVideoEntity[];
    generatedAudios: GeneratedAudioEntity[];
    generatedMusic: GeneratedMusicEntity[];
}
