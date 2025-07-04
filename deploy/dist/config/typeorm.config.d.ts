import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
export declare const typeOrmConfigAsync: {
    imports: (typeof ConfigModule)[];
    inject: (typeof ConfigService)[];
    useFactory: (config: ConfigService) => Promise<TypeOrmModuleOptions>;
};
