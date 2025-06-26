import { Product } from './product.entity';
export declare class InfluencerEntity {
    id: string;
    name: string;
    personality: string;
    style: string;
    avatarUrl: string;
    products: Product[];
    type: 'OFFICIAL' | 'USER';
    demoVideoUrl: string;
    stats: {
        engagement: number;
    };
}
