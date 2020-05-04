import React, { useState, useEffect } from 'react';
import MaterialTable, { Column, QueryResult } from 'material-table';
import { PracticeList } from '../domain/PracticeList';
import config from '../config/config.json';
import { CircularProgress } from '@material-ui/core';

interface Row {
    id: number;
    source: string;
    target: string;    
}

interface TableState {
    columns: Array<Column<Row>>;
    data: Row[];
}

export type Props = {
    practiceListId: string;
};

export default function PracticeListTable(props: Props) {

    // Hooks
    const [practiceList, setPracticeList] = useState<PracticeList>();

    const [state, setState] = React.useState<TableState>({
        columns: [
            { title: 'id', type: 'numeric', editable: 'never', field: 'id' },
            { title: practiceList ? `${practiceList.source}` : '', field: 'source' },
            { title: practiceList ? `${practiceList.target}` : '', field: 'target' }
        ],
        data: [],
    });

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        fetchPracticeList().then(practiceList => updatePracticeListAndTableData(practiceList));
    }, []); 

    const fetchPracticeList = async function(): Promise<PracticeList> {
        const requestOptions = {
            method: 'GET'
        };
        let url: string = `${config.backendBaseUrl}lists/${props.practiceListId}`;
        return makeHttpRequest(url, requestOptions);
    };

    const updatePracticeListAndTableData = (practiceList: PracticeList) => {
        console.log("Rerendering practice list");
        let data: Row[] = mapPracticeList(practiceList);
            setState({
                columns: state.columns,
                data: data
            });

        setPracticeList(practiceList);
    };

    const addRowToPracticeList = (newData: Row): Promise<PracticeList> => {
        if (practiceList) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    source: newData.source, 
                    target: newData.target 
                })
            };
            let url: string = `${config.backendBaseUrl}lists/${practiceList.id}/add`;
    
            return makeHttpRequest(url, requestOptions);
        } else {
            return Promise.reject("Practice list does not exist");
        }
    };

    const updateRowInPracticeList = (newData: Row, oldData: Row | undefined): Promise<PracticeList> => {

        let promise: Promise<PracticeList>;
        if (practiceList) {
            if (oldData) {
                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        source: newData.source, 
                        target: newData.target 
                    })
                };
                let url: string = `${config.backendBaseUrl}lists/${practiceList.id}/${oldData.id}/edit`;
                promise = makeHttpRequest(url, requestOptions);
            } else {
                promise = Promise.reject("Practice list does not exist");
            }
        } else {
            promise = Promise.reject("Practice list does not exist");
        }

        return promise;
    };

    const deleteRowInPracticeList = (oldData: Row): Promise<PracticeList> => {
        
        let promise: Promise<PracticeList>;
        if (practiceList) {
            const requestOptions = {
                method: 'DELETE',
            };
            
            let url: string = `${config.backendBaseUrl}lists/${practiceList.id}/${oldData.id}/delete`;
            promise = makeHttpRequest(url, requestOptions);        
        } else {
            promise = Promise.reject("Practice list does not exist");            
        }

        return promise;
    };

    const makeHttpRequest = (url: string, requestOptions: any): Promise<PracticeList> => {
        return fetch(url, requestOptions)
            .then(async httpReponse => {
                if (httpReponse.status === 201 || httpReponse.status === 200 
                    || httpReponse.status === 204) {
                    let responseJson = await httpReponse.json();
                    let practiceList: PracticeList = PracticeList.from(responseJson);                        
                    return Promise.resolve(practiceList);
                } else {
                    return Promise.reject("Backend is down.");
                }   
            });        
    };

    const mapPracticeList = (practiceList: PracticeList): Row[] => {
        let data: Row[] = practiceList.translations.map(translation => {
            return {
                id: translation.id,
                source: translation.source,
                target: translation.target
            }
        });

        return data;       
    }

    const renderTable = (practiceList: PracticeList) => {
        return (
            <MaterialTable
                title={`${practiceList.name}`}
                columns={state.columns}
                data={state.data}
                editable={{
                    // TODO: could be done more efficient then rerendering whole list
                    onRowAdd: (newData) => addRowToPracticeList(newData)
                        .then(practiceList => updatePracticeListAndTableData(practiceList)),
                    onRowUpdate: (newData, oldData) => updateRowInPracticeList(newData, oldData)
                        .then(practiceList => updatePracticeListAndTableData(practiceList)),
                    onRowDelete: (oldData) => deleteRowInPracticeList(oldData)
                        .then(practiceList => updatePracticeListAndTableData(practiceList))
                }}
                options={{
                    pageSize: 20,
                    pageSizeOptions: [20,50,100],
                }}
                actions={[
                    {
                        icon: 'refresh',
                        tooltip: 'Refresh Data',
                        isFreeAction: true,
                        onClick: () => 
                            fetchPracticeList().then(practiceList => updatePracticeListAndTableData(practiceList)),
                    }
                ]}                
            />
        );                    
    };
     
    const renderLoadingComponent = () => {
        return (
            <CircularProgress />
        );
    };

    if (practiceList) {
        return renderTable(practiceList);
    } else {
        return renderLoadingComponent();
    }
}