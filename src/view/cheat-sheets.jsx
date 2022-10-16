import React from "react";

import { Outlet } from "react-router-dom";

import TabNaviLayout from "/src/plug/layout/tabs-navi.layout";

const routes = {
    'HTTP Status Code': '/cheat-sheets/http/status-code',
    'HTTP Content-Type': '/cheat-sheets/http/content-type',
};

export default function CheatSheets() {
    return (
        <TabNaviLayout routes={routes}>
            <Outlet />
        </TabNaviLayout>
    );
}