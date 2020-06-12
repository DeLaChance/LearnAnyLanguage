import { PracticeList } from "../domain/PracticeList";
import config from "../config/config.json";
import { Language } from "../domain/Language";
import { PracticeRunConfiguration } from "../domain/PracticeRunConfiguration";
import { PracticeRun } from "../domain/PracticeRun";
import { TranslationAttempt } from "../domain/TranslationAttempt";

class BackendHttpClient {

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

    fetchPracticeLists(): Promise<PracticeList[]> {
        const requestOptions = {
            method: 'GET'
        };

        let url: string = `${config.backendBaseUrl}lists/`;
        return this.makeHttpRequest(url, requestOptions)
            .then(responseJson => responseJson.map((practiceListJson: any) => PracticeList.from(practiceListJson)));
    }

    fetchPracticeList(practiceListId: string): Promise<PracticeList> {
        const requestOptions = {
            method: 'GET'
        };

        let url: string = `${config.backendBaseUrl}lists/${practiceListId}`;
        return this.makePracticeListHttpRequest(url, requestOptions);
    };

    createNewList(name: string, sourceLanguage: Language, targetLanguage: Language): Promise<PracticeList> {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                sourceLanguage: sourceLanguage.iso2Code, 
                targetLanguage: targetLanguage.iso2Code,
                name: name
            })
        };

        let url: string = `${config.backendBaseUrl}lists/create`;        
        return this.makePracticeListHttpRequest(url, requestOptions);
    }

    uploadPracticeList(file: File): Promise<void> {
        const request: XMLHttpRequest = new XMLHttpRequest();

        const formData: FormData = new FormData();
        formData.append("file", file, file.name);

        let url: string = `${config.backendBaseUrl}lists/importFile`;
        request.open("POST", url);

        console.log(`Uploading file ${file.name} to url ${url}`);
        request.send(formData);

        return Promise.resolve();
    }

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
    
    startPracticeRun(practiceListId: string, configuration: PracticeRunConfiguration): Promise<PracticeRun> {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },            
            body: JSON.stringify(configuration)
        };
        
        let url: string = `${config.backendBaseUrl}lists/${practiceListId}/start`;
        return this.makePracticeRunHttpRequest(url, requestOptions)
            .then((responseJson) => {
                let practiceRun: PracticeRun = PracticeRun.from(responseJson);
                return Promise.resolve(practiceRun);
            }); 
    }

    fetchPracticeRuns(): Promise<PracticeRun[]> {

        const requestOptions = {
            method: 'GET'
        }
        let url: string = `${config.backendBaseUrl}runs/`;
        return this.makeHttpRequest(url, requestOptions)
            .then(responseJson => PracticeRun.fromMany(responseJson));
    }

    fetchPracticeRun(runId: string) {
        const requestOptions = {
            method: 'GET'
        }
        let url: string = `${config.backendBaseUrl}runs/${runId}`;
        return this.makeHttpRequest(url, requestOptions)
            .then(responseJson => PracticeRun.from(responseJson));
    }

    giveAnswer(answer: string, runId: string): Promise<TranslationAttempt | null> {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },       
            body: JSON.stringify({
                "answer": answer
            })
        };

        let url: string = `${config.backendBaseUrl}runs/${runId}/giveAnswer`;
        return this.makeHttpRequest(url, requestOptions)
            .then(responseJson => TranslationAttempt.from(responseJson));
    }

    pauseRun(runId: string) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        };

        let url: string = `${config.backendBaseUrl}runs/${runId}/pause`;
        return this.makeHttpRequest(url, requestOptions)
            .then(responseJson => TranslationAttempt.from(responseJson));
    }

    abortRun(runId: string) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        };

        let url: string = `${config.backendBaseUrl}runs/${runId}/abort`;
        return this.makeHttpRequest(url, requestOptions)
            .then(responseJson => TranslationAttempt.from(responseJson));
    }

    restart(runId: string) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        };

        let url: string = `${config.backendBaseUrl}runs/${runId}/restart`;
        return this.makeHttpRequest(url, requestOptions)
            .then(responseJson => TranslationAttempt.from(responseJson));
    }

    makePracticeRunHttpRequest(url: string, requestOptions: any): Promise<PracticeRun> {
        return this.makeHttpRequest(url, requestOptions)
            .then((responseJson) => {
                let practiceRun: PracticeRun = PracticeRun.from(responseJson);                        
                return Promise.resolve(practiceRun);
            });
    }

    makeHttpRequest(url: string, requestOptions: any): Promise<any> {
        console.log(`Making HTTP ${requestOptions.method} request to url ${url}`);
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

let backendClient: BackendHttpClient = new BackendHttpClient();
export default backendClient;