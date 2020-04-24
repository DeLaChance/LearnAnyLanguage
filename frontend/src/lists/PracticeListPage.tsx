import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PracticeList } from '../domain/PracticeList';
import config from '../config/config.json'
import PracticeListTable from './PracticeListTable';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function PracticeListPage() {

    let { practiceListId } = useParams();
    if (practiceListId == null) {
        throw new Error("practice list id is null");
    }

    // Hooks
    const [practiceList, setPracticeList] = useState<PracticeList>();
    // Similar to componentDidMount and componentDidUpdate in React.Component.
    useEffect(() => {
        preparePracticeList();
    }, []); 

    const preparePracticeList = async function(): Promise<void> {

        let httpReponse = await fetch(config.backendBaseUrl + "lists/" + practiceListId);
        if (httpReponse.status == 200) {
            let responseJson = await httpReponse.json();
            let practiceList: PracticeList = PracticeList.from(responseJson);                        
            setPracticeList(practiceList);
            console.log(`Set practiceList to ${practiceList}`);
            return Promise.resolve();
        } else {
            return Promise.reject("Backend is down.");
        }
    };

    const renderLoadingComponent = () => {
        return (
            <CircularProgress />
        );
    };

    if (practiceList == null) {
        return renderLoadingComponent();
    } else {
        return (
            <PracticeListTable practiceList={practiceList} />
        );
    }    
}

