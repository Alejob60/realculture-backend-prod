import { InfluencerEntity } from './influencer.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    influencer: InfluencerEntity;
}
