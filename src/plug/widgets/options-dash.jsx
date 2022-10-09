import React from "react";
import { AppBar, Box, Button, Dialog, IconButton, Slide, Toolbar, Typography } from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const OptionsDash = React.forwardRef(function OptionsDash({ children, title }, ref) {
    const [visible, setVisible] = React.useState(false);
    React.useImperativeHandle(ref, () => ({
        show() {
            setVisible(true);
        },
        hide() {
            setVisible(false);
        }
    }));
    return (
        <Dialog fullScreen open={visible} onClose={() => setVisible(false)} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" sx={{ border: '1px solid rgba(255, 255, 255, 0.05)' }} onClick={() => setVisible(false)} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">{title}</Typography>
                    <Button color="inherit" onClick={() => setVisible(false)}>Save</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 1 }}>
                { children }
            </Box>
        </Dialog>
    );
});