export class Language {
 
    iso2Code: string; 
    name: string;
    description: string[];    
    wikipediaDescriptionLink: string;
    learnMoreWikipediaLink: string;
    imageUrl: string;

    constructor(iso2Code: string, description: string[]) {
        this.iso2Code = iso2Code;
        this.description = description;

        this.name = this.mapToLongName();
        this.wikipediaDescriptionLink = this.generateWikipediaDescriptionLink();
        this.learnMoreWikipediaLink = this.generateLearnMoreWikipediaLink();
        this.imageUrl = this.generateImageUrl();
    }

    private mapToLongName(): string {
        if (this.iso2Code === "en") {
            return "English";
        } else if (this.iso2Code === "zh") {
            return "Chinese";
        } else if (this.iso2Code === "ar") {
            return "Arabic";
        } else if (this.iso2Code === "de") {
            return "German";
        } else if (this.iso2Code === "es") {
            return "Spanish";
        } else if (this.iso2Code === "fr") {
            return "French";
        } else if (this.iso2Code === "hi") {
            return "Hindi";
        } else if (this.iso2Code === "nl") {
            return "Dutch";                        
        } else {
            return "Unknown";
        }
    }

    private generateWikipediaDescriptionLink() {
        let wikipediaLink: string;
        if (this.iso2Code === "hi") {
            wikipediaLink = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Hindi`;        
        } else if (this.iso2Code === "ar") {
            wikipediaLink = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=Arabic`;        
        } else {
            wikipediaLink = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&titles=${this.name} language`;        
        }        
        return wikipediaLink;
    }

    generateLearnMoreWikipediaLink(): string {
        return `https://en.wikipedia.org/wiki/${this.name}_language`;
    }

    private generateImageUrl(): string {
        let imageUrl: string = `/images/languages/${this.iso2Code}.png`;
        return imageUrl;
    }
}