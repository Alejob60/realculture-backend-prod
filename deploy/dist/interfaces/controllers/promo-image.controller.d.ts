import { MediaBridgeService } from '../../infrastructure/services/media-bridge.service';
import { Request } from 'express';
import { UserService } from '../../infrastructure/services/user.service';
export declare class PromoImageController {
    private readonly mediaBridge;
    private readonly userService;
    constructor(mediaBridge: MediaBridgeService, userService: UserService);
    generatePromoImage(body: any, req: Request): Promise<any>;
}
