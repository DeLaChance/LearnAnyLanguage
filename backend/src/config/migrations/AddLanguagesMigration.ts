import { MigrationInterface, QueryRunner } from "typeorm";
import { Language } from "../../domain/Language";

export class AddLanguagesMigration1583510854834 implements MigrationInterface {
    
    async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.manager.createQueryBuilder()
            .insert()
            .into(Language)
            .values([
                { iso2Code: "NL", name: "Dutch" },
                { iso2Code: "ID", name: "Bahasa Indonesia" },
                { iso2Code: "ZH", name: "Mandarin Chinese" },
                { iso2Code: "ES", name: "Spanish" },
                { iso2Code: "EN", name: "English" },
                { iso2Code: "HI", name: "Hindi" },
                { iso2Code: "AR", name: "Arabic" },
                { iso2Code: "FR", name: "French" },
                { iso2Code: "DE", name: "German" },
            ])
            .execute();            
    }

    async down(queryRunner: QueryRunner): Promise<any> { 
        
    }

    
}