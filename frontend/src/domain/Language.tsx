export class Language {
 
    iso2Code: string; 
    name: string;
    description: string[];    
    wikipediaDescriptionLink: string;
    learnMoreWikipediaLink: string;
    imageUrl: string;

    constructor(iso2Code: string, name: string, wikipediaDescriptionLink: string, learnMoreWikipediaLink: string) {
        this.iso2Code = iso2Code;
        this.name = name;
        this.wikipediaDescriptionLink = wikipediaDescriptionLink;
        this.learnMoreWikipediaLink = learnMoreWikipediaLink;
        
        this.imageUrl = this.generateImageUrl();
        this.description = [];
    }

    private generateImageUrl(): string {
        let imageUrl: string = `/images/languages/${this.iso2Code}.png`;
        return imageUrl;
    }

    static from(json: any): Language {
        return new Language(json.iso2Code, json.name, json.wikipediaDescriptionLink, json.learnMoreWikipediaLink);
    }    
}