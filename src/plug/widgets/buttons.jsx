import React from "react";
import { Avatar, Badge, Button, ButtonGroup, ClickAwayListener, Grow, IconButton, MenuItem, MenuList, Paper, Popper } from "@mui/material";
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

export function ButtonOptions({ label = 'Button', onClick, selected, options = [] }) {
    const anchorRef = React.useRef(null);
    const [state, dispatch] = React.useReducer((state, action) => {
        return { ...state, ...action };
    }, { options, selected: selected || options[0], pop: false });
    return (
        <React.Fragment>
            <ButtonGroup variant="contained" aria-label="button and actions">
                <Button onClick={onClick ? e => onClick(e, state.selected) : null}>{label}</Button>
                <Button endIcon={<ArrowDropDownIcon />} ref={anchorRef} onClick={() => dispatch({ pop: true })}>
                    {state.selected}
                </Button>
            </ButtonGroup>
            <Popper open={state.pop} sx={{ zIndex: 1 }} anchorEl={anchorRef.current} disablePortal>
                <Paper>
                    <ClickAwayListener onClickAway={() => dispatch({ pop: false })}>
                        <MenuList autoFocusItem>
                            {options.map((option) => (
                                <MenuItem key={option} selected={option === state.selected} onClick={() => dispatch({ selected: option, pop: false })} >
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