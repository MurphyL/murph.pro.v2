import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import styles from './options.module.css';

export default function OptionBoard({ children, title = "设置", open = false, width = 550, onClose }) {
    return (
        <Drawer anchor="right" open={open}>
            <Box className={styles.root} sx={{ width }}>
                <div className={styles.bar}>
                    <IconButton aria-label="返回" color="default" onClick={onClose}>
                        <ArrowBackIcon />
                    </IconButton>
                    <div className={styles.label}>{title}</div>
                </div>
                <div className={styles.body}>
                    {children}
                </div>
            </Box>
        </Drawer>
    );
}