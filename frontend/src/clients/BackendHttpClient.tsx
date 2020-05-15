import { PracticeList } from "../domain/PracticeList";
import config from "../config/config.json";
import { Language } from "../domain/Language";

export default class BackendHttpClient {

    fetchLanguages(): Promise<Language[]> {
        const requestOptions = {
            method: 'GET'
        };

        let url: string = `${config.backendBaseUrl}languages/`;
        return this.makeHttpRequest(url, requestOptions)
            .then(requestJson => requestJson.map((json: any) => Language.from(json)));
    };

    fetchLanguageByIso2Code(iso2Code: string): Promise<Language> {
        const requestOptions = {
            method: 'GET'
        };

        let url: string = `${config.backendBaseUrl}languages/${iso2Code}`;
        return this.makeHttpRequest(url, requestOptions)
            .then(requestJson => Language.from(requestJson));
    }

    fetchPracticeList(practiceListId: string): Promise<PracticeList> {
        const requestOptions = {
            method: 'GET'
        };

        let url: string = `${config.backendBaseUrl}lists/${practiceListId}`;
        return this.makePracticeListHttpRequest(url, requestOptions);
    };

    addTranslationtoPracticeList(practiceListId: string, newSource: string, newTarget: string): Promise<PracticeList> {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                source: newSource, 
                target: newTarget 
            })
        };

        let url: string = `${config.backendBaseUrl}lists/${practiceListId}/add`;
        return this.makePracticeListHttpRequest(url, requestOptions);
    }

    editPracticeList(practiceListId: string, translationId: number, newSource: string, newTarget: string) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                source: newSource, 
                target: newTarget 
            })
        };

        let url: string = `${config.backendBaseUrl}lists/${practiceListId}/${translationId}/edit`;
        return this.makePracticeListHttpRequest(url, requestOptions);
    }

    deleteFromPracticeList(practiceListId: string, translationId: number): Promise<PracticeList> {
        const requestOptions = {
            method: 'DELETE',
        };
        
        let url: string = `${config.backendBaseUrl}lists/${practiceListId}/${translationId}/delete`;
        return this.makePracticeListHttpRequest(url, requestOptions); 
    }    

    makePracticeListHttpRequest(url: string, requestOptions: any): Promise<PracticeList> {
        return this.makeHttpRequest(url, requestOptions)
            .then((responseJson) => {
                let practiceList: PracticeList = PracticeList.from(responseJson);                        
                return Promise.resolve(practiceList);
            });
    }

    makeHttpRequest(url: string, requestOptions: any): Promise<any> {
        console.log(`Making HTTP request to url ${url}`);
        return fetch(url, requestOptions)
            .then(async httpReponse => {
                if (httpReponse.status === 201 || httpReponse.status === 200 
                    || httpReponse.status === 204) {
                    let responseJson = await httpReponse.json();
                    return Promise.resolve(responseJson);
                } else {
                    return Promise.reject("Backend is down.");
                }   
            });       
    }
}