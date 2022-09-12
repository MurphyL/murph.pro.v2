import React from 'react';
import { useParams } from "react-router-dom";
import { IconButton, InputBase, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';

import * as icons from 'simple-icons/icons';
import SimpleIconWrap from '/src/plug/widgets/container/x-icon/x-icon.module';

import { useDocumentTitle, useClipboard } from '/src/plug/hooks';

import styles from './icons-finder.module.css';

const si = Object.entries(icons);

export default function IconsFinder() {
    useDocumentTitle('搜索图标');
    const params = useParams();
    const copy = useClipboard();
    const { enqueueSnackbar } = useSnackbar();
    const [keyword, setKeyword] = React.useState(null);
    const doCopy = React.useCallback((key, item) => {
        copy(key);
        enqueueSnackbar(`Copied: ${item.title} - ${key}`);
    }, []);
    const filted = React.useMemo(() => {
        return ((keyword && keyword.length > 0) ? si.filter(([key, item]) => item.title.toLowerCase().includes(keyword.toLowerCase())) : si).slice(0, 200);
    }, [keyword, si]);
    return (
        <div className={styles.root}>
            <div className={styles.bar}>
                <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
                    <IconButton sx={{ p: '10px' }} aria-label="menu">
                        <SimpleIconWrap {...icons.siSimpleicons} />
                    </IconButton>
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="搜索图标……" onChange={e => { setKeyword(e.target.value) }} />
                </Paper>
            </div>
            <div className={styles.board}>
                {filted.map(([key, item]) => (
                    <div key={key} className={styles.item} onClick={() => doCopy(key, item)}>
                        <SimpleIconWrap size={32} {...item} />
                        <div className={styles.label}>{item.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}