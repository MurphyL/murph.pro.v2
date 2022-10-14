import React from "react";
import { styled, Avatar, Badge, Button, ButtonGroup, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';


const wrapExtra = (extra, message) => (<Avatar sx={{ width: 20, height: 20, border: '2px solid #fcfcfc' }} alt={message}>{extra}</Avatar>);

export default function ExtraButton({ children, extra, onClick, message }) {
    return (
        <IconButton onClick={onClick}>
            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={wrapExtra(extra, message)}>
                <Avatar>
                    {children}
                </Avatar>
            </Badge>
        </IconButton>
    );
}

export function BadgeButton() {
    return null;
}

export function ButtonActions({ labelPrefix = '', onClick, options = [] }) {
    const anchorRef = React.useRef(null);
    const [state, dispatch] = React.useReducer((state, action) => {
        return { ...state, ...action };
    }, { options, action: options[0], pop: false });
    return (
        <React.Fragment>
            <ButtonGroup variant="contained" ref={anchorRef} aria-label="button and actions">
                <Button onClick={onClick ? e => onClick(e, state.action) : null}>{`${labelPrefix} ${state.action || ''}`.trim()}</Button>
                <Button size="small" onClick={() => dispatch({ pop: true })}>
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper open={state.pop} sx={{ zIndex: 1 }} anchorEl={anchorRef.current} disablePortal>
                <Paper>
                    <ClickAwayListener onClickAway={() => dispatch({ pop: false })}>
                        <MenuList autoFocusItem>
                            {options.map((option) => (
                                <MenuItem key={option} selected={option === state.action} onClick={() => dispatch({ action: option, pop: false })} >
                                    {option}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Popper>
        </React.Fragment>
    );
}