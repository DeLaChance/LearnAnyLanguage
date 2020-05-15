import { MigrationInterface, QueryRunner } from "typeorm";
import { Language } from "../../domain/Language";

export class AddLanguagesMigration1583510854834 implements MigrationInterface {
    
    async up(queryRunner: QueryRunner): Promise<any> {
        return queryRunner.manager.createQueryBuilder()
            .insert()
            .into(Language)
            .values([
                { 
                    iso2Code: "NL", 
                    name: "Dutch", 
                    wikipediaDescriptionLink: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Dutch language", 
                    learnMoreWikipediaLink: "https://en.wikipedia.org/wiki/Dutch_language" 
                },
                { 
                    iso2Code: "ID", 
                    name: "Bahasa Indonesia",
                    wikipediaDescriptionLink: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Indonesian language", 
                    learnMoreWikipediaLink: "https://en.wikipedia.org/wiki/Indonesian_language"                     
                },
                { 
                    iso2Code: "ZH", 
                    name: "Mandarin Chinese",
                    wikipediaDescriptionLink: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Chinese language", 
                    learnMoreWikipediaLink: "https://en.wikipedia.org/wiki/Chinese_language"                      
                },
                { 
                    iso2Code: "ES", 
                    name: "Spanish",
                    wikipediaDescriptionLink: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Spanish language", 
                    learnMoreWikipediaLink: "https://en.wikipedia.org/wiki/Spanish_language"                      
                },
                { 
                    iso2Code: "EN", 
                    name: "English",
                    wikipediaDescriptionLink: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=English language", 
                    learnMoreWikipediaLink: "https://en.wikipedia.org/wiki/English_language"                     
                },
                { 
                    iso2Code: "HI", 
                    name: "Hindi",
                    wikipediaDescriptionLink: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Hindi", 
                    learnMoreWikipediaLink: "https://en.wikipedia.org/wiki/Hindi_language"                      
                },
                { 
                    iso2Code: "AR", 
                    name: "Arabic",
                    wikipediaDescriptionLink: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Arabic", 
                    learnMoreWikipediaLink: "https://en.wikipedia.org/wiki/Arabic_language"                      
                },
                { 
                    iso2Code: "FR", 
                    name: "French",
                    wikipediaDescriptionLink: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=French language", 
                    learnMoreWikipediaLink: "https://en.wikipedia.org/wiki/French_language"                      
                },
                { 
                    iso2Code: "DE", 
                    name: "German",
                    wikipediaDescriptionLink: "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=German language", 
                    learnMoreWikipediaLink: "https://en.wikipedia.org/wiki/German_language"                      
                },
            ])
            .execute();            
    }

    async down(queryRunner: QueryRunner): Promise<any> { 
        
    }

    
}