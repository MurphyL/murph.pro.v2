import { useOutletContext } from "react-router-dom";

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import CodeIcon from '@mui/icons-material/Code';
import FunctionsIcon from '@mui/icons-material/Functions';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';

export default function PlaintextKitsReference() {
    const { languageInfo } = useOutletContext();
    return languageInfo ? (
        <List dense>
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <CodeIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={languageInfo.aliases[0]} secondary="语言名称" />
            </ListItem>
            {languageInfo.mimetypes && languageInfo.extensions.length > 0 && (
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <DriveFileMoveIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={languageInfo.extensions.slice(0, 2).join('，')} secondary="常见扩展名" />
                </ListItem>
            )}
            {languageInfo.mimetypes && languageInfo.mimetypes.length > 0 && (
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <FunctionsIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={languageInfo.mimetypes.slice(0, 2).join('，')} secondary="MIME-Types" />
                </ListItem>
            )}
        </List>
    ) : null;
}