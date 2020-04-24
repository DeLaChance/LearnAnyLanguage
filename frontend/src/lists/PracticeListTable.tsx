import React from 'react';
import MaterialTable, { Column } from 'material-table';
import { PracticeList } from '../domain/PracticeList';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    practiceList: PracticeList;
};

export default function PracticeListTable(props: Props) {

    let practiceList: PracticeList = props.practiceList;

    // React Hooks
    const [state, setState] = React.useState<TableState>({
        columns: [
            { title: 'Id', field: 'id', editable: 'never', type: 'numeric' },
            { title: `${practiceList.source}`, field: 'source' },
            { title: `${practiceList.target}`, field: 'target' }
        ],
        data: practiceList.translations.map(translation => {
                return {
                    id: translation.id, 
                    source: translation.source,
                    target: translation.target
                }
        }),
    });

    const renderTable = (practiceList: PracticeList) => {
        return (
            <MaterialTable
                title={`${practiceList.name}`}
                columns={state.columns}
                components={{                    
                }}
                data={state.data}
                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                setState((prevState) => {
                                    const data = [...prevState.data];
                                    data.push(newData);
                                    return { ...prevState, data };
                                });
                            }, 600);
                    }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                if (oldData) {
                                    setState((prevState) => {
                                        const data = [...prevState.data];
                                        data[data.indexOf(oldData)] = newData;
                                        return { ...prevState, data };
                                    });
                                }
                            }, 600);
                    }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve) => {
                            setTimeout(() => {
                                resolve();
                                setState((prevState) => {
                                    const data = [...prevState.data];
                                    data.splice(data.indexOf(oldData), 1);
                                    return { ...prevState, data };
                                });
                            }, 600);
                    }),
                }}
            />
        );                    
    };
     
    return renderTable(practiceList);
}