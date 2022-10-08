import { atom } from 'recoil';

import { SiAlibabacloud } from "react-icons/si";

export const DataxIcon = SiAlibabacloud;

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

