import React from "react";
import { Outlet } from "react-router-dom";

import styles from './navi-stage.layout.module.css';

export default function NaviStageLayout() {
    return (
        <div className={styles.root}>
            <Outlet />
        </div>
    );
}