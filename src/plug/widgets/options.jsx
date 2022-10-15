import React from 'react';

import { Alert, AppBar, Box, Button, Dialog, Drawer, IconButton, Slide, Slider, Stack, Toolbar, Typography } from "@mui/material";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

export function OptionBoard({ title = "设置", show = false, width = 1000, options, onClose }) {
    return (
        <Drawer anchor="right" open={show}>
            <Toolbar variant="dense">
                <IconButton edge="start" sx={{ mr: 2 }} onClick={onClose}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" component="div">{title}</Typography>
            </Toolbar>
            <Box sx={{ width }}>
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
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const OptionsDash = React.forwardRef(function OptionsDash({ children, direction, spacing, title, onSave, onClose, saveLabel = 'Save', open = false }, ref) {
    const [visible, setVisible] = React.useState(open);
    React.useImperativeHandle(ref, () => ({
        show() {
            setVisible(true);
        },
        hide() {
            doClose();
        }
    }));
    const doClose = () => {
        onClose && onClose.apply && onClose.apply(null);
        setVisible(false);
    };
    return (
        <Dialog fullScreen open={visible} onClose={doClose} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" sx={{ border: '1px solid rgba(255, 255, 255, 0.05)' }} onClick={doClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">{title}</Typography>
                    <Button color="inherit" onClick={onSave}>{saveLabel}</Button>
                </Toolbar>
            </AppBar>
            <Stack direction={direction} spacing={spacing} sx={{ height: 'calc(100% - 80px)' }}>{children}</Stack>
        </Dialog>
    );
});