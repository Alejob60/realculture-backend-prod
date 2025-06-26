import { DataSource } from 'typeorm';
export declare class HealthController {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    checkDatabase(): Promise<{
        status: string;
        error?: undefined;
    } | {
        status: string;
        error: any;
    }>;
}
