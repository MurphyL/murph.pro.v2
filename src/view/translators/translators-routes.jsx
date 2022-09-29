import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import TranslatorsLayout from './layout/translators-layout.module';

const CronTranslator = React.lazy(() => import('./outlet/cron-translator'));

export default function TranslatorsRoutes() {
    return (
        <Routes>
            <Route path="/*" element={<TranslatorsLayout />}>
                <Route path="cron" element={<CronTranslator />} />
            </Route>
        </Routes>
    );
}