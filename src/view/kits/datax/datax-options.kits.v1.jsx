import { atom } from 'recoil';

import { SiAlibabacloud } from "react-icons/si";
import { Unstable_Grid2 as Grid2, Stack, Typography } from '@mui/material';

export const DataxIcon = SiAlibabacloud;

export function DataxOptionsDash() {
    return (
        <Stack spacing={3}>
            <Grid2 container>
                <Grid2 xs={6}>
                    <Typography variant="h6" component="div">Reader</Typography>
                </Grid2>
                <Grid2 xs={6}>
                    <Typography variant="h6" component="div">Writer</Typography>
                </Grid2>
            </Grid2>
        </Stack>
    );
}


export const dataxStore = atom({
    key: 'datax-state-v1',
    default: {
        options: {
            "job": {
                "setting": {
                    "speed": {
                        "channel": 1
                    }
                },
                "content": [
                    {
                        "reader": {
                            "name": "mysqlreader",
                            "parameter": {
                                "username": "root",
                                "password": "root",
                                "connection": [
                                    {
                                        "querySql": [
                                            "select db_id,on_line_flag from db_info where db_id < 10;"
                                        ],
                                        "jdbcUrl": [
                                            "jdbc:mysql://bad_ip:3306/database",
                                            "jdbc:mysql://127.0.0.1:bad_port/database",
                                            "jdbc:mysql://127.0.0.1:3306/database"
                                        ]
                                    }
                                ]
                            }
                        },
                        "writer": {
                            "name": "streamwriter",
                            "parameter": {
                                "print": false,
                                "encoding": "UTF-8"
                            }
                        }
                    }
                ]
            }
        }
    }
});

