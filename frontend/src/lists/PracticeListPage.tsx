import React from 'react';
import { useParams } from 'react-router-dom';
import PracticeListTable from './PracticeListTable';

export default function PracticeListPage() {

    let { practiceListId } = useParams();
    if (practiceListId) {
        return (
            <PracticeListTable practiceListId={practiceListId}/>
        );    
    } else {
        throw new Error("practice list id is null");
    }
}

