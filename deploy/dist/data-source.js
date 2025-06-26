"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const user_entity_1 = require("./domain/entities/user.entity");
const content_entity_1 = require("./domain/entities/content.entity");
(0, dotenv_1.config)();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    ssl: process.env.SSL === 'true' ? { rejectUnauthorized: false } : false,
    entities: [user_entity_1.UserEntity, content_entity_1.Content],
    migrations: ['src/migrations/*.ts'],
});
//# sourceMappingURL=data-source.js.map