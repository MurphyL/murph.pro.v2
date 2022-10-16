import React from 'react';

import { Alert, AppBar, Button, Dialog, Drawer, IconButton, Slide, Stack, Toolbar, Typography } from "@mui/material";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

export function OptionBoard({ children, title = "设置", spacing = 1, direction, message, show = false, sx = { p: 2, width: 700 }, onClose }) {
    return (
        <Drawer anchor="right" open={show}>
            <Toolbar variant="dense">
                <IconButton edge="start" sx={{ mr: 2 }} onClick={onClose}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" component="div">{title}</Typography>
            </Toolbar>
            <Stack sx={sx} direction={direction} spacing={spacing}>
                {children ? children : (
                    <Alert severity="warning">{message || '没有任何配置项'}</Alert>
                )}
            </Stack>
        </Drawer>
    );
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const OptionsDash = React.forwardRef(function OptionsDash({ children, direction, message, spacing, title, onSave, onClose, saveLabel = 'Save', open = false }, ref) {
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
            <Stack direction={direction} spacing={spacing} sx={{ height: 'calc(100% - 80px)' }}>
                {children ? children : (
                    <Alert severity="warning">{message || '没有任何配置项'}</Alert>
                )}
            </Stack>
        </Dialog>
    );
});