import React from "react";

import { Outlet } from "react-router-dom";

import TabNaviLayout from "/src/plug/layout/tabs-navi.layout";

const routes = {
    'HTTP Message': '/cheat-sheets/http/message',
};

export default function CheatSheets() {
    return (
        <TabNaviLayout routes={routes} sx={{ p: '1px' }}>
            <Outlet />
        </TabNaviLayout>
    );
}