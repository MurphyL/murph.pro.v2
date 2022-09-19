import React from 'react';

import Input from '@mui/material/Input';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Group from '/src/plug/widgets/container/group/group.v1.module';

import CodeEditor from "/src/plug/widgets/code/editor/code-editor.v1.module";
import Splitter from "/src/plug/widgets/container/splitter/splitter.v1.module";

import * as JSONKits from '/src/view/kits/json/json-kits.v1';

import DATAX_TEMPLATE from './datax-options.template.json';
import DATAX_PROXIES from './datax-options.proxies.json';

import OPTIONS_REDUCER from './datax-options.reducer';

import styles from './datax-options.module.css';

const proxies = {
    readers: {},
    writers: {},
};

Object.entries(DATAX_PROXIES).forEach(([label, { reader, writer }]) => {
    if(reader) {
        proxies.readers[label] = reader;
    }
    if(writer) {
        proxies.writers[label] = writer;
    }
});

export default function DataXOptionsMaker() {
    const [ state, dispatch ] = React.useReducer(OPTIONS_REDUCER, DATAX_TEMPLATE);
    const value = React.useMemo(() => JSON.stringify(state, null, 2), [state]);
    return (
        <Splitter className={styles.root} sizes={[65, 35]} minSizes={[700, 300]}>
            <CodeEditor language="json" defaultValue={value} />
            <div className={styles.extra}>
                <SettingsGroup title="Reader 配置" />
                <SettingsGroup title="Writer 配置" />
                <SettingsGroup title="通用配置" />
            </div>
        </Splitter>
    );
}

function SettingsGroup({ title }) {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                <Typography>{ title }</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
                </div>
            </AccordionDetails>
        </Accordion>
    );
}