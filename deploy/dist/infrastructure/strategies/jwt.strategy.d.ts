import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: {
        sub: string;
        email: string;
        name: string;
        role: string;
    }): Promise<{
        userId: string;
        email: string;
        name: string;
        role: string;
    }>;
}
export {};
