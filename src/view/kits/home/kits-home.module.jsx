import React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DynamicForm, Source } from '@mui/icons-material';

import * as SI from '@icons-pack/react-simple-icons';

import { useDocumentTitle } from '/src/plug/hooks';

import styles from './kits-home.module.css';

export default function KitsHome() {
    useDocumentTitle('工具集');
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <React.Fragment>
            <Tabs className={styles.root} color="secondary" value={value} onChange={handleChange} aria-label="icon label tabs example">
                <Tab icon={<SI.Json />} label="JSON" />
                <Tab icon={<Source />} label="SQL" />
                <Tab icon={<DynamicForm />} label="more." />
            </Tabs>
        </React.Fragment>
    );
}