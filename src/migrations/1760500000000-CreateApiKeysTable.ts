import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateApiKeysTable1760500000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "api_keys",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "uuid",
                    },
                    {
                        name: "key",
                        type: "varchar",
                        isUnique: true,
                    },
                    {
                        name: "userId",
                        type: "uuid",
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "expiresAt",
                        type: "timestamp",
                        isNullable: true,
                    },
                    {
                        name: "revoked",
                        type: "boolean",
                        default: false,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "api_keys",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["user_id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("api_keys");
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("userId") !== -1,
        );
        await queryRunner.dropForeignKey("api_keys", foreignKey);
        await queryRunner.dropTable("api_keys");
    }
}