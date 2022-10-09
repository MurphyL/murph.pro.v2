import { Avatar, Badge, IconButton } from "@mui/material";

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