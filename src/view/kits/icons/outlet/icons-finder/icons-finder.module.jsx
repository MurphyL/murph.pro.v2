import React from 'react';

import { IconButton, InputBase, Paper } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material/';

import * as SI from '@icons-pack/react-simple-icons';
import clipboard from 'clipboardy';

import { useDocumentTitle } from '/src/plug/hooks';

import styles from './icons-finder.module.css';

const si = Object.keys(SI).map(key => ({ key, group: 'Simple Icons' }));


export default function IconsFinder() {
    useDocumentTitle('搜索图标');
    const [keyword, setKeyword] = React.useState(null);
    const doCopy = React.useCallback((name) => {
        clipboard.write(name)
            // .then(() => {
            //     console.log('Copied:', name);
            // });
    }, []);
    const filted = React.useMemo(() => {
        return ((keyword && keyword.length > 0) ? si.filter(({ key }) => key.toLowerCase().includes(keyword.toLowerCase())) : si).slice(0, 100);
    }, [keyword, si]);
    return (
        <div className={styles.root}>
            <div className={styles.bar}>
                <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
                    <IconButton sx={{ p: '10px' }} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="搜索图标……" onChange={e => { setKeyword(e.target.value) }} />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="搜索">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>
            <div className={styles.board}>
                {filted.map(({ key, group }) => {
                    const IconComp = SI[key];
                    return (
                        <div key={key} className={styles.item} data-group={group} onClick={() => doCopy(key)}>
                            <IconComp />
                            <div className={styles.label}>{key}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}