import React from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Slider from '@mui/material/Slider';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import IconButton from '@mui/material/IconButton';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import styles from './options.module.css';

export default function OptionBoard({ title = "设置", show = false, width = 1000, options, onClose, updateOption }) {
    return (
        <Drawer className={styles.root} anchor="right" open={show}>
            <Toolbar variant="dense">
                <IconButton edge="start" sx={{ mr: 2 }} onClick={onClose}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" component="div">{title}</Typography>
            </Toolbar>
            <Box className={styles.body} sx={{ width }}>
                {options ? (
                    <div style={{ width: '90%', lineHeight: '2rem' }}>
                        {Object.entries(options).map(([key, option]) => (
                            <div key={key} style={{ display: 'flex', height: '2rem' }}>
                                <div style={{ flex: 1 }}>{option.label}</div>
                                <div style={{ flex: 2 }}>
                                    <OptionItem option={option} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Alert severity="warning">没有任何配置项</Alert>
                )}
            </Box>
        </Drawer>
    );
}

function OptionItem({ option }) {
    console.log(option);
    switch (option.type) {
        case Number:
            if (option.range) {
                const [min, max] = option.range;
                return (
                    <Slider marks defaultValue={option.value} min={min} max={max} valueLabelDisplay="on" />
                );
            } else {
                return null;
            }
        default:
            return (
                <Alert severity="warning">不支持的配置项：{option.type}</Alert>
            );
    }
    return (
        <div></div>
    );
}