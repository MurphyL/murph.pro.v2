import React from "react";
import { Routes, Route } from "react-router-dom";

import KitsV1Layout from './kits.v1-layout';

import { GithubIssueCreator } from './outlet/github-issue';

const CronParser = React.lazy(() => import('./outlet/cron-parser'));
const DatetimeKits = React.lazy(() => import('./outlet/datetime-kits'));
const CryptoDotJsKits = React.lazy(() => import('./outlet/crypto.js-kits'));



export default function KitsV1Routes() {
    return (
        <Routes>
            <Route path="/*" element={<KitsV1Layout />}>
                <Route index={true} element={<div>Kits home</div>} />
                <Route path="cron" element={<CronParser />} />
                <Route path="datetime" element={<DatetimeKits />} />
                <Route path="cryptodotjs" element={<CryptoDotJsKits />} />
                <Route path="github" >
                    <Route path="create/issue" element={<GithubIssueCreator />} />
                </Route>
            </Route>
        </Routes >
    );
}