import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";


import SnippetRootStage from "./layout/root-stage/snippet-root-stage.module";

import SnippetInfo from './outlet/snippet-info/snippet-info.module';

export default function SnippetsRoutes() {
    return (
        <Routes>
            <Route path="/" element={<SnippetRootStage />}>
                <Route path="/:fileType/:fileName" element={<SnippetInfo />} />
            </Route>
        </Routes>
    );
}