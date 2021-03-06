import { CircularProgress } from '@material-ui/core';
import MaterialTable, { Column, MTableBodyRow } from 'material-table';
import React, { useEffect, useState, useCallback } from 'react';
import backendClient from '../clients/BackendHttpClient';
import ArrowBackButton from '../components/ArrowBackButton';
import { PracticeList } from '../domain/PracticeList';


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
        columns: [],
        data: [],
    });

    const updatePracticeListAndTableData = useCallback((practiceList: PracticeList) => {
        console.log("Rerendering practice list");

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

        let data: Row[] = mapPracticeList(practiceList);
        let columns: Column<Row>[] = [
            { 
                title: 'id', 
                type: 'numeric', 
                editable: 'never', 
                field: 'id'
            },
            { title: practiceList ? `${practiceList.source}` : '', field: 'source' },
            { title: practiceList ? `${practiceList.target}` : '', field: 'target' }
        ];

        setState({
            columns: columns,
            data: data
        });

        setPracticeList(practiceList);
    }, []);

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        backendClient.fetchPracticeList(props.practiceListId)
            .then(practiceList => updatePracticeListAndTableData(practiceList));
    }, [props.practiceListId, updatePracticeListAndTableData]); 



    const addRowToPracticeList = (newData: Row): Promise<PracticeList> => {
        if (practiceList) {
            return backendClient.addTranslationtoPracticeList(props.practiceListId, newData.source, newData.target);
        } else {
            return Promise.reject("Practice list does not exist");
        }
    };

    const updateRowInPracticeList = (newData: Row, oldData: Row | undefined): Promise<PracticeList> => {

        let promise: Promise<PracticeList>;
        if (practiceList) {
            if (oldData) {
                promise = backendClient.editPracticeList(props.practiceListId, oldData.id, newData.source, newData.target);
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
            promise = backendClient.deleteFromPracticeList(props.practiceListId, oldData.id);
        } else {
            promise = Promise.reject("Practice list does not exist");            
        }

        return promise;
    };

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
                components={{
                    Row: props => <MTableBodyRow {...props} ></MTableBodyRow>
                }}
                actions={[
                    {
                        icon: () => <ArrowBackButton goTo="/lists/"/>,
                        tooltip: 'Back',
                        isFreeAction: true,
                        onClick: () => {}
                    },                    
                    {
                        icon: 'refresh',
                        tooltip: 'Refresh Data',
                        isFreeAction: true,
                        onClick: () => backendClient.fetchPracticeList(props.practiceListId)
                            .then(practiceList => updatePracticeListAndTableData(practiceList)),
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