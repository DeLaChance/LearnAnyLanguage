export class Language {

    iso2Code: string; 
    name: string;
    description: string;    
    wikipediaLink: string;
    imageUrl: string;

    constructor(iso2Code: string, description: string) {
        this.iso2Code = iso2Code;
        this.description = description;

        this.name = this.mapToLongName();
        this.wikipediaLink = this.generateWikipediaLink();
        this.imageUrl = this.generateImageUrl();
    }

    private mapToLongName(): string {
        if (this.iso2Code == "en") {
            return "English";
        } else if (this.iso2Code == "zh") {
            return "Chinese";
        } else if (this.iso2Code == "ar") {
            return "Arabic";
        } else if (this.iso2Code == "de") {
            return "German";
        } else if (this.iso2Code == "es") {
            return "Spanish";
        } else if (this.iso2Code == "fr") {
            return "French";
        } else if (this.iso2Code == "hi") {
            return "Hindi";
        } else if (this.iso2Code == "nl") {
            return "Dutch";                        
        } else {
            return "Unknown";
        }
    }

    private generateWikipediaLink() {
        let wikipediaLink: string = `https://en.wikipedia.org/wiki/${this.name}_language`;        
        return wikipediaLink;
    }

    private generateImageUrl(): string {
        let imageUrl: string = `/images/languages/${this.iso2Code}.png`;
        return imageUrl;
    }
}