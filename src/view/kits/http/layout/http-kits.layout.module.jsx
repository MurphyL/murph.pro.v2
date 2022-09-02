import { Outlet } from "react-router-dom";

import styles from './http-kits.layout.module.css';

export default function HttpKitsLayout() {
    return (
        <div className={styles.root}>
            <Outlet />
        </div>
    );
}