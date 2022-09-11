import React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import SourceIcon from '@mui/icons-material/Source';
import DynamicFormIcon from '@mui/icons-material/DynamicForm';

import { siJson } from 'simple-icons/icons';

import SimpleIconWrap from '/src/plug/widgets/container/x-icon/x-icon.module';


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
                <Tab icon={<SimpleIconWrap {...siJson} />} label="JSON" />
                <Tab icon={<SourceIcon />} label="SQL" />
                <Tab icon={<DynamicFormIcon />} label="more." />
            </Tabs>
            <div>
            </div>
        </React.Fragment>
    );
}